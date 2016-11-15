
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as ls from 'utils/localstorage';

import styles from './styles.css';
import gubbe from './gubbe.png';

import {
  loadJobs,
} from 'containers/App/actions';

import {
  selectRelated,
} from 'containers/App/selectors';

import {
  selectOccupations,
  selectLocations,
} from 'containers/ListPage/selectors';

import {
  addOccupation,
} from 'containers/AddOccupation/actions';

export class RutTips extends React.Component {

  onTagClick(item) {
    this.props.onAddOccupation(item);

    ls.newPreviousSearch({
      occupations: this.props.occupations.push(item),
      locations: this.props.locations,
      time: new Date().valueOf(),
    });
  }

  getRelatedOccupations() {
    // console.log(this.props.related);

    return this.props.related.map((rel) => {
      const name = rel.matchningskriterium.namn;
      return (
        <span
          className={styles.relatedTag}
          onClick={this.onTagClick.bind(this, rel.matchningskriterium)}
        >
          {name} ({rel.antal})
        </span>
      );
    });
  }

  render() {
    return (
      <div>
        <div className={styles.imageWrapper}>
          <img className={styles.gubbe} src={gubbe} />
          <p>Inga jobb hittades {this.props.summary}</p>
        </div>
        {!!this.props.related.length &&
          <div className={styles.tipsWrapper}>
            <h2>Tips!</h2>
            <p>Vill du se jobb för något utav dessa relaterade yrken?</p>
            {this.getRelatedOccupations()}
          </div>
        }
      </div>
    );
  }
}

RutTips.propTypes = {
  item: React.PropTypes.object,
};


export function mapDispatchToProps(dispatch) {
  return {
    onAddOccupation: (occupation) => {
      dispatch(addOccupation(occupation))
      dispatch(loadJobs())
    }
  };
}

const mapStateToProps = createStructuredSelector({
  related: selectRelated(),
  occupations: selectOccupations(),
  locations: selectLocations(),
});

export default connect(mapStateToProps, mapDispatchToProps)(RutTips);