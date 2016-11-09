import React from 'react';

import styles from './styles.css';

function LoadingIndicator(props) {
  const { options } = props;
  let classNames = styles.loadingWrapper;
  if (options) {
    if (options.size) {
      classNames =  options.size.small ? styles.loadingWrapperSmall : styles.loadingWrapper;
    }
  }
  return (
    <div className={classNames}>
      <div className={styles['sk-fading-circle']}>
        <div className={styles.skCircle}></div>
        <div className={styles['sk-circle2']}></div>
        <div className={styles['sk-circle3']}></div>
        <div className={styles['sk-circle4']}></div>
        <div className={styles['sk-circle5']}></div>
        <div className={styles['sk-circle6']}></div>
        <div className={styles['sk-circle7']}></div>
        <div className={styles['sk-circle8']}></div>
        <div className={styles['sk-circle9']}></div>
        <div className={styles['sk-circle10']}></div>
        <div className={styles['sk-circle11']}></div>
        <div className={styles['sk-circle12']}></div>
      </div>
    </div>
  );
}

export default LoadingIndicator;
