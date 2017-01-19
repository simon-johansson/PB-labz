
import React from 'react';
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
    this.openRoute('/');
  };

  componentDidMount() {
    window.$('#doorbell-button').show();
  }

  componentWillUnmount() {
    window.$('#doorbell-button').hide();
  }

  render() {
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
          <span className={styles.starIcon + ' glyphicon glyphicon-star-empty'} />
          <span className={styles.text}>Sparade jobb</span>
        </div>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}></span>
        </div>
      </footer>
    );
  }
}

export default IosMenu;