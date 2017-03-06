import React from 'react';
import uuid from 'uuid';
import styles from './styles.css';

function List(props) {
  const ComponentToRender = props.component;
  let content = (<div></div>);

  // If we have items, render them
  if (props.items) {
    content = props.items.map((item, index) => (
      <ComponentToRender
        key={`list-item-${index}`}
        item={item}
        click={props.click}
        options={props.options}
        isSaved={props.isSaved}
      />
    ));
  } else {
    // Otherwise render a single component
    content = (<ComponentToRender />);
  }

  return (
    <div className={styles.listWrapper}>
      <ul className={styles.list}>
        {content}
      </ul>
    </div>
  );
}

List.propTypes = {
  component: React.PropTypes.func.isRequired,
  items: React.PropTypes.array,
};

export default List;
