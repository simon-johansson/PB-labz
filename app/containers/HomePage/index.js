/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import Helmet from 'react-helmet';
import _ from 'lodash';
import * as ls from 'utils/localstorage';
import Switch from 'react-ios-switch';

// import messages from './messages';
import { createStructuredSelector } from 'reselect';

import {
  selectLoading,
  selectError,
  selectJobs,
  selectAmount,
  selectRelated,
  selectCompetences,
  selectKnownCompetences,
  selectTotalAmount,
} from 'containers/App/selectors';

import {
  selectOccupations,
  selectLocations,
  selectUiState,
  selectCurrentTab,
  selectShowMatchingJobs,
  selectShowNonMatchningJobs,
  selectShouldLoadNewJobs,
  selectScrollPosition,
} from 'containers/ListPage/selectors';

import {
  setOccupations,
  setLocations,
  removeOccupation,
  removeLocation,
  setUiState,
} from 'containers/ListPage/actions';

import {
  loadJobs,
  getTotalAmount,
  setAppState,
} from 'containers/App/actions';

import { FormattedMessage } from 'react-intl';
import RepoListItem from 'containers/RepoListItem';
import JobListItem from 'components/JobListItem';
import CompetenceListItem from 'components/CompetenceListItem';
import IosMenu from 'components/IosMenu';
import Button from 'components/Button';
import H2 from 'components/H2';
import List from 'components/List';
import ListSeperated from 'components/ListSeperated';
import ListItem from 'components/ListItem';
import ListItemSeperated from 'components/ListItemSeperated';
import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';

const momentOptions = {
  sameDay: '[Idag] LT',
  lastDay: '[Igår] LT',
  lastWeek: 'DD MMM',
  sameElse: 'DD MMM',
};

export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amountPrevious: 3,
      savedSearches: ls.getFavoriteSearchs(),
      previousSearchs: ls.getPreviousSearchs(),
      editSaved: false,
      editPrevious: false,
      showSaveSearchPopup: false,
      indexToSave: null,
    };

    this.onSeachButtonClick = this.onSeachButtonClick.bind(this);
  }

  componentDidMount() {
    this.props.setAppState({ searches: '/' });

    this.props.onSetLocations();
    this.props.onSetOccupations();
    // this.props.onSubmitForm();

    if (!this.props.totalAmount) {
      this.props.onGetTotalAmount();
    }
  }

  openRoute = (route) => {
    setTimeout(() => {
      this.props.changeRoute(route);
    }, 1);
  };

  addListPage = () => {
    this.openRoute('/list');
  };

  addFilterPage = () => {
    this.openRoute('/filter/home');
  };

  addOccupationPage = () => {
    this.openRoute('/occupation');
  };

  addLocationPage = () => {
    this.openRoute('/location');
  };

  createOccupationTags() {
    return this.props.occupations.map((item, index) => {
      return (
        <div
          className={styles.tag}
          onClick={this.removeOccupationTag.bind(this, index)}
          key={`occupations-${index}`}
        >
          <span className={styles.tagText}>
            {item.namn}
            <span className="glyphicon glyphicon-remove" />
          </span>
        </div>
      );
    });
  }

  createLocationTags() {
    return this.props.locations.map((item, index) => {
      return (
        <div
          className={styles.tag}
          onClick={this.removeLocationTag.bind(this, index)}
          key={`locations-${index}`}
        >
          <span className={styles.tagText}>
            {item.namn}
            <span className="glyphicon glyphicon-remove" />
          </span>
        </div>
      );
    });
  }

  removeOccupationTag(index, e) {
    e.stopPropagation();
    this.props.onRemoveOccupation(index);
  }

  removeLocationTag(index, e) {
    e.stopPropagation();
    this.props.onRemoveLocation(index);
  }

  onSeachButtonClick() {
    // this.props.onSetLocations(ls.getPreviousLocation().locations);
    this.props.onSetLocations();
    this.props.onSetOccupations();
    this.addFilterPage();
  }

  onChangeNotify(index, shouldNotify) {
    const searches = this.state.savedSearches.slice();
    const search = searches[index];
    search.notify = shouldNotify;
    searches[index] = search;

    this.setState({ savedSearches: searches });
    ls.setFavoriteSearchs(searches);
  }

  onDeleteSaved(index) {
    const searches = this.state.savedSearches.slice();
    searches.splice(index, 1);

    this.setState({ savedSearches: searches });
    ls.deleteFavoriteSearch(index);
  }

  onDeletePrevious(index) {
    const searches = this.state.previousSearchs.slice();
    searches.splice(index, 1);

    this.setState({ previousSearchs: searches });
    ls.deletePreviousSearch(index);
  }

  onSavePrevious(index) {
    this.setState({
      showSaveSearchPopup: true,
      indexToSave: index,
      editPrevious: false,
    });
  }

  onSaveConfirm(shouldNotify) {
    const previous = this.state.previousSearchs[this.state.indexToSave];
    previous.notify = shouldNotify;

    ls.newFavoriteSearch({
      occupations: previous.occupations,
      locations: previous.locations,
      time: new Date().valueOf(),
      notify: shouldNotify,
    });

    this.setState({
      showSaveSearchPopup: false,
      savedSearches: [previous, ...this.state.savedSearches],
    });
  }

  savedSearches() {
    const content = this.state.savedSearches.map((item, index) => {
      const occupations = item.occupations.map(i => i.namn).join(', ') || 'Alla yrken';
      const locations = item.locations.map(i => i.namn).join(' & ') || 'Hela Sverige';

      return (
        <div
          className={this.state.editSaved ? styles.editSavedSearchesWrapper : styles.savedSearchesWrapper}
          onClick={!this.state.editSaved ? this.onClickPreviousSearch.bind(this, item) : () => {}}
        >
          <div className={styles.previousSearcheParameters}>
            {item.notify &&
              <span className={styles.bell + ' iosIcon'}></span>
              /*<span className={styles.bell + ' glyphicon glyphicon-bell'} />*/
            }
            <span className={styles.occupations}>{occupations}</span> <br />
            <span className={styles.small}>{locations}</span>
            {/*this.state.editSaved &&
              <div className={styles.notifyRow}>
                <span className={styles.notifyText}>Notiser för nya jobb</span>
                <Switch
                  checked={item.notify}
                  onChange={() => {}}
                />
                <div className={styles.rowOverlay} onClick={this.onChangeNotify.bind(this, index, !item.notify)} />
              </div>
            */}
          </div>
          {this.state.editSaved ?
            <div>
              <div
                className={styles.updateNotify}
                onClick={this.onChangeNotify.bind(this, index, !item.notify)}
              >
                {/*<span className={styles.notifyIcon + ' iosIcon'}></span>*/}
                {!item.notify ?
                  'Slå på notiser' :
                  'Stäng av notiser'
                }
              </div>
              <div
                className={styles.deleteSaved}
                onClick={this.onDeleteSaved.bind(this, index)}
              >
                {/*<span className={styles.deleteIcon + ' iosIcon'}></span>*/}
                Ta bort
              </div>
            </div> :
            <div>
              {/*<span className={styles.newJobs}>{Math.floor(Math.random() * 15)}</span>*/}
              <span className={styles.chevronIcon + ' iosIcon'}></span>
            </div>
          }
        </div>
      )
    });

    if (!content.length) {
      content.push(
        <div className={styles.leftAlign}>
          <br />
          <span className={styles.noSearches}>Du har inga sparade sökningar</span>
          <br />
          <br />
        </div>
      );
    }
    return content;
  }

  previousSearches() {
    const searches = ls.getPreviousSearchs().slice(0, this.state.amountPrevious);
    const content = searches.map((item, index) => {
      const occupations = item.occupations.map(i => i.namn).join(', ') || 'Alla yrken';
      const locations = item.locations.map(i => i.namn).join(' & ') || 'Hela Sverige';

      return (
        <div
          className={this.state.editPrevious ? styles.editPreviousSearchesWrapper : styles.previousSearchesWrapper}
          onClick={!this.state.editPrevious ? this.onClickPreviousSearch.bind(this, item) : () => {}}
        >
          <div className={styles.previousSearcheParameters}>
            <span className={styles.occupations}>{occupations}</span> <br />
            <span className={styles.small}>{locations}</span>
          </div>
          {this.state.editPrevious ?
            <div>
              <div
                className={styles.deleteSaved}
                onClick={this.onDeletePrevious.bind(this, index)}
              >
                {/*<span className={styles.deleteIcon + ' iosIcon'}></span>*/}
                Ta bort
              </div>
              <div
                className={styles.savePrevious}
                onClick={this.onSavePrevious.bind(this, index)}
              >
                <span className={styles.savePreviousIcon}>
                  Spara
                </span>
              </div>
            </div> :
            <div>
              {/*<span className={styles.previousSearcheTime}>{moment(item.time).calendar(null, momentOptions)}</span>*/}
              <span className={styles.chevronIcon + ' iosIcon'}></span>
            </div>
          }
        </div>
      )
    });

    if (!content.length) {
      content.push(
        <div className={styles.leftAlign}>
          <br />
          <span className={styles.noSearches}>Du har inga tidigare sökningar</span>
          <br />
          <br />
        </div>
      );
    }
    return content;
  }

  onClickPreviousSearch(search) {
    this.props.onSetOccupations(search.occupations);
    this.props.onSetLocations(search.locations);
    this.addListPage();
  }

  editAll() {
    this.onEditSaved();
    this.onEditsPrevious();
  }

  onEditSaved() {
    this.setState({ editSaved: !this.state.editSaved });
  }

  onEditsPrevious() {
    this.setState({ editPrevious: !this.state.editPrevious });
  }

  createSearchSummary() {
    const previous = this.state.previousSearchs[this.state.indexToSave];
    const occupations = JSON.parse(JSON.stringify(previous.occupations)).map((item, index) => item.namn);
    const locations = JSON.parse(JSON.stringify(previous.locations)).map((item, index) => item.namn);
    let str = '';
    if (occupations.length) str += `för ${occupations.join(' & ')}`;
    if (locations.length) str += ` i ${locations.join(', ')}`;
      // else if (!str && locations.length) str += `${locations.join(', ')}`
    return str;
  }

  render() {
    let mainContent = null;
    let matchingContent = null;
    const matchingJobs = [];
    const nonMatchingJobs = [];

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      console.log('loading');
    } else if (this.props.error !== false) {
      console.log('error');
    } else if (this.props.jobs !== false) {
      // console.log(this.props.jobs);
    }

    return (
      <article ref="list" className="noselect">
        <div className={styles.contentWrapper}>
          <div className={styles.searchForm}>
            <span
              className={styles.edit}
              onClick={this.editAll.bind(this)}
            >
              { (this.state.editSaved || this.state.editPrevious) ? 'Klar' : 'Ändra' }
            </span>
            <h1>
              {/*<span className={styles.homeIcon + ' glyphicon glyphicon-home'} />*/}
              Mina sökningar
            </h1>
          </div>

          {!(!this.state.savedSearches.length && !this.state.previousSearchs.length) &&
            <button
              className={styles.searchButton + ' btn btn-default'}
              onClick={this.onSeachButtonClick}
            >
              <span className={styles.searchIcon + " iosIcon"}></span>
              Ny sökning
            </button>
          }

          <div className={(!this.state.savedSearches.length && !this.state.previousSearchs.length) ? styles.firstWelcome : styles.welcome}>
            {!this.state.savedSearches.length && !this.state.previousSearchs.length &&
              <p>Välkommen till Platsbanken!</p>
            }
            <p className={styles.amount}>
              Just nu,&nbsp;
              <span className={styles.totalAmount}>
                { !this.props.totalAmount ?
                  <LoadingIndicator options={{size: 'small', color: 'dark'}} /> :
                  `${this.props.totalAmount} `
                }
              </span>
              lediga jobb.
            </p>
          </div>

          {(!this.state.savedSearches.length && !this.state.previousSearchs.length) &&
            <button
              className={styles.searchButton + ' btn btn-default'}
              onClick={this.onSeachButtonClick}
            >
              <span className={styles.searchIcon + " iosIcon"}></span>
              Ny sökning
            </button>
          }

          <div className={styles.latestSearches}>
            {!!this.state.savedSearches.length &&
              <div>
                <span className={styles.listHeader}>
                  Sparade sökningar
                  {!!this.state.savedSearches.length && false &&
                    <span
                      className={styles.pencil}
                      onClick={this.onEditSaved.bind(this)}
                    >
                      <span className={styles.pencilIcon + ' iosIcon'}></span>
                      &nbsp;
                      { this.state.editSaved ? 'Klar' : 'Ändra' }
                    </span>
                  }
                </span>
                <ListSeperated items={this.savedSearches()} component={ListItemSeperated} />
              </div>
            }

            {!!this.state.previousSearchs.length &&
              <div>
                <span className={styles.listHeader}>
                  Tidigare sökningar
                  {!!this.state.previousSearchs.length && false &&
                    <span
                      className={styles.pencil}
                      onClick={this.onEditsPrevious.bind(this)}
                    >
                      <span className={styles.pencilIcon + ' iosIcon'}></span>
                      &nbsp;
                      { this.state.editPrevious ? 'Klar' : 'Ändra' }
                    </span>
                  }
                </span>
                <ListSeperated items={this.previousSearches()} component={ListItemSeperated} />
              </div>
            }
          </div>
        </div>
        <IosMenu
          changeRoute={this.props.changeRoute}
        />
        {this.state.showSaveSearchPopup &&
          <div className={styles.overlay}>
            <div className={styles.saveSearchPopup}>
              <p className={styles.popupText}>
                {/*<span className={styles.bell + ' glyphicon glyphicon-bell'} />*/}
                {/*Din sökning är sparad. Vill du få notiser när nya jobb dyker upp {this.createSearchSummary() || 'denna sökning'}?*/}
                Din sökning är sparad. Vill du få notiser när nya jobb dyker upp för denna sökning?
              </p>
              <div
                className={styles.leftConfirmButton}
                onClick={this.onSaveConfirm.bind(this, true)}
              >
                <span className={styles.bell + ' iosIcon'}></span>
                Ja
              </div>
              <div
                className={styles.rightConfirmButton}
                onClick={this.onSaveConfirm.bind(this, false)}
              >Nej</div>
            </div>
          </div>
        }
      </article>
    );
  }
}

HomePage.propTypes = {
  changeRoute: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  jobs: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  occupations: React.PropTypes.object,
  locations: React.PropTypes.object,
  jobLocation: React.PropTypes.string,
  onRemoveOccupation: React.PropTypes.func,
  onRemoveLocation: React.PropTypes.func,
  setUiState: React.PropTypes.func,
  onSetLocations: React.PropTypes.func,
  onSetOccupations: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onRemoveOccupation: (index) => dispatch(removeOccupation(index)),
    onRemoveLocation: (index) => dispatch(removeLocation(index)),
    onSetLocations: (location) => dispatch(setLocations(location)),
    onSetOccupations: (occupation) => dispatch(setOccupations(occupation)),
    setUiState: (state) => dispatch(setUiState(state)),
    changeRoute: (url) => dispatch(push(url)),
    onGetTotalAmount: () => dispatch(getTotalAmount()),
    setAppState: (state) => dispatch(setAppState(state)),
    // onSubmitForm: (evt) => {
    //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //   dispatch(loadRepos());
    // },
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadJobs());
    },

    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  jobs: selectJobs(),
  amount: selectAmount(),
  related: selectRelated(),
  uiState: selectUiState(),
  currentTab: selectCurrentTab(),
  showMatchingJobs: selectShowMatchingJobs(),
  scrollPosition: selectScrollPosition(),
  showNonMatchningJobs: selectShowNonMatchningJobs(),
  competences: selectCompetences(),
  knownCompetences: selectKnownCompetences(),
  occupations: selectOccupations(),
  shouldLoadNewJobs: selectShouldLoadNewJobs(),
  locations: selectLocations(),
  totalAmount: selectTotalAmount(),
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);