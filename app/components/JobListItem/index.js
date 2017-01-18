/**
 * JobListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import Tappable from 'react-tappable';
import _ from 'lodash';

import ListItem from 'components/ListItem';
import Circle from 'components/Circle';

import styles from './styles.css';

// const knownCompetencesShort = (item) => {
//   const competences = _.filter(item.matchningsresultat.efterfragat, {typ: "KOMPETENS"});
//   const match = (item.matchingCompetences.length / competences.length);
//   let colorClass = '';
//   if (match === 1) colorClass = 'greenCircle';
//   else if (match >= 0.5) colorClass = 'orangeCircle';
//   else colorClass = 'yellowCircle';

//   return (
//     <div className={styles.circleWrapper}>
//       <span className={`${styles.circle} ${colorClass}`}>
//         <sup>{item.matchingCompetences.length}</sup><span className={styles.division}>&frasl;</span><sub>{competences.length}</sub>
//       </span>
//       <div className={styles.circleTextWrapper}>
//         <span>matchande</span> <br />
//         <span>kompetenser</span>
//       </div>
//     </div>
//   );
// }

// const knownCompetences = (item) => {
//   const content = [];
//   if (item.matchingCompetences) {
//     content.push(
//       <span className={styles.competence}>
//         <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
//         {item.matchingCompetences[0].efterfragat}
//       </span>
//     );
//     return content;
//   };
// }

// const notkKnownCompetences = (item) => {
//   let rest = 0;
//   if ((item.matchingCompetences.length - 1) > 0) {
//     rest = (item.matchingCompetences.length - 1);
//   }
//   if (item.notMatchingCompetences.length || rest) {
//     return (
//       <span className={styles.competence}>
//         {/*<span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />*/}
//         + {item.notMatchingCompetences.length + rest}
//       </span>
//     );
//   };
// }

const clickHandler = (item, click) => {
  click(`/advert/${item.id}`);
};

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
  // console.log(item);
  // console.log(window.moment().diff(item.sistaAnsokningsdatum, 'days'));
  const date = moment(item.publiceringsdatum).calendar(null, momentOptions);
  const isMatchingView = props.options.view == 'matching';
  const isMaching = !!item.matchingCriteria.length;
  // console.log(isMaching);
  const wrapperClass = (/*isMatchingView &&*/ isMaching) ? styles.bigLinkWrapper : styles.linkWrapper;
  const content = (
    <Tappable className={wrapperClass} onTap={clickHandler.bind(this, item, props.click)}>
        <div>
          <span className={styles.employer}>{item.arbetsgivarenamn}, {item.erbjudenArbetsplats.kommun && item.erbjudenArbetsplats.kommun.namn}</span>
          <br />
          <b className={styles.title}>{item.rubrik}</b>
          <br />
          <span className={styles.smallText}>Yrkesroll: {item.yrkesroll.namn}</span>
          <br />
          <span className={styles.smallText}>Publicerad:
            {/*<span className={date === 'Idag' ? styles.today : ''}>{date}</span>*/}
            <span> {date}</span>
          </span>
          {/*
            <br />
            <span className={styles.canApplyToAd}>
              <span className='glyphicon glyphicon-warning-sign' />
              Ansökningstiden har gått ut
            </span>
          */}
          {isMaching &&
            <div>
              <div className={styles.knownCompetences}>
                <Circle
                  item={item}
                  style={{top: '35px'}}
                />
              </div>
            </div>
          }
          {/*isMaching && !isMatchingView &&
            <div>
              <div className={styles.knownCompetences}>
                <Circle
                  item={item}
                  small={true}
                />
              </div>
            </div>
          */}
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

JobListItem.defaultProps = {
  options: {
    view: 'all',
  },
};


export default JobListItem;
