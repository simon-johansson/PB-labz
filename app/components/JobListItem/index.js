/**
 * JobListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import moment from 'moment';
moment.locale('sv');

import { FormattedNumber } from 'react-intl';
import { selectCurrentUser } from 'containers/App/selectors';
import ListItem from 'components/ListItem';
import IssueIcon from 'components/IssueIcon';
import A from 'components/A';

import styles from './styles.css';

export class JobListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const momentOptions = {
      sameElse: 'DD MMM',
    };
    const item = this.props.item;
    // console.log(item);

    const content = (
      <div className={styles.linkWrapper}>
        <div>
          <span>{item.arbetsgivarenamn}, {item.erbjudenArbetsplats.kommun && item.erbjudenArbetsplats.kommun.namn}</span>
          <br />
          <A
            className={styles.linkJob}
            href={`https://www.arbetsformedlingen.se/Tjanster/Arbetssokande/Platsbanken#/annonser/${item.id}`}
            target="_blank"
          >
            {item.rubrik}
          </A>
          <br />
          <span className={styles.smallText}>Yrkesroll: {item.yrkesroll.namn}</span>
          <br />
          <span className={styles.smallText}>Publicerad: {moment(item.publiceringsdatum).calendar(null, momentOptions)}</span>
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
  item: React.PropTypes.object
};

export default JobListItem;