
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { browserHistory } from 'react-router';

import {
  selectAppState,
} from 'containers/App/selectors';

import {
  setAppState,
} from 'containers/App/actions';

import styles from './styles.css';
// import menu from './menu.png';

const isActive = (page) => {
  const { pathname } = window.location;
  return pathname.indexOf(page) !== -1;
};

export class IosMenu extends React.Component {

  openRoute = (route) => {
    setTimeout(() => {
      this.props.changeRoute(route);
    }, 100);
  };

  addSavedPage = () => {
    this.openRoute('/saved');
  };

  addHomePage = () => {
    const { pathname } = window.location;
    if (pathname.indexOf('saved') !== -1) {
      this.openRoute(this.props.appState.get('searches'));
    } else {
      this.openRoute('/');
    }
  };

  componentDidMount() {
    window.$('#doorbell-button').show();
  }

  componentWillUnmount() {
    window.$('#doorbell-button').hide();
  }

  render() {
    // console.log(this.props.appState);
    const savedPage = isActive('saved');

    return (
      <footer className={styles.footer}>
        {/*<img className={styles.iosMenu} src={menu} />*/}
        <div
          className={savedPage ? styles.iconWrapper : styles.iconWrapperActive}
          onClick={this.addHomePage}
        >
          <span className={styles.icon + ' glyphicon glyphicon-home'} />
          <span className={styles.text}>Mina sökningar</span>
        </div>
        <div
          className={savedPage ? styles.iconWrapperActive : styles.iconWrapper}
          onClick={this.addSavedPage}
        >
          <span className={styles.starIcon + ' iosIcon'}></span>
          <span className={styles.text}>Sparade jobb</span>
        </div>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}></span>
        </div>
      </footer>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    setAppState: (state) => dispatch(setAppState(state)),
  };
}

const mapStateToProps = createStructuredSelector({
  appState: selectAppState(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(IosMenu);