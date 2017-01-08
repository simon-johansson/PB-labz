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
    let isKnown = this.props.knownCompetences.includes(this.props.item.varde);
    this.setState({isKnown});
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log(nextState.isKnown, this.state.isKnown);
    // return nextState.isKnown !== this.state.isKnown;
    // console.log(nextProps.knownCompetences.includes(nextProps.item.varde), nextProps.item);
    return nextState.isKnown !== this.state.isKnown ||
           nextProps.knownCompetences.includes(nextProps.item.varde);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isKnown: nextProps.knownCompetences.includes(nextProps.item.varde)
    });
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
    // console.log('render');
    const item = this.props.item;
    const content = (
      <div
        className={!this.state.isKnown ? styles.linkWrapper : styles.linkWrapperKnown}
        onClick={this.onCompetenceClick.bind(this)}
      >
        {item.isTop5 &&
          <span className={styles.efterfragat}>{item.efterfragat}</span>
        }
        {!item.isTop5 &&
          <span className={styles.efterfragat}>{item.efterfragat}</span>
        }
        {this.state.isKnown &&
          <span className={styles.competenceOK + ' glyphicon glyphicon-ok'} />
        }
      </div>
    );

    return (
      <ListItem item={content} />
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