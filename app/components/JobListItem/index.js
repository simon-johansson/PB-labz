/**
 * JobListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Tappable from 'react-tappable';
import _ from 'lodash';

import { FormattedNumber } from 'react-intl';
import { selectCurrentUser } from 'containers/App/selectors';
import ListItem from 'components/ListItem';
import IssueIcon from 'components/IssueIcon';
import A from 'components/A';
import Circle from 'components/Circle';

import styles from './styles.css';

const knownCompetencesShort = (item) => {
  const competences = _.filter(item.matchningsresultat.efterfragat, {typ: "KOMPETENS"});
  const match = (item.matchingCompetences.length / competences.length);
  let colorClass = '';
  if (match === 1) colorClass = 'greenCircle';
  else if (match >= 0.5) colorClass = 'orangeCircle';
  else colorClass = 'yellowCircle';

  return (
    <div className={styles.circleWrapper}>
      <span className={`${styles.circle} ${colorClass}`}>
        <sup>{item.matchingCompetences.length}</sup><span className={styles.division}>&frasl;</span><sub>{competences.length}</sub>
      </span>
      <div className={styles.circleTextWrapper}>
        <span>matchande</span> <br />
        <span>kompetenser</span>
      </div>
    </div>
  );
}

const knownCompetences = (item) => {
  const content = [];
  if (item.matchingCompetences) {
    content.push(
      <span className={styles.competence}>
        <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
        {item.matchingCompetences[0].efterfragat}
      </span>
    );
    // if ((item.matchingCompetences.length - 1) > 0) {
    //   content.push(
    //     <span className={styles.competence}>
    //       <span className={styles.plusIconGreen + ' glyphicon glyphicon-plus'} />
    //       {(item.matchingCompetences.length - 1)}
    //     </span>
    //   );
    // }
    return content;
  };
}

const notkKnownCompetences = (item) => {
  let rest = 0;
  if ((item.matchingCompetences.length - 1) > 0) {
    rest = (item.matchingCompetences.length - 1);
  }
  if (item.notMatchingCompetences.length || rest) {
    return (
      <span className={styles.competence}>
        {/*<span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />*/}
        + {item.notMatchingCompetences.length + rest}
      </span>
    );
  };
}

const clickHandler = (item, click) => {
  if (item.matchingCompetences) {
    click(`/advert/${item.id}/matching`);
  } else {
    click(`/advert/${item.id}`);
  }
}

function JobListItem(props) {
  const momentOptions = {
    sameDay: '[Idag]',
    nextDay: '[Imorgon]',
    lastDay: '[Igår]',
    nextWeek: '[På] dddd LT',
    lastWeek: 'DD MMM',
    sameElse: 'DD MMM',
  };
  const item = props.item;
  const date = moment(item.publiceringsdatum).calendar(null, momentOptions);

  const content = (
    <Tappable className={item.matchingCompetences ? styles.bigLinkWrapper : styles.linkWrapper} onTap={clickHandler.bind(this, item, props.click)}>
        <div>
          <span className={styles.employer}>{item.arbetsgivarenamn}, {item.erbjudenArbetsplats.kommun && item.erbjudenArbetsplats.kommun.namn}</span>
          <br />
          <b className={styles.title}>{item.rubrik}</b>
          <br />
          <span className={styles.smallText}>Yrkesroll: {item.yrkesroll.namn}</span>
          <br />
          <span className={styles.smallText}>Publicerad: <span className={date === 'Idag' ? styles.today : ''}>{date}</span></span>
          {item.matchingCompetences &&
            <div>
              {/*<span className={styles.smallText}>Vi efterfrågar:</span> <br />*/}
              <div className={styles.knownCompetences}>
                <Circle
                  item={item}
                  style={{top: '28px'}}
                />
                {/*knownCompetences(item)*/}
                {/*notkKnownCompetences(item)*/}
              </div>
            </div>
          }
        </div>
    </Tappable>
  );

  return (
    <ListItem key={`job-list-item-${item.id}`} item={content} />
  );
}

JobListItem.propTypes = {
  item: React.PropTypes.object,
};

export default JobListItem;
