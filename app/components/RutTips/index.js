
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import * as ls from 'utils/localstorage';

import List from 'components/List';
import OccupationListItem from 'components/OccupationListItem';

import styles from './styles.css';
import gubbe from './gubbe.png';
import tips from './tips.png';

import {
  loadAdditionalJobs,
} from 'containers/App/actions';

import {
  selectRelated,
  selectAdditionalSearchParameters,
  selectAdditionalAds,
  // selectAdditionalOccupations,
  // selectAdditionalAmount,
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
      occupationsTipsNumber: 3,
    };
  }

  onTagClick(item, e) {
    // let occupations = this.state.occupations.slice();

    // if (!!occupations.filter((o) => o.namn === item.namn).length) {
    //   occupations = occupations.filter((o) => o.namn !== item.namn);
    // } else {
    //   occupations.push(item);
    // }

    // occupations.push(item);

    if (item.typ === 'more') {
      this.setState({
        occupationsTipsNumber: this.state.occupationsTipsNumber + 3,
      });
    } else {
      this.props.onLoadJobs(item);
      this.scrollToBottom();
    }

    // this.setState({ occupations });

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

    // document.getElementById('rut-tips').scrollIntoView({ behavior: 'smooth' });
  }

  // createSearchSummary() {
  //   const occupations = JSON.parse(JSON.stringify(this.props.additionalOccupations)).map((item, index) => item.namn);
  //   const locations = JSON.parse(JSON.stringify(this.props.locations)).map((item, index) => item.namn);
  //   let str = '';
  //   if (occupations.length) str += `för ${occupations.join(' & ')}`;
  //   if (locations.length) str += ` i ${locations.join(', ')}`;
  //   return str;
  // }

  shouldShowTips() {
    return this.props.shouldShowTips &&
           !!this.filterOccupations().length;
  }

  filterOccupations() {
    if (this.props.related) {
      const isIncluded = (name1, name2) => name1 === name2;
      return this.props.related
        .filter(rel => {
          const { namn, typ } = rel.matchningskriterium;
          let included = false;
          this.props.occupations.forEach(o => {
            if (isIncluded(o.namn, namn)) included = true;
          });
          // console.log(this.props.additionalSearchParameters);
          this.props.additionalSearchParameters.forEach(o => {
            if (isIncluded(o.namn, namn)) included = true;
          });
          if (typ === 'YRKESROLL' && !included) return true;
        });
    } else {
      return [];
    }
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

  numberOfTipsShowing() {
    return this.state.occupationsTipsNumber;
  }

  shouldShowMoreItem() {
    const moreItem = {namn: 'Visa fler...', typ: 'more'};
    const numberOfTips = this.filterOccupations().length;

    return numberOfTips > this.numberOfTipsShowing() ? moreItem : false;
  }

  render() {
    const moreItem = this.shouldShowMoreItem();
    const items = this.filterOccupations().slice(0, this.numberOfTipsShowing());
    if (moreItem) items.push(moreItem);

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
            <div className={styles.tagWrapper}>
              <p>Relaterade yrken {this.props.summary}</p>
              {/*<img className={styles.tipsImg} src={tips} />*/}
              {/*this.getRelatedOccupations()*/}
              <List
                items={items}
                component={OccupationListItem}
                click={this.onTagClick.bind(this)}
              />
            </div>
          </div>
        }
      </div>
    );
  }
}

RutTips.propTypes = {
  item: React.PropTypes.object,
};

RutTips.defaultProps = {
  shouldShowSadFace: true,
  shouldShowTips: true,
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
  additionalSearchParameters: selectAdditionalSearchParameters(),
  additionalAds: selectAdditionalAds(),
  // additionalOccupations: selectAdditionalOccupations(),
  // additionalAmount: selectAdditionalAmount(),
});

export default connect(mapStateToProps, mapDispatchToProps)(RutTips);