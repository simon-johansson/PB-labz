/**
 * CompetenceListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import ListItem from 'components/ListItem';
import styles from './styles.css';

export class CompetenceListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picked: false,
    };
  }

  componentDidMount() {
  }

  onCompetenceClick() {
    const isPicked = !this.state.picked;
    this.setState({picked: isPicked});
  }

  render() {
    const item = this.props.item;
    const content = (
      <div className={styles.linkWrapper} onClick={this.onCompetenceClick.bind(this)}>
        <span>{item.efterfragat}</span>
        {this.state.picked &&
          <span className='glyphicon glyphicon-ok' />
        }
      </div>
    );

    return (
      <ListItem key={`repo-list-item-${item.varde}`} item={content} />
    );
  }
}

CompetenceListItem.propTypes = {
  item: React.PropTypes.object,
  changeRoute: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
  };
}

const mapStateToProps = createStructuredSelector({});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CompetenceListItem);