/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import _ from 'lodash';

import messages from './messages';
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
  selectUsername,
  selectOccupations,
  selectLocations,
  selectUiState,
  selectCurrentTab,
  selectShowMatchingJobs,
  selectShouldLoadNewJobs,
  selectScrollPosition,
} from './selectors';

import {
  changeUsername,
  removeOccupation,
  removeLocation,
  setUiState,
} from './actions';
import {
  loadRepos,
  loadJobs,
} from '../App/actions';

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
    this.state = {
      tab: 'all',
      showMatchingJobs: props.showMatchingJobs,
      scrollPosition: 0,
    };
  }
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    if (this.props.shouldLoadNewJobs) {
      this.props.onSubmitForm();
    }
    this.scrollTo(this.props.scrollPosition);
    // if (this.props.occupations && this.props.occupations.length > 0) {
    //   this.props.onSubmitForm();
    // }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.scrollPosition === nextProps.scrollPosition) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  /**
   * Changes the route
   *
   * @param  {string} route The route we want to go to
   */
  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  /**
   * Changed route to '/features'
   */
  openFeaturesPage = () => {
    this.openRoute('/features');
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
      // console.log(item);
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

  createCompetencesCloud(matchingJobs) {
    // if (this.props.competences.length) {
    //   return this.props.competences.map((item) => {
    //     return (
    //       <div>
    //         <span>{item.efterfragat}</span>
    //         <br />
    //       </div>
    //     );
    //   });
    // }
    if (this.props.loading) {
      return <List component={LoadingIndicator} />
    } else if (!this.props.jobs.length) {
      return (
        <div>
          <span className={styles.amount}>Hittade 0 matchande jobb</span>
          <List items={[]} component={JobListItem} />
        </div>
      )
    } else {
      const top5 = _.orderBy(this.props.competences, 'timesRequested', 'desc').slice(0, 5);
      return (
        <div className={styles.matchWrapper}>
          <div className={styles.matchDescription}>
            <h3>Vad kan du?</h3>
            <p>Ange dina kompetenser för att se jobben som passar dig bäst</p>
          </div>
          <span className={styles.listDescription}>De mest efterfrågade kompetenserna</span>
          <List items={top5} component={CompetenceListItem} />
          <span className={styles.listDescription}>Alla efterfrågade kompetenser</span>
          <List items={this.props.competences} component={CompetenceListItem} />
          { !!this.props.knownCompetences.size &&
            <button
              className={styles.showMatchingButton + ' btn btn-default'}
              onClick={this.showMatchingJobs.bind(this)}
            >
              Visa matchande jobb
              { !!matchingJobs &&
                ` (${matchingJobs})`
              }
            </button>
          }
        </div>
      );
    }

  }

  showMatchingJobs() {
    this.setState({ showMatchingJobs: true });
    this.props.setUiState({
      showMatchingJobs: true,
      tab: this.props.currentTab,
      scrollPosition: 0,
    });
    this.scrollTo(0);
  }

  hideMatchingJobs() {
    this.setState({ showMatchingJobs: false });
    this.props.setUiState({
     showMatchingJobs: false,
     tab: this.props.currentTab,
     scrollPosition: 0,
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

  setTabState(tabState) {
    // console.log(state);
    this.setState({tab: tabState});
    this.props.setUiState({
      tab: tabState,
      showMatchingJobs: this.state.showMatchingJobs,
      scrollPosition: 0,
    });
  }

  scrollTo(position = 0) {
    if (this.props.location.pathname ===  '/') {
      window.requestAnimationFrame(() => {
        document.body.scrollTop = document.documentElement.scrollTop = position;
      });
    }
  }

  onAdvertClick() {
    this.props.setUiState({
      showMatchingJobs: this.state.showMatchingJobs,
      tab: this.props.currentTab,
      scrollPosition: document.body.scrollTop,
    });
  }

  render() {
    // console.log('render');
    let mainContent = null;
    let matchingContent = null;
    const matchingJobs = [];

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);
      matchingContent = (<List component={LoadingIndicator} />);

    // Show an error if there is one
    } else if (this.props.error !== false) {
      const ErrorComponent = () => (
        <ListItem item={'Something went wrong, please try again!'} />
      );
      mainContent = (<List component={ErrorComponent} />);

    // If we're not loading, don't have an error and there are repos, show the repos
    } else if (this.props.jobs !== false) {
      // console.log(this.props.jobs);
      mainContent = (
        <div>
          <span className={styles.amount}>Hittade {this.props.amount} jobb</span>
          <List items={this.props.jobs} component={JobListItem} click={this.onAdvertClick.bind(this)} />
        </div>
      );

      this.props.jobs.forEach(job => {
        const jobCopy = JSON.parse(JSON.stringify(job));
        const matchingCompetences = [];
        const notMatchingCompetences = [];
        let match = false;
        jobCopy.matchningsresultat.efterfragat.forEach(requirement => {
          if (this.props.knownCompetences.includes(requirement.varde)) {
            matchingCompetences.push(requirement);
            match = true;
          } else {
            if (requirement.typ == "KOMPETENS") {
              notMatchingCompetences.push(requirement);
            }
          }
        });
        if (match) {
          jobCopy.matchingCompetences = matchingCompetences;
          jobCopy.notMatchingCompetences = notMatchingCompetences;
          matchingJobs.push(jobCopy);
        }
      });
      const sortedMatchingJobs = _.orderBy(matchingJobs,
        ['matchingCompetences', 'notMatchingCompetences'], ['desc', 'asc']);
      matchingContent = (
        <div>
          <div className={styles.myCompetences} onClick={this.hideMatchingJobs.bind(this)}>
            Matchningskriterier
            <span className={styles.right + ' glyphicon glyphicon-chevron-right'}></span>
          </div>
          <span className={styles.amount}>Hittade {sortedMatchingJobs.length} matchande jobb</span>
          <List items={sortedMatchingJobs} component={JobListItem} click={this.onAdvertClick.bind(this)} />
        </div>
      );
    }

    return (
      <article ref='list' className='noselect'>
        <div className={styles.contentWrapper}>
          <section className={styles.textSection}>
            <div className={styles.searchForm}>
              <h1>Mina sökningar</h1>
              <form onSubmit={this.props.onSubmitForm}>
                <div className="form-group">
                  {/*<label htmlFor="occupation">Yrke</label>*/}
                  <div className={styles.tagsWrapper} onClick={this.addOccupationPage}>
                    {this.createOccupationTags()}
                    <span className={styles.inputPlaceholder}>
                      Lägg till yrke/fritext...
                    </span>
                  </div>
                  {/*<input
                    type="text"
                    className="form-control"
                    id="occupation"
                    placeholder="Lägg till yrke/fritext..."
                    value={this.props.occupation}
                    onChange={this.props.onChangeOccupation}
                  />*/}
                </div>
                <div className="form-group">
                  {/*<label htmlFor="location">Ort</label>*/}
                  <div className={styles.tagsWrapper} onClick={this.addLocationPage}>
                    {this.createLocationTags()}
                    <span className={styles.inputPlaceholder}>
                      Lägg till ort...
                    </span>
                  </div>
                  {/*<input
                    type="test"
                    className="form-control"
                    id="location"
                    placeholder="Lägg till ort..."
                    value={this.props.jobLocation}
                    onChange={this.props.onChangeLocation}
                  />*/}
                </div>
                <button type="submit" style={{display: 'none'}} className="btn btn-default">Submit</button>
              </form>
            </div>

            {/*<form className={styles.usernameForm} onSubmit={this.props.onSubmitForm}>
              <label htmlFor="username">
                <FormattedMessage {...messages.trymeMessage} />
                <span className={styles.atPrefix}>
                  <FormattedMessage {...messages.trymeAtPrefix} />
                </span>
                <input
                  id="username"
                  className={styles.input}
                  type="text"
                  placeholder="mxstbr"
                  value={this.props.username}
                  onChange={this.props.onChangeUsername}
                />
              </label>
            </form>*/}
            <div className={styles.toggleButtons}>
              <button
                className={this.props.currentTab === 'all' ? styles.activeButton : ''}
                onClick={this.setTabState.bind(this, 'all')}
              >
                Alla jobb
                {
                  !this.props.loading && !!this.props.amount &&
                  ` (${this.props.amount})`
                }
              </button>
              <button
                className={this.props.currentTab === 'match' ? styles.activeButton : ''}
                onClick={this.setTabState.bind(this, 'match')}
              >
                Matchande
                { !!matchingJobs.length && !this.props.loading &&
                  ` (${matchingJobs.length})`
                }
              </button>
            </div>
            { this.props.currentTab === 'all' &&
                mainContent
            }
            { this.props.currentTab === 'match' &&
              (this.props.showMatchingJobs ?
                matchingContent :
                this.createCompetencesCloud(matchingJobs.length)
              )
            }
          </section>
          {/*<Button handleRoute={this.openFeaturesPage}>
            <FormattedMessage {...messages.featuresButton} />
          </Button>*/}
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
  username: React.PropTypes.string,
  occupations: React.PropTypes.array,
  locations: React.PropTypes.array,
  jobLocation: React.PropTypes.string,
  onChangeUsername: React.PropTypes.func,
  onRemoveOccupation: React.PropTypes.func,
  onRemoveLocation: React.PropTypes.func,
  setUiState: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
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
  repos: selectRepos(),
  jobs: selectJobs(),
  amount: selectAmount(),
  related: selectRelated(),
  uiState: selectUiState(),
  currentTab: selectCurrentTab(),
  showMatchingJobs: selectShowMatchingJobs(),
  scrollPosition: selectScrollPosition(),
  competences: selectCompetences(),
  knownCompetences: selectKnownCompetences(),
  username: selectUsername(),
  occupations: selectOccupations(),
  shouldLoadNewJobs: selectShouldLoadNewJobs(),
  locations: selectLocations(),
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
