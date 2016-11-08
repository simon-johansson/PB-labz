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

import { FormattedNumber } from 'react-intl';
import { selectCurrentUser } from 'containers/App/selectors';
import ListItem from 'components/ListItem';
import IssueIcon from 'components/IssueIcon';
import A from 'components/A';

import styles from './styles.css';

const knownCompetences = (item) => {
  if (item.matchingCompetences) {
    return item.matchingCompetences.map((competence, index) => {
      return (
        <span className={styles.competence} key={`competence-item-${index}`} >
          <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
          {competence.efterfragat}
        </span>
      );
    });

    // return (
    //   <span className={styles.competence}>
    //     <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
    //     {item.matchingCompetences.length}
    //   </span>
    // );
  };
}

const notkKnownCompetences = (item) => {
  if (item.notMatchingCompetences.length) {
    return (
      <span className={styles.competence}>
        <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
        {item.notMatchingCompetences.length}
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

  const content = (
    <Tappable className={item.matchingCompetences ? styles.bigLinkWrapper : styles.linkWrapper} onTap={clickHandler.bind(this, item, props.click)}>
        <div>
          <span>{item.arbetsgivarenamn}, {item.erbjudenArbetsplats.kommun && item.erbjudenArbetsplats.kommun.namn}</span>
          <br />
          <b className={styles.title}>{item.rubrik}</b>
          <br />
          {!item.matchingCompetences &&
            <div>
              <span className={styles.smallText}>Yrkesroll: {item.yrkesroll.namn}</span>
              <br />
              <span className={styles.smallText}>Publicerad: {moment(item.publiceringsdatum).calendar(null, momentOptions)}</span>
            </div>
          }
          {item.matchingCompetences &&
            <div>
              <span className={styles.smallText}>Vi efterfrågar:</span> <br />
              <div className={styles.knownCompetences}>
                {knownCompetences(item)}
                {notkKnownCompetences(item)}
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


// export class JobListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function

//   openRoute = (route) => {
//     this.props.changeRoute(route);
//   };

//   addLocationPage = (item) => {
//     if (item.matchingCompetences) {
//       this.openRoute(`/advert/${item.id}/matching`);
//     } else {
//       this.openRoute(`/advert/${item.id}`);
//     }
//     // this.props.click();
//   };

//   knownCompetences(item) {
//     if (item.matchingCompetences) {
//       return item.matchingCompetences.map(competence => {
//         return (
//           <span className={styles.competence}>
//             <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
//             {competence.efterfragat}
//           </span>
//         );
//       });

//       // return (
//       //   <span className={styles.competence}>
//       //     <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
//       //     {item.matchingCompetences.length}
//       //   </span>
//       // );
//     };
//   }

//   notkKnownCompetences(item) {
//     if (item.notMatchingCompetences.length) {
//       return (
//         <span className={styles.competence}>
//           <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
//           {item.notMatchingCompetences.length}
//         </span>
//       );
//     };
//   }

//   render() {
//     const momentOptions = {
//       sameElse: 'DD MMM',
//     };
//     const item = this.props.item;
//     // console.log(item);

//     const content = (
//       <div className={item.matchingCompetences ? styles.bigLinkWrapper : styles.linkWrapper} onClick={this.addLocationPage.bind(this, item)}>
//         <div>
//           <span>{item.arbetsgivarenamn}, {item.erbjudenArbetsplats.kommun && item.erbjudenArbetsplats.kommun.namn}</span>
//           <br />
//           <b className={styles.title}>{item.rubrik}</b>
//           <br />
//           {!item.matchingCompetences &&
//             <div>
//               <span className={styles.smallText}>Yrkesroll: {item.yrkesroll.namn}</span>
//               <br />
//               <span className={styles.smallText}>Publicerad: {moment(item.publiceringsdatum).calendar(null, momentOptions)}</span>
//             </div>
//           }
//           {item.matchingCompetences &&
//             <div>
//               <span className={styles.smallText}>Vi efterfrågar:</span> <br />
//               <div className={styles.knownCompetences}>
//                 {this.knownCompetences(item)}
//                 {this.notkKnownCompetences(item)}
//               </div>
//             </div>
//           }
//         </div>
//       </div>
//     );

//     // Render the content into a list item
//     return (
//       <ListItem key={`repo-list-item-${item.full_name}`} item={content} />
//     );
//   }
// }

// JobListItem.propTypes = {
//   item: React.PropTypes.object,
//   changeRoute: React.PropTypes.func,
// };

// export function mapDispatchToProps(dispatch) {
//   return {
//     changeRoute: (url) => dispatch(push(url)),
//   }
// }

// const mapStateToProps = createStructuredSelector({});

// // Wrap the component to inject dispatch and state into it
// export default connect(mapStateToProps, mapDispatchToProps)(JobListItem);