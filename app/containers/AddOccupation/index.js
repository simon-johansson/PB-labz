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
  selectOccupations,
} from './selectors';

import {
  selectRelated,
} from 'containers/App/selectors';

import {
  changeQuery,
  addOccupation,
  occupationsLoaded
} from './actions';

import RepoListItem from 'containers/RepoListItem';
import OccupationListItem from 'components/OccupationListItem';
import Button from 'components/Button';
import H2 from 'components/H2';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';

export class AddOccupation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      related: 4,
    };
  }

  componentDidMount() {
    this.props.onChangeQuery({target: { value: '' }});
    ReactDOM.findDOMNode(this.refs.occupationInput).focus();
  }

  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  openHomePage = () => {
    this.openRoute('/');
  };

  onListItemClick(item) {
    this.props.onAddOccupation(item);
    this.openRoute('/');
  }

  onSubmitForm(e) {
    if (e !== undefined && e.preventDefault) e.preventDefault();

    this.props.onAddOccupation({
      typ: 'FRITEXT',
      varde: `"${this.props.query}"`,
      namn: `"${this.props.query}"`,
    });
    this.openRoute('/');
  }

  createRelatedTags() {
    if (this.props.related.length > 0) {
      // console.log(this.props.related);
      return this.props.related.map((item, index) => {
        // console.log(item);
        if (index < this.state.related) {
          return (
            <div className={styles.tag} onClick={this.onListItemClick.bind(this, item.matchningskriterium)}>
              <span className={styles.tagText}>
                {item.matchningskriterium.namn} ({item.antal})
              </span>
            </div>
          );
        }
      });
    }
  }

  render() {
    // console.log(this.props.related);

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
    else if (this.props.occupations !== false) {
      mainContent = (
        <List
          items={this.props.occupations}
          component={OccupationListItem}
          click={this.onListItemClick.bind(this)}
        />
      );
    }

    // console.log(this.props.occupations);
    // console.log(this.props.related);

    return (
      <article>
        <div>
          <section className={styles.textSection}>
            <div className={styles.searchForm}>
              <h1>Lägg till yrke/fritext</h1>
              <span className={styles.cancel} onClick={this.openHomePage}>
                Avbryt
              </span>
              <form onSubmit={this.onSubmitForm.bind(this)} autoComplete="off">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="occupation"
                    placeholder="Lägg till yrke/fritext..."
                    value={this.props.query}
                    autoComplete="off"
                    onChange={this.props.onChangeQuery}
                    ref="occupationInput"
                  />
                </div>
                <button type="submit" style={{display: 'none'}} className="btn btn-default">Submit</button>

                {!!this.props.related.length &&
                  <div className={styles.tagWrapper}>
                      <span className={styles.smallText}>Relaterade yrken:</span>
                    {this.createRelatedTags()}
                    <div className={styles.tag}>
                      <span className={styles.tagText}>
                        {this.props.related.length - this.state.related}
                        <span className="glyphicon glyphicon-plus" />
                      </span>
                    </div>
                  </div>
                }
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

AddOccupation.propTypes = {
  changeRoute: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  occupations: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  related: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  // onSubmitForm: React.PropTypes.func,
  onChangeQuery: React.PropTypes.func,
  onAddOccupation: React.PropTypes.func,
  query: React.PropTypes.string,
};

export function mapDispatchToProps(dispatch, props) {
  return {
    onChangeQuery: (evt) => dispatch(changeQuery(evt.target.value)),
    onAddOccupation: (occupation) => dispatch(addOccupation(occupation)),
    changeRoute: (url) => dispatch(push(url)),
    // onSubmitForm: (evt) => {
    //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //   console.log(props);
    //   dispatch(addOccupation());
    // },
    // dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  query: selectQuery(),
  occupations: selectOccupations(),
  related: selectRelated(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(AddOccupation);
