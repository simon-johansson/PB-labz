import React from 'react';

import styles from './styles.css';

function ListItem(props) {
  return (
    <li className={props.isTips ? styles.tipsItem : styles.item}>
      <div className={styles.itemContent}>
        {props.item}
      </div>
      <hr className={styles.divider} />
    </li>
  );
}

ListItem.propTypes = {
  className: React.PropTypes.string,
  item: React.PropTypes.any,
};

export default ListItem;
