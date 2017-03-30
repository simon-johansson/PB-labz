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

  showMore(item) {
    return item.typ === 'more';
  }

  showGPS(item) {
    return item.typ === 'GPS';
  }

  showFreetext(item) {
    return item.typ === 'FRITEXT';
  }

  rightPart(item, antal) {
    if (this.showMore(item)) {
      return '';
    } else if (this.showGPS(item)) {
      return (
        <span className={styles.gps}>
          GPS
          <span className={styles.gpsIcon + ' glyphicon glyphicon-map-marker'} />
        </span>
      );
    } else if (this.showFreetext(item)) {
      return (
        <span className={styles.rightFreetext}>
          Fritext
        </span>
      );
    } else {
      return <span className={styles.right}>
        {item.typ ? this.getTypeText(item.typ) : antal + ' jobb'}
        {this.props.isTips &&
          <span className={styles.goToTips + " iosIcon"}></span>
        }
      </span>;
    }
  }

  getTypeText(type) {
    if (type === 'LAN') return 'Län';
    return type.toLowerCase();
  }

  render() {
    const item = this.props.item;
    const { matchningskriterium, antal } = item;

    const content = (
      <div className={styles.linkWrapper} onClick={this.onItemClick.bind(this)}>
        {this.showMore(item) ?
          <span className={styles.showMore}>{item.namn}</span> :
          <span className={styles.itemName}>{item.namn || matchningskriterium.namn}</span>
        }
        {this.rightPart(item, antal)}
      </div>
    );

    // Render the content into a list item
    return (
      <ListItem key={`list-item-${item.id}`} item={content} isTips={this.props.isTips} />
    );
  }
}

OccupationListItem.propTypes = {
  item: React.PropTypes.object
};

export default OccupationListItem;