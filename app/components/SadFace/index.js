import React from 'react';

import gubbe from './gubbe.png';
import searchIcon from './group6@3x.png';
import styles from './styles.css';

export class SadFace extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className={styles.imageWrapper}>
        <img className={styles.searchIcon} src={searchIcon} />
        <p>Inga jobb hittades för <br/><b><i>"{this.props.summary.split('för ')[1]}"</i></b></p>
      </div>
    );
  }
}

export default SadFace;