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
  selectTotalAmount,
  selectAdditionalAds,
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
  shouldLoadNewJobs,
} from 'containers/ListPage/actions';
import {
  loadJobs,
  getTotalAmount,
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
      },
      areaFilter: [],
    };

    this.onSeachButtonClick = this.onSeachButtonClick.bind(this);
  }

  componentDidMount() {
    if (this.props.shouldLoadNewJobs &&
       (!!this.props.occupations.size || !!this.props.locations.size)) {
      this.props.onSubmitForm();
    } else if (!this.props.totalAmount) {
      this.props.onGetTotalAmount()
    }

    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, 1);
  }

  openRoute = (route) => {
    setTimeout(() => {
      this.props.changeRoute(route);
    }, 100);
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
    this.props.onShouldLoadNewJobs();
    this.addListPage();
  }

  shouldShowSearchButton() {
    // return !!this.props.occupations.size || !!this.props.locations.size;
    return true;
  }

  rangeChange(range) {
    this.setState({ range });
  }

  toggleAreaFilter(area, e) {
    // console.log(area);

    let className = e.target.className;
    e.target.className = className ? '' : 'activeFilterButton';
  }

  createAreaFilter() {
    return this.props.areas.slice(0, 7).map((area, index) => {
      return (
        <button
          onClick={this.toggleAreaFilter.bind(this, area)}
          key={'area-filter-' + index}
        >
          {area.namn} ({area.amount})
        </button>
      );
    });
  }

  shouldShowAreaFilter() {
    let freetext;
    this.props.occupations.forEach(i => freetext = i.typ === 'FRITEXT' ? true : false);
    if (!this.props.loading && (this.props.areas.length > 1)) {
      if (freetext) return true;
      if (!this.props.occupations.size && this.props.locations.size) return true;
    }
  }

  toggleActive(e) {
    let className = e.target.className;
    e.target.className = className ? '' : 'activeFilterButton';
  }

  buttonAmount() {
    if (!!this.props.occupations.size || !!this.props.locations.size) {
      if (this.props.loading) return <LoadingIndicator options={{size: 'small'}} />;
      else return this.props.amount;
    } else {
      if (!this.props.totalAmount) return <LoadingIndicator options={{size: 'small'}} />;
      else return this.props.totalAmount;
    }
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

            <p>Visa endast annonser inkommna</p>
            <div className={styles.buttonGroup}>
              <button>Idag</button>
              <button>Senaste veckan</button>
              <button>Senaste månaden</button>
            </div>

            <hr />

            <p>Anställningstyp</p>
            <div className={styles.buttonWrapper}>
              <button className='activeFilterButton' onClick={this.toggleActive.bind(this)}>Vanlig</button>
              <button onClick={this.toggleActive.bind(this)}>Sommarjobb</button>
              <button onClick={this.toggleActive.bind(this)}>Efter behov</button>
            </div>

            <hr />

            <p>Omfattning</p>
            <div className={styles.buttonWrapper}>
              <button className='activeFilterButton' onClick={this.toggleActive.bind(this)}>Heltid</button>
              <button onClick={this.toggleActive.bind(this)}>Deltid</button>
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


            <p>Visa endast annonser med ordet...</p>
            <form autoComplete="off">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="freetext-filter"
                  placeholder="nyckelord/företagsnamn/osv."
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
              disabled={this.props.loading && (this.props.occupations.size || this.props.locations.size)}
            >
              <span className={styles.searchIcon + " glyphicon glyphicon-search"} />
              Visa <span>{!!this.buttonAmount() ? this.buttonAmount() : ''}</span> jobb
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
  occupations: React.PropTypes.object,
  locations: React.PropTypes.object,
  jobLocation: React.PropTypes.string,
  onRemoveOccupation: React.PropTypes.func,
  onRemoveLocation: React.PropTypes.func,
  setUiState: React.PropTypes.func,
  onShouldLoadNewJobs: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onRemoveOccupation: (index) => dispatch(removeOccupation(index)),
    onRemoveLocation: (index) => dispatch(removeLocation(index)),
    onGetTotalAmount: () => dispatch(getTotalAmount()),
    setUiState: (state) => dispatch(setUiState(state)),
    onShouldLoadNewJobs: () => dispatch(shouldLoadNewJobs()),
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
  totalAmount: selectTotalAmount(),
  additionalAds: selectAdditionalAds(),
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(FilterPage);