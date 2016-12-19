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
  let competences;
  let colorClass = '';
  let known = props.known;
  let total = props.total;

  if (props.item) {
    competences = _.filter(props.item.matchningsresultat.efterfragat, (j) => j.typ === 'KOMPETENS' || j.typ === 'YRKE');
    known = props.item.matchingCompetences.length;
    total = competences.length;
  }

  const match = (known / total);
  if (match === 1) colorClass = 'greenCircle';
  else if (match >= 0.5) colorClass = 'orangeCircle';
  else colorClass = 'yellowCircle';

  return (
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
  );
}

Circle.defaultProps = {
  showText: true
};

Circle.propTypes = {
  item: PropTypes.object,
  known: PropTypes.number,
  total: PropTypes.number,
  showText: PropTypes.bool,
};

export default Circle;
