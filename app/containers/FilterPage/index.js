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
import Slider from 'react-rangeslider';

// import messages from './messages';
import { createStructuredSelector } from 'reselect';

import {
  selectRepos,
  selectLoading,
  selectError,
  selectJobs,
  selectAmount,
  selectRelated,
  selectCompetences,
  selectAreas,
  selectKnownCompetences,
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
  removeOccupation,
  removeLocation,
  setUiState,
} from 'containers/ListPage/actions';
import {
  loadJobs,
} from 'containers/App/actions';

import { FormattedMessage } from 'react-intl';
import RepoListItem from 'containers/RepoListItem';
import JobListItem from 'components/JobListItem';
import CompetenceListItem from 'components/CompetenceListItem';
import IosMenu from 'components/IosMenu';
import Button from 'components/Button';
import H2 from 'components/H2';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';

export class FilterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      range: 10,
      employment: {
        ordinary: true,
        summer: true,
        needs: true,
      }
    };

    this.onSeachButtonClick = this.onSeachButtonClick.bind(this);
  }

  componentDidMount() {
    if (this.props.shouldLoadNewJobs) {
      this.props.onSubmitForm();
    }
  }

  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  goBack = () => {
    if (this.props.params.home) {
      this.openRoute('/');
    } else {
      this.openRoute('/list');
    }
  };

  addListPage = () => {
    this.openRoute('/list');
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
    ls.newPreviousSearch({
      occupations: this.props.occupations,
      locations: this.props.locations,
      time: new Date().valueOf(),
    });
    this.addListPage();
  }

  shouldShowSearchButton() {
    // return !!this.props.occupations.size || !!this.props.locations.size;
    return true;
  }

  rangeChange(range) {
    this.setState({ range });
  }

  createAreaFilter() {
    return this.props.areas.slice(0, 7).map((area, index) => {
      return (
        <button onClick={this.toggleActive.bind(this)} key={'area-filter-' + index}>
          {area.namn} ({area.amount})
        </button>
      );
    });
  }

  shouldShowAreaFilter() {
    let freetext;
    this.props.occupations.forEach(i => freetext = i.typ === 'FRITEXT' ? true : false);
    return !this.props.loading &&
           (this.props.areas.length > 1) &&
           (freetext || !!this.props.locations.size);
  }

  toggleActive(e) {
    let className = e.target.className;
    e.target.className = className ? '' : 'activeFilterButton';
  }

  render() {
    let mainContent = null;
    let matchingContent = null;
    const matchingJobs = [];
    const nonMatchingJobs = [];

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      // console.log('loading');
    } else if (this.props.error !== false) {
      // console.log('error');
    } else if (this.props.jobs !== false) {
      // console.log(this.props.jobs);
    }

    return (
      <article ref="list" className="noselect">
        <div className={styles.contentWrapper}>
          <div className={styles.searchForm}>
            <h1>
              {this.props.params.home ?
                <span>Ny sökning</span> :
                <span>Ändra sökningen</span>
              }
            </h1>
            <span className={styles.cancel} onClick={this.goBack}>Avbryt</span>
          </div>

          <form className={styles.searchWrapper}>
            <p>Jag vill jobba som</p>
            <div className="form-group">
              <div className={styles.tagsWrapper} onClick={this.addOccupationPage}>
                {this.createOccupationTags()}
                <span className={styles.inputPlaceholder}>
                  Lägg till yrke/fritext...
                </span>
              </div>
            </div>

            <p>Jag vill jobba i</p>
            <div className="form-group">
              <div className={styles.tagsWrapper} onClick={this.addLocationPage}>
                {this.createLocationTags()}
                <span className={styles.inputPlaceholder}>
                  Lägg till ort...
                </span>
              </div>
            </div>
          </form>

          <p className={styles.sectionHeader}>Sortera</p>
          <section className={styles.sortingWrapper}>
            <div className={styles.buttonGroup}>
              <button className='activeFilterButton'>Publiceringsdatum</button>
              <button>Sista ansökningsdagen</button>
              <button>Avstånd</button>
            </div>
          </section>

          <p className={styles.sectionHeader}>Filtrera</p>
          <section className={styles.sortingWrapper}>

            {/*<hr className={styles.noMarginTop} />*/}

            <p>Anställningstyp</p>
            <div className={styles.buttonWrapper}>
              <button className='activeFilterButton' onClick={this.toggleActive.bind(this)}>Vanlig</button>
              <button className='activeFilterButton' onClick={this.toggleActive.bind(this)}>Sommarjobb</button>
              <button className='activeFilterButton' onClick={this.toggleActive.bind(this)}>Efter behov</button>
            </div>

            <hr />

            <p>Omfattning</p>
            <div className={styles.buttonWrapper}>
              <button className='activeFilterButton' onClick={this.toggleActive.bind(this)}>Heltid</button>
              <button className='activeFilterButton' onClick={this.toggleActive.bind(this)}>Deltid</button>
            </div>

            <hr />

            {!!this.props.locations.size &&
              <div>
                <p>Sökradie</p>
                <div>{this.state.range} km från {this.props.locations.map(l => l.namn).join(' eller ')}</div>
                <Slider
                  value={this.state.range}
                  orientation='horizontal'
                  onChange={this.rangeChange.bind(this)}
                />

                <hr />
              </div>
            }

            {this.shouldShowAreaFilter() &&
              <div>
                <p>Visa endast annonser inom yrkesområden</p>
                  <div className={styles.buttonWrapper}>
                    {this.createAreaFilter()}
                  </div>
                <hr />
              </div>
            }


            <p>Visa endast annonser med ordet</p>
            <form autoComplete="off">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="freetext-filter"
                  placeholder="T.ex: Engelska"
                  autoComplete="off"
                />
              </div>
            </form>
          </section>

          {this.shouldShowSearchButton() &&
            // <buttontrue;
            <button
              className={styles.searchButton + ' btn btn-default'}
              onClick={this.onSeachButtonClick}
            >
              <span className={styles.searchIcon + " glyphicon glyphicon-search"} />
              Visa <span>
              { this.props.loading ?
                <LoadingIndicator options={{size: 'small'}} /> :
                this.props.amount
              }
              </span> jobb
            </button>
          }
        </div>
        <IosMenu />
      </article>
    );
  }
}

FilterPage.propTypes = {
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
  occupations: React.PropTypes.array,
  locations: React.PropTypes.array,
  jobLocation: React.PropTypes.string,
  onRemoveOccupation: React.PropTypes.func,
  onRemoveLocation: React.PropTypes.func,
  setUiState: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onRemoveOccupation: (index) => dispatch(removeOccupation(index)),
    onRemoveLocation: (index) => dispatch(removeLocation(index)),
    setUiState: (state) => dispatch(setUiState(state)),
    changeRoute: (url) => dispatch(push(url)),
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
  areas: selectAreas(),
  knownCompetences: selectKnownCompetences(),
  occupations: selectOccupations(),
  shouldLoadNewJobs: selectShouldLoadNewJobs(),
  locations: selectLocations(),
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(FilterPage);