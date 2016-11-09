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
  setOccupations,
  setLocations,
  removeOccupation,
  removeLocation,
  setUiState,
} from 'containers/ListPage/actions';

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

export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onSeachButtonClick = this.onSeachButtonClick.bind(this);
  }

  componentDidMount() {
    // if (this.props.shouldLoadNewJobs) {
    //   this.props.onSubmitForm();
    // }
  }

  openRoute = (route) => {
    this.props.changeRoute(route);
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
    this.props.onSetLocations();
    this.props.onSetOccupations();
    // this.props.occupations.forEach((item, index) => {
    //   this.props.onRemoveOccupation(index);
    // });
    // this.props.locations.forEach((item, index) => {
    //   this.props.onRemoveLocation(index);
    // });

    this.addFilterPage();
  }

  previousSearches() {
    const momentOptions = {
      sameDay: '[Idag] LT',
      lastDay: '[Igår] LT',
      lastWeek: 'DD MMM',
      sameElse: 'DD MMM',
    };
    const searches = ls.getPreviousSearchs().slice(0, 5);

    return searches.map(item => {
      const occupations = item.occupations.map(i => i.namn).join(', ');
      const locations = item.locations.map(i => i.namn).join(' & ');

      return (
        <div className={styles.previousSearchesWrapper} onClick={this.onClickPreviousSearch.bind(this, item)}>
          <div className={styles.previousSearcheParameters}>
            <span>{occupations}</span> <br />
            <span className={styles.small}>{locations}</span>
          </div>
          <span className={styles.previousSearcheTime}>{moment(item.time).calendar(null, momentOptions)}</span>
          <span className={styles.chevronIcon + ' glyphicon glyphicon-chevron-right'} />
        </div>
      )
    });
  }

  onClickPreviousSearch(search) {
    this.props.onSetOccupations(search.occupations);
    this.props.onSetLocations(search.locations);
    this.addListPage();
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
            <h1>Mina sökningar</h1>
          </div>

          <button
            className={styles.searchButton + ' btn btn-default'}
            onClick={this.onSeachButtonClick}
          >
            <span className={styles.searchIcon + " glyphicon glyphicon-search"} />
            Ny sökning
          </button>

          <div className={styles.latestSearches}>
            {/*<span className={styles.listHeader}>Sparade sökningar</span>
            <List items={[]} component={ListItem} />*/}

            <span className={styles.listHeader}>Tidigare sökningar</span>
            <List items={this.previousSearches()} component={ListItem} />
          </div>
        </div>
        <IosMenu />
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
  occupations: React.PropTypes.array,
  locations: React.PropTypes.array,
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
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);