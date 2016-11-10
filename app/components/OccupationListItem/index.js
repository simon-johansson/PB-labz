/**
 * OccupationListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { FormattedNumber } from 'react-intl';
import { selectCurrentUser } from 'containers/App/selectors';
import ListItem from 'components/ListItem';
import IssueIcon from 'components/IssueIcon';
import A from 'components/A';

import styles from './styles.css';

export class OccupationListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function

  onItemClick() {
    const { matchningskriterium } = this.props.item;
    if (this.props.item.typ === 'GPS') {
      return this.props.click({
        id: '01', namn: 'Stockholms län', typ: 'LAN'
      });
    }
    this.props.click(matchningskriterium ? matchningskriterium : this.props.item);
  }

  render() {
    const item = this.props.item;
    const { matchningskriterium, antal } = item;

    const content = (
      <div className={styles.linkWrapper} onClick={this.onItemClick.bind(this)}>
        <span>{item.namn || matchningskriterium.namn}</span>
        { item.typ === 'GPS' ?
          <span className={styles.right + ' glyphicon glyphicon-map-marker'}></span> :
          <span className={styles.right}>{item.typ ? item.typ.toLowerCase() : antal + ' jobb'}</span>
        }
      </div>
    );

    // Render the content into a list item
    return (
      <ListItem key={`list-item-${item.id}`} item={content} />
    );
  }
}

OccupationListItem.propTypes = {
  item: React.PropTypes.object
};

export default OccupationListItem;