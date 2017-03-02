
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import * as ls from 'utils/localstorage';

import List from 'components/List';
import OccupationListItem from 'components/OccupationListItem';
import styles from './styles.css';
// import gubbe from './gubbe.png';
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
      locationsTipsNumber: 3,
    };
  }

  openRoute = (route) => {
    setTimeout(() => {
      this.props.changeRoute(route);
    }, 1);
  };

  openFilterPage = () => {
    this.openRoute('/filter');
  };

  onOccupationTagClick(item, e) {

    if (item.typ === 'more') {
      this.setState({
        occupationsTipsNumber: this.state.occupationsTipsNumber + 3,
      });
    } else {
      this.props.onLoadAdditionalOccupation(item);
      this.scrollToBottom();

      ls.newPreviousSearch({
        occupations: this.props.occupations.push(item),
        locations: this.props.locations,
        time: new Date().valueOf(),
      });
    }
  }

  onLocationTagClick(item, e) {

    if (item.typ === 'more') {
    this.setState({
      locationsTipsNumber: this.state.locationsTipsNumber + 3,
    });
    } else {
      this.props.onLoadAdditionalLocations(item);
      this.scrollToBottom();

      ls.newPreviousSearch({
        occupations: this.props.occupations,
        locations: this.props.locations.push(item),
        time: new Date().valueOf(),
      });
    }
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
    return this.shouldShowOccupationTips() || this.shouldShowLocationTips();
  }

  shouldShowOccupationTips() {
    return this.props.shouldShowOccupationTips && !!this.filterOccupations().length;
  }

  shouldShowLocationTips() {
    return this.props.shouldShowLocationTips && !!this.filterLocations().length;
  }

  hasTipsToShow() {
    let hasTips = false;
    if (this.shouldShowLocationTips()) {
      if (this.filterLocations().length) hasTips = true;
    }
    if (this.shouldShowOccupationTips()) {
      if (this.filterOccupations().length) hasTips = true;
    }
    console.log(hasTips);
    return hasTips;
  }

  filterOccupations() {
    if (this.props.related) {
      const isIncluded = (name1, name2) => name1 === name2;
      return _.orderBy(this.props.related.filter(rel => {
          const { namn, typ } = rel.matchningskriterium;
          let included = false;
          this.props.occupations.forEach(o => {
            if (isIncluded(o.namn, namn)) included = true;
          });
          // console.log(this.props.additionalSearchParameters);
          this.props.additionalSearchParameters.forEach(o => {
            // console.log(o);
            if (isIncluded(o.namn, namn)) included = true;
          });
          // console.log(typ);
          if (typ === 'YRKESROLL' && !included) return true;
        }), 'antal', 'desc');
    } else {
      return [];
    }
  }

  filterLocations() {
    if (this.props.related) {
      const isIncluded = (name1, name2) => name1 === name2;
      return this.props.related
        .filter(rel => {
          const { namn, typ } = rel.matchningskriterium;
          let included = false;
          this.props.locations.forEach((o) => {
            if (isIncluded(o.namn, namn)) included = true;
          });
          this.props.additionalSearchParameters.forEach((o) => {
            if (isIncluded(o.namn, namn)) included = true;
          });
          // console.log(typ);
          if (typ === 'KOMMUN' && !included) return true;
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

  shouldShowMoreItem(listType, numberOfTips, numberOfTipsShowing) {
    const moreItem = { namn: 'Visa fler...', typ: 'more', list: listType };
    return numberOfTips > numberOfTipsShowing ? moreItem : false;
  }

  render() {
    const moreOccupationItems = this.shouldShowMoreItem('occupations', this.filterOccupations().length, this.state.occupationsTipsNumber);
    const occupationItems = this.filterOccupations().slice(0, this.state.occupationsTipsNumber);
    if (moreOccupationItems) occupationItems.push(moreOccupationItems);

    const moreLocationItems = this.shouldShowMoreItem('locations', this.filterOccupations().length, this.state.locationsTipsNumber);
    const locationItems = this.filterLocations().slice(0, this.state.locationsTipsNumber);
    if (moreLocationItems) locationItems.push(moreLocationItems);

    return (
      <div>
        {this.shouldShowTips() &&
          <div id='rut-tips' className={styles.tipsWrapper}>
            <h2>Tips!</h2>

            {this.shouldShowLocationTips() &&
              <div className={styles.tagWrapper}>
                <p className={styles.listHeader}>Jobb för <span className={styles.dynamicText}>{this.props.occupationSummary.split('för ')[1]}</span> i närliggande orter</p>
                {/*<p>Jobb för din sökning i närliggande orter</p>*/}
                <List
                  items={locationItems}
                  component={OccupationListItem}
                  click={this.onLocationTagClick.bind(this)}
                  isTips
                />
              </div>
            }

            {this.shouldShowOccupationTips() &&
              <div className={styles.tagWrapper}>
                {/*<p>Relaterade yrken {this.props.summary}</p>*/}
                <p className={styles.listHeader}>Relaterade yrken {this.props.locationSummary.indexOf('i ') === -1 ? '' : ' i '} <span className={styles.dynamicText}>{this.props.locationSummary.split('i ')[1]}</span></p>
                <List
                  items={occupationItems}
                  component={OccupationListItem}
                  click={this.onOccupationTagClick.bind(this)}
                  isTips
                />
              </div>
            }
          </div>
        }
        {!this.shouldShowTips() && this.props.shouldShowSadFace &&
          <div className={styles.noTipsToShow}>
            <p>Inga jobb hittades för <b>{this.props.summary.split('för ')[1]}</b>. Kontrollera att du inte stavat fel eller prova att söka på ett annat yrke eller titel.</p>
            <button
              className={styles.goToFilter + ' btn btn-default'}
              onClick={this.openFilterPage.bind(this)}
            >
              <span className={styles.searchIcon + " iosIcon"}></span>
              Ändra min sökning
            </button>
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
  shouldShowOccupationTips: true,
  shouldShowLocationTips: true,
};

export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
    onLoadAdditionalOccupation: (occupations) => {
      // dispatch(addOccupation(occupation));
      dispatch(loadAdditionalJobs({
        occupations,
      }));
    },
    onLoadAdditionalLocations: (locations) => {
      // dispatch(addOccupation(occupation));
      dispatch(loadAdditionalJobs({
        locations,
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