/**
 * YrkeslistaListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import ListItem from 'components/ListItem';

import styles from './styles.css';

export class YrkeslistaListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function

  onItemClick() {
    this.props.click(this.props.item);
  }

  isPickable(item) {
    return item.typ === 'YRKE' || item.parent;
  }

  shouldBeIndented(item) {
    return item.typ === 'YRKE' || (item.typ === 'YRKESGRUPP' && !item.parent);
  }

  render() {
    const item = this.props.item;
    // console.log(item);

    const content = (
      <div className={styles.linkWrapper} onClick={this.onItemClick.bind(this)}>
        <span className={this.shouldBeIndented(item) ? styles.indented : ''}>{item.namn}</span>
        {!this.isPickable(item) &&
          <span className={styles.chevronRight + ' glyphicon glyphicon-chevron-right'}></span>
        }
        {item.picked &&
          <span className={styles.competenceOK + ' glyphicon glyphicon-ok'} />
        }
      </div>
    );

    // Render the content into a list item
    return (
      <ListItem key={`list-item-${item.id}`} item={content} />
    );
  }
}

YrkeslistaListItem.propTypes = {
  item: React.PropTypes.object,
  click: React.PropTypes.func,
};

export default YrkeslistaListItem;