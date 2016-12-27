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
  let competences;
  let colorClass = '';
  let known = props.known;
  let total = props.total;

  if (props.item) {
    competences = _.filter(props.item.matchningsresultat.efterfragat, (j) => j.typ === 'KOMPETENS' || j.typ === 'YRKE');
    known = props.item.matchingCriteria.length;
    total = competences.length;
  }

  const match = (known / total);
  if (match === 1) colorClass = styles.greenCircle;
  else if (match >= 0.5) colorClass = styles.orangeCircle;
  else colorClass = styles.yellowCircle;

  if (props.small) {
    content = (
      <div className={styles.circleWrapperSmall}>
        <span className={colorClass}>
          <p>m</p>
        </span>
      </div>
    );
  } else {
    content = (
      <div className={styles.circleWrapper}>
        <span
          style={props.style}
          className={`${styles.circle} ${colorClass}`}
        >
          <sup>{known}</sup>
          <span className={styles.division}>&frasl;</span>
          <sub>{total}</sub>
        </span>
        {props.showText &&
          <div className={styles.circleTextWrapper}>
            <span>Matchning</span>
          </div>
        }
      </div>
    )
  }
  return content;
}

Circle.defaultProps = {
  showText: true,
  small: false,
};

Circle.propTypes = {
  item: PropTypes.object,
  known: PropTypes.number,
  total: PropTypes.number,
  showText: PropTypes.bool,
};

export default Circle;
