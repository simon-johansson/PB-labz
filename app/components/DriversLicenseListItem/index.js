/**
 * DriversLicense
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectKnownDriversLicenses } from 'containers/App/selectors';
import {
  setDriversLicense,
  removeDriversLicense,
} from 'containers/App/actions';

import ListItem from 'components/ListItem';
import styles from './styles.css';

export class DriversLicenseListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isKnown: false,
    };
  }

  componentDidMount() {
    let isKnown = this.props.knownDriversLicenses.includes(this.props.item.varde);
    this.setState({isKnown});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.isKnown !== this.state.isKnown ||
           nextProps.knownDriversLicenses.includes(nextProps.item.varde);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isKnown: nextProps.knownDriversLicenses.includes(nextProps.item.varde)
    });
  }

  onCompetenceClick() {
    const isKnown = !this.state.isKnown;
    this.setState({isKnown: isKnown});
    if (isKnown) {
      this.props.onSetDriversLicense(this.props.item.varde);
    } else {
      this.props.onRemoveDriversLicense(this.props.item.varde);
    }
  }

  render() {
    const item = this.props.item;
    const content = (
      <div className={styles.linkWrapper} onClick={this.onCompetenceClick.bind(this)}>
        <span className={styles.efterfragat}>{item.efterfragat}</span>
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

DriversLicenseListItem.propTypes = {
  item: React.PropTypes.object,
  changeRoute: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSetDriversLicense: (id) => dispatch(setDriversLicense(id)),
    onRemoveDriversLicense: (id) => dispatch(removeDriversLicense(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  knownDriversLicenses: selectKnownDriversLicenses(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(DriversLicenseListItem);