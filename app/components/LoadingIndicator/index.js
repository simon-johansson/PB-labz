import React from 'react';

import styles from './styles.css';

function LoadingIndicator(props) {
  const { options } = props;
  let classNames = [styles.loadingWrapper, styles.loadingColorLight];
  if (options) {
    if (options.size) {
      classNames.push(options.size.small ? styles.loadingWrapperSmall : styles.loadingWrapper);
    }
    if (options.color) {
      classNames.push(options.color === 'dark' ? styles.loadingColorDark : styles.loadingColorLight);
    }
  }
  return (
    <div className={classNames.join(' ')}>
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
