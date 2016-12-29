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
  selectSavedAdverts,
} from 'containers/App/selectors';

import {
  saveAdvert,
  removeAdvert,
} from 'containers/App/actions';

import JobListItem from 'components/JobListItem';
import IosMenu from 'components/IosMenu';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';

export class SavedPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onAdvertClick = this.onAdvertClick.bind(this);
  }

  componentDidMount() {
  }

  onAdvertClick(link) {
    this.openRoute(link + '/saved');
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

  render() {
    return (
      <article className="noselect">
        <div className={styles.contentWrapper}>
          <div className={styles.searchForm}>
            <h1>
              <span>Sparade annonser</span>
            </h1>
          </div>
          {
            !!this.props.savedAdverts.size ?
            <List items={this.props.savedAdverts} component={JobListItem} click={this.onAdvertClick} />:
            <div className={styles.matchDescription}>
              <p>Du har inga sparade annonser</p>
            </div>
          }
        </div>

        <IosMenu
          changeRoute={this.props.changeRoute}
        />
      </article>
    );
  }
}

SavedPage.propTypes = {
  changeRoute: React.PropTypes.func,
  onSaveAdvert: React.PropTypes.func,
  onRemoveAdvert: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
    onSaveAdvert: (ad) => dispatch(saveAdvert(ad)),
    onRemoveAdvert: (id) => dispatch(removeAdvert(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  savedAdverts: selectSavedAdverts(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(SavedPage);