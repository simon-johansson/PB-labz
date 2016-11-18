import React from 'react';

import gubbe from './gubbe.png';
import styles from './styles.css';

export class SadFace extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className={styles.imageWrapper}>
        <img className={styles.gubbe} src={gubbe} />
        <p>Inga jobb hittades {this.props.summary}</p>
      </div>
    );
  }
}

export default SadFace;