/**
 * CompetenceListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import { selectKnownCompetences } from 'containers/App/selectors';
import {
  setCompetence,
  removeCompetence,
} from 'containers/App/actions';

import ListItem from 'components/ListItem';
import styles from './styles.css';

export class CompetenceListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isKnown: false,
    };
  }

  componentDidMount() {
    let isKnown = false;
    this.props.knownCompetences.forEach(id => {
      if (this.props.item.varde === id) isKnown = true;
    });
    this.setState({isKnown});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.knownCompetences.includes(this.props.item.varde) || this.state.isKnown;
  }

  onCompetenceClick() {
    const isKnown = !this.state.isKnown;
    this.setState({isKnown: isKnown});
    if (isKnown) {
      this.props.onSetCompetence(this.props.item.varde);
    } else {
      this.props.onRemoveCompetence(this.props.item.varde);
    }
  }

  render() {
    // console.log(this.props.knownCompetences);
    const item = this.props.item;
    const content = (
      <div className={styles.linkWrapper} onClick={this.onCompetenceClick.bind(this)}>
        <span>{item.efterfragat}</span>
        {this.state.isKnown &&
          <span className='glyphicon glyphicon-ok' />
        }
      </div>
    );

    return (
      <ListItem key={`competence-list-item-${item.varde}`} item={content} />
    );
  }
}

CompetenceListItem.propTypes = {
  item: React.PropTypes.object,
  changeRoute: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSetCompetence: (id) => dispatch(setCompetence(id)),
    onRemoveCompetence: (id) => dispatch(removeCompetence(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  knownCompetences: selectKnownCompetences(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CompetenceListItem);