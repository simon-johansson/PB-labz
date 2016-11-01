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
} from 'containers/App/selectors';

import {
  selectUsername,
  selectOccupations,
  selectLocation,
} from './selectors';

import {
  changeUsername,
  changeOccupation,
  changeLocation,
} from './actions';
import {
  loadRepos,
  loadJobs,
} from '../App/actions';

import { FormattedMessage } from 'react-intl';
import RepoListItem from 'containers/RepoListItem';
import JobListItem from 'components/JobListItem';
import Button from 'components/Button';
import H2 from 'components/H2';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';

export class HomePage extends React.Component {
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

  createTags() {
    return this.props.occupations.map(item => {
      return (
        <div className={styles.tag}>
          <span className={styles.tagText}>
            {item.namn}
            <span className="glyphicon glyphicon-remove-sign" />
          </span>
        </div>
      );
    });
  }

  render() {
    let mainContent = null;

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
      mainContent = (<List items={this.props.jobs} component={JobListItem} />);
    }

    return (
      <article>
        <div>
          <section className={styles.textSection}>
            <div className={styles.searchForm}>
              <h1>Mina sökningar</h1>
              <form onSubmit={this.props.onSubmitForm}>
                <div className="form-group">
                  {/*<label htmlFor="occupation">Yrke</label>*/}
                  <div className={styles.tagsWrapper} onClick={this.addOccupationPage}>
                    {this.createTags()}
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
                  <input
                    type="test"
                    className="form-control"
                    id="location"
                    placeholder="Lägg till ort..."
                    value={this.props.jobLocation}
                    onChange={this.props.onChangeLocation}
                  />
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
            {mainContent}
          </section>
          {/*<Button handleRoute={this.openFeaturesPage}>
            <FormattedMessage {...messages.featuresButton} />
          </Button>*/}
        </div>
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
  jobLocation: React.PropTypes.string,
  onChangeUsername: React.PropTypes.func,
  onChangeOccupation: React.PropTypes.func,
  onChangeLocation: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onChangeOccupation: (evt) => dispatch(changeOccupation(evt.target.value)),
    onChangeLocation: (evt) => dispatch(changeLocation(evt.target.value)),
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
  username: selectUsername(),
  occupations: selectOccupations(),
  jobLocation: selectLocation(),
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
