/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';

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
} from './selectors';

import {
  changeUsername,
  removeOccupation,
  removeLocation,
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
      showMatchingJobs: false,
      allScrollPosition: 0,
      tabScrollPosition: 0,
    };
  }
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.onSubmitForm();
    // if (this.props.occupations && this.props.occupations.length > 0) {
    //   this.props.onSubmitForm();
    // }
  }
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
        <div className={styles.tag} onClick={this.removeOccupationTag.bind(this, index)}>
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
        <div className={styles.tag} onClick={this.removeLocationTag.bind(this, index)}>
          <span className={styles.tagText}>
            {item.namn}
            <span className="glyphicon glyphicon-remove" />
          </span>
        </div>
      );
    });
  }

  createCompetencesCloud() {
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

    return (
      <div className={styles.matchWrapper}>
        <div className={styles.matchDescription}>
          <h3>Vad kan du?</h3>
          <p>Ange dina kompetenser för att se jobben som passar dig bäst</p>
        </div>
        <List items={this.props.competences} component={CompetenceListItem} />
        <button
          className={styles.showMatchingButton + ' btn btn-default'}
          onClick={this.showMatchingJobs.bind(this)}
        >Visa matchande jobb</button>
      </div>
    );
  }

  showMatchingJobs() {
    this.setState({ showMatchingJobs: true });
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  removeOccupationTag(index, e) {
    e.stopPropagation();
    this.props.onRemoveOccupation(index);
  }

  removeLocationTag(index, e) {
    e.stopPropagation();
    this.props.onRemoveLocation(index);
  }

  render() {

    let mainContent = null;
    const matchingJobs = [];

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);

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
          <List items={this.props.jobs} component={JobListItem} />
        </div>
      );
      this.props.jobs.forEach(job => {
        let match = false;
        job.matchningsresultat.efterfragat.forEach(requirement => {
          if (this.props.knownCompetences.includes(requirement.varde)) {
            match = true;
          }
        });
        if (match) matchingJobs.push(job);
      });
      var matchingContent = (
        <div>
          <span className={styles.amount}>Hittade {matchingJobs.length} matchande jobb</span>
          <List items={matchingJobs} component={JobListItem} />
        </div>
      );
    }

    return (
      <article ref='list'>
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
                className={this.state.tab === 'all' ? styles.activeButton : ''}
                onClick={() => this.setState({tab: 'all'})}
              >
                Alla jobb ({this.props.amount})
              </button>
              <button
                className={this.state.tab === 'match' ? styles.activeButton : ''}
                onClick={() => this.setState({tab: 'match'})}
              >
                Matchande
                { !!matchingJobs.length &&
                  ` (${matchingJobs.length})`
                }
              </button>
            </div>
            { this.state.tab === 'all' &&
                mainContent
            }
            { this.state.tab === 'match' &&
              (this.state.showMatchingJobs ?
                matchingContent :
                this.createCompetencesCloud()
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
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onRemoveOccupation: (index) => dispatch(removeOccupation(index)),
    onRemoveLocation: (index) => dispatch(removeLocation(index)),
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
  competences: selectCompetences(),
  knownCompetences: selectKnownCompetences(),
  username: selectUsername(),
  occupations: selectOccupations(),
  locations: selectLocations(),
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
