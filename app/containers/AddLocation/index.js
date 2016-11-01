/*
 * AddOccupation
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import Helmet from 'react-helmet';

// import messages from './messages';
import { createStructuredSelector } from 'reselect';

import {
  selectQuery,
  selectLocations,
} from './selectors';

import {
  changeQuery,
  addLocation,
  locationsLoaded,
} from './actions';

import RepoListItem from 'containers/RepoListItem';
import OccupationListItem from 'components/OccupationListItem';
import Button from 'components/Button';
import H2 from 'components/H2';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';

export class AddLocation extends React.Component {

  componentDidMount() {
    this.props.onChangeQuery({target: { value: '' }});
    ReactDOM.findDOMNode(this.refs.locationInput).focus();
  }

  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  openHomePage = () => {
    this.openRoute('/');
  };

  onListItemClick(item) {
    this.props.onAddLocation(item);
    this.openRoute('/');
  }

  render() {
    // console.log(this.props.occupations);

    let mainContent = null;

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);

    // Show an error if there is one
    }
    else if (!this.props.query) {
      const EmptyComponent = () => (
        <ListItem item={''} />
      );
      mainContent = (<List component={EmptyComponent} />);
    }
    // else if (this.props.error !== false) {
    //   const ErrorComponent = () => (
    //     <ListItem item={'Something went wrong, please try again!'} />
    //   );
    //   mainContent = (<List component={ErrorComponent} />);

    // // If we're not loading, don't have an error and there are repos, show the repos
    // }
    else if (this.props.locations !== false) {
      mainContent = (
        <List
          items={this.props.locations}
          component={OccupationListItem}
          click={this.onListItemClick.bind(this)}
        />
      );
    }

    return (
      <article>
        <div>
          <section className={styles.textSection}>
            <div className={styles.searchForm}>
              <h1>Lägg till ort</h1>
              <span className={styles.cancel} onClick={this.openHomePage}>
                Avbryt
              </span>
              <form onSubmit={this.props.onSubmitForm} autoComplete="off">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    placeholder="Lägg till ort..."
                    value={this.props.query}
                    autoComplete="off"
                    onChange={this.props.onChangeQuery}
                    ref="locationInput"
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

AddLocation.propTypes = {
  changeRoute: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  locations: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  onChangeQuery: React.PropTypes.func,
  onAddLocation: React.PropTypes.func,
  query: React.PropTypes.string,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeQuery: (evt) => dispatch(changeQuery(evt.target.value)),
    onAddLocation: (location) => dispatch(addLocation(location)),
    changeRoute: (url) => dispatch(push(url)),
    // onSubmitForm: (evt) => {
    //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //   dispatch(loadJobs());
    // },

    // dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  query: selectQuery(),
  locations: selectLocations(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(AddLocation);
