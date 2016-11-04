/**
 * JobListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
moment.locale('sv');

import { FormattedNumber } from 'react-intl';
import { selectCurrentUser } from 'containers/App/selectors';
import ListItem from 'components/ListItem';
import IssueIcon from 'components/IssueIcon';
import A from 'components/A';

import styles from './styles.css';

export class JobListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function

  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  addLocationPage = (item) => {
    // console.log(id);
    if (item.matchingCompetences) {
      this.openRoute(`/advert/${item.id}/matching`);
    } else {
      this.openRoute(`/advert/${item.id}`);
    }
  };

  knownCompetences(item) {
    if (item.matchingCompetences) {
      return item.matchingCompetences.map(competence => {
        // console.log(competence);
        return (
          <span className={styles.competence}>
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

  notkKnownCompetences(item) {
    if (item.notMatchingCompetences) {
      return (
        <span className={styles.competence}>
          <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
          {item.notMatchingCompetences.length - 1}
        </span>
      );
    };
  }

  render() {
    const momentOptions = {
      sameElse: 'DD MMM',
    };
    const item = this.props.item;
    // console.log(item);

    const content = (
      <div className={item.matchingCompetences ? styles.bigLinkWrapper : styles.linkWrapper} onClick={this.addLocationPage.bind(this, item)}>
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
                {this.knownCompetences(item)}
                {this.notkKnownCompetences(item)}
              </div>
            </div>
          }
        </div>
      </div>
    );

    // Render the content into a list item
    return (
      <ListItem key={`repo-list-item-${item.full_name}`} item={content} />
    );
  }
}

JobListItem.propTypes = {
  item: React.PropTypes.object,
  changeRoute: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
  }
}

const mapStateToProps = createStructuredSelector({});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(JobListItem);