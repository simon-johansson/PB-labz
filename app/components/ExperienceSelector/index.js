
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import Slider from 'react-rangeslider';

import { selectKnownExperiences } from 'containers/App/selectors';
import {
  setExperience,
  removeExperience,
} from 'containers/App/actions';

import styles from './styles.css';

export class ExperienceSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasExperience: 0,
    };
  }

  componentDidMount() {
    let hasExperience;
    this.props.knownExperiences.forEach((item) => {
      if (item.get('id') === this.props.item.varde) {
        this.setState({ hasExperience: item.get('years') });
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    let hasExperience = false;
    nextProps.knownExperiences.forEach((item) => {
      if (item.get('id') === nextProps.item.varde) {
        hasExperience = true;
      }
    });
    return hasExperience || this.state.hasExperience;
  }

  componentWillReceiveProps(nextProps) {
    nextProps.knownExperiences.forEach((item) => {
      if (item.get('id') === nextProps.item.varde) {
        this.setState({
          hasExperience: item.get('years'),
        });
      }
    });
  }

  setExperience(val) {
    // console.log(val, this.state.hasExperience);
    if (val !== this.state.hasExperience) {
      // console.log(this.props.item);
      // console.log(val);
      this.setState({ hasExperience: val });
      if (val) {
        this.props.onSetExperience(this.props.item.varde, val);
      } else {
        this.props.onRemoveExperience(this.props.item.varde);
      }
    }
  }

  readableExperience() {
    switch (this.state.hasExperience) {
      case 0:
        return 'Ingen erfarenhet';
        break;
      case 1:
        return 'Mindre än 1 års erfarenhet';
        break;
      case 2:
        return '1-2 års erfarenhet';
        break;
      case 3:
        return '2-4 års erfarenhet';
        break;
      case 4:
        return '5 års erfarenhet eller mer';
        break;
    }
  }

  render() {
    // console.log(this.props.knownExperiences);
    const item = this.props.item;

    return (
      <div className={styles.experience}>
        <span className={styles.experienceOccupation}>{item.efterfragat}</span>
        <span className={styles.selectedExperience}>{this.readableExperience()}</span>
        <Slider
          value={this.state.hasExperience}
          min={0}
          max={4}
          step={1}
          tooltip={false}
          orientation='horizontal'
          onChange={this.setExperience.bind(this)}
        />
        <div className={styles.years}>
          <span onClick={this.setExperience.bind(this, 0)}>0<figure>|</figure></span>
          <span onClick={this.setExperience.bind(this, 1)}>{/*0-1 år*/}<figure>|</figure></span>
          <span onClick={this.setExperience.bind(this, 2)}>{/*1-2 år*/}<figure>|</figure></span>
          <span onClick={this.setExperience.bind(this, 3)}>{/*2-4 år*/}<figure>|</figure></span>
          <span onClick={this.setExperience.bind(this, 4)}>+5 år<figure>|</figure></span>
        </div>
      </div>
    )
  }
}

ExperienceSelector.propTypes = {
  item: React.PropTypes.object,
  changeRoute: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onSetExperience: (id, years) => dispatch(setExperience(id, years)),
    onRemoveExperience: (id) => dispatch(removeExperience(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  knownExperiences: selectKnownExperiences(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(ExperienceSelector);