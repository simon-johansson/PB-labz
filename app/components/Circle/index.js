/**
 *
 * Button.react.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React, { PropTypes } from 'react';
import _ from 'lodash';

import styles from './styles.css';

function Circle(props) {
  let content;
  let colorClass = '';
  let known = props.known;
  let total = props.total;

  if (props.item) {
    known = props.item.matchingCriteria.length;
    total = props.item.notMatchingCriteria.length + props.item.matchingCriteria.length;
  }

  const match = (known / total);
  if (match === 1) colorClass = styles.greenCircle;
  else if (match >= 0.5) colorClass = styles.orangeCircle;
  else colorClass = styles.yellowCircle;

  if (props.small) {
    content = (
      <div className={`${styles.circleWrapperSmall} ${!props.isMatch ? styles.hidden : ''}`}>
        <span className={colorClass}>
          <p>m</p>
        </span>
      </div>
    );
  } else {
    content = (
      <div className={`${props.big ? styles.circleWrapperBig : styles.circleWrapper} ${!props.isMatch ? styles.hidden : ''}`}>
        <span
          style={props.style}
          className={`${styles.circle} ${colorClass}`}
        >
          <sup>{known ? known : 1}</sup>
          <span className={styles.division}></span>
          <sub>{total}</sub>
        </span>
        {/*props.showText &&
          <div className={styles.circleTextWrapper}>
            <span>Matchning</span>
          </div>
        */}
      </div>
    )
  }
  return content;
}

Circle.defaultProps = {
  showText: true,
  small: false,
  isMatch: true,
  big: false,
};

Circle.propTypes = {
  item: PropTypes.object,
  known: PropTypes.number,
  total: PropTypes.number,
  showText: PropTypes.bool,
};

export default Circle;
