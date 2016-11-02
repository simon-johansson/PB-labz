import React from 'react';
import styles from './styles.css';
import menu from './menu.png';

function IosMenu() {
  return (
    <footer className={styles.footer}>
      <img className={styles.iosMenu} src={menu} />
    </footer>
  );
}

export default IosMenu;
