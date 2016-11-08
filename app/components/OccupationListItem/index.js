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
    if (this.props.item.typ === 'GPS') {
      return this.props.click({
        id: '01', namn: 'Stockholms län', typ: 'LAN'
      });
    }
    this.props.click(this.props.item);
  }

  render() {
    const item = this.props.item;
    // console.log(item);

    const content = (
      <div className={styles.linkWrapper} onClick={this.onItemClick.bind(this)}>
        <span>{item.namn}</span>
        { item.typ === 'GPS' ?
          <span className={styles.right + ' glyphicon glyphicon-map-marker'}></span> :
          <span className={styles.right}>{item.typ.toLowerCase()}</span>
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