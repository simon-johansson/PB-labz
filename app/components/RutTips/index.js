
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as ls from 'utils/localstorage';

import styles from './styles.css';
import gubbe from './gubbe.png';
import tips from './tips.png';

import {
  loadAdditionalJobs,
} from 'containers/App/actions';

import {
  selectRelated,
  selectAdditionalOccupations,
  selectAdditionalAmount,
} from 'containers/App/selectors';

import {
  selectOccupations,
  selectLocations,
} from 'containers/ListPage/selectors';

import {
  addOccupation,
} from 'containers/AddOccupation/actions';

export class RutTips extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      occupations: props.additionalOccupations.slice(),
    };
  }

  onTagClick(item, e) {
    let occupations = this.state.occupations.slice();
    if (!!occupations.filter((o) => o.namn === item.namn).length) {
      occupations = occupations.filter((o) => o.namn !== item.namn);
    } else {
      occupations.push(item);
    }

    this.props.onLoadJobs(occupations);
    this.scrollToBottom();
    this.setState({ occupations });

    // ls.newPreviousSearch({
    //   occupations: this.props.occupations.push(item),
    //   locations: this.props.locations,
    //   time: new Date().valueOf(),
    // });
  }

  scrollToBottom() {
    // const body = document.body;
    // const html = document.documentElement;
    // const height = Math.max(body.scrollHeight, body.offsetHeight,
    //                       html.clientHeight, html.scrollHeight, html.offsetHeight);

    // setTimeout(() => {
      // window.scroll({
      //   top: height,
      //   behavior: 'smooth',
      // });
    // }, 1);

    document.getElementById('rut-tips').scrollIntoView({ behavior: 'smooth' });
  }

  createSearchSummary() {
    const occupations = JSON.parse(JSON.stringify(this.props.additionalOccupations)).map((item, index) => item.namn);
    const locations = JSON.parse(JSON.stringify(this.props.locations)).map((item, index) => item.namn);
    let str = '';
    if (occupations.length) str += `för ${occupations.join(' & ')}`;
    if (locations.length) str += ` i ${locations.join(', ')}`;
    return str;
  }

  shouldShowTips() {
    return !!this.filterOccupations().length &&
           this.props.shouldShowSadTips;
  }

  filterOccupations() {
    return this.props.related
      .filter(rel => {
        const { namn, typ } = rel.matchningskriterium;
        let included = false;
        this.props.occupations.forEach(o => {
          if (o.namn === namn) included = true;
        });
        if (typ === 'YRKESROLL' && !included) return true;
      });
  }

  getRelatedOccupations() {
    return this.filterOccupations()
      .slice(0, 5)
      .map((rel, index) => {
        const { namn } = rel.matchningskriterium;
        const isActive = !!this.state.occupations.filter(o => o.namn === namn).length;
        return (
          <span
            className={styles.relatedTag + (isActive ? ' activeAdditionalTag' : '')}
            onClick={this.onTagClick.bind(this, rel.matchningskriterium)}
            key={'rut-tag-' + index}
          >
            {namn} ({rel.antal})
          </span>
        );
    });
  }

  render() {
    return (
      <div>
        {this.props.shouldShowSadFace &&
          <div className={styles.imageWrapper}>
            <img className={styles.gubbe} src={gubbe} />
            <p>Inga jobb hittades {this.props.summary}</p>
          </div>
        }
        {this.shouldShowTips() &&
          <div id='rut-tips' className={styles.tipsWrapper}>
            <h2>Tips!</h2>
            <p>Vill du se jobb för något utav dessa relaterade yrken?</p>
            <div className={styles.tagWrapper}>
              {/*<img className={styles.tipsImg} src={tips} />*/}
              {this.getRelatedOccupations()}
            </div>
          </div>
        }
        {this.shouldShowTips() && !!this.props.additionalAmount && !!this.props.additionalOccupations.length &&
          <span className={styles.amount}>
            Hittade {this.props.additionalAmount} jobb {this.createSearchSummary()}
          </span>
        }
      </div>
    );
  }
}

RutTips.propTypes = {
  item: React.PropTypes.object,
};

RutTips.defaultProps = {
  shouldShowSadTips: true,
};

export function mapDispatchToProps(dispatch) {
  return {
    onLoadJobs: (occupations) => {
      // dispatch(addOccupation(occupation));
      dispatch(loadAdditionalJobs({
        occupations: occupations,
      }));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  related: selectRelated(),
  occupations: selectOccupations(),
  locations: selectLocations(),
  additionalOccupations: selectAdditionalOccupations(),
  additionalAmount: selectAdditionalAmount(),
});

export default connect(mapStateToProps, mapDispatchToProps)(RutTips);