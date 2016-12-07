/*
 * ListPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
// import Helmet from 'react-helmet';
import _ from 'lodash';
import Tappable from 'react-tappable';

// import messages from './messages';
import { createStructuredSelector } from 'reselect';
import * as ls from 'utils/localstorage';
import Slider from 'react-rangeslider';

import {
  selectRepos,
  selectLoading,
  selectError,
  selectJobs,
  selectAmount,
  selectRelated,
  selectCompetences,
  selectKnownCompetences,
  selectAdditionalSearchParameters,
  selectAdditionalAds,
  // selectAdditionalJobs,
  // selectLoadingAdditional,
  // selectAdditionalOccupations,
  // selectAdditionalAmount,
} from 'containers/App/selectors';

import {
  selectOccupations,
  selectLocations,
  selectUiState,
  selectCurrentTab,
  selectShowMatchingJobs,
  selectShowNonMatchningJobs,
  selectShouldLoadNewJobs,
  selectScrollPosition,
} from './selectors';

import {
  removeOccupation,
  removeLocation,
  setUiState,
} from './actions';
import {
  loadRepos,
  loadJobs,
  removeAdditionalJob,
} from '../App/actions';

import { FormattedMessage } from 'react-intl';
import RepoListItem from 'containers/RepoListItem';
import JobListItem from 'components/JobListItem';
import CompetenceListItem from 'components/CompetenceListItem';
import IosMenu from 'components/IosMenu';
import Button from 'components/Button';
import RutTips from 'components/RutTips';
import SadFace from 'components/SadFace';
import H2 from 'components/H2';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';

let summaryHeaders = [];
const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

export class ListPage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    let hasMatching = false;

    if (props.competences) {
      hasMatching = !!props.competences.filter((comp) => {
        return props.knownCompetences.includes(comp.varde)
      }).length;
    }

    // console.log(hasMatching);

    this.state = {
      tab: hasMatching ? props.currentTab : 'all',
      // showMatchingJobs: false,
      showMatchingJobs: hasMatching,
      showNonMatchningJobs: props.showNonMatchningJobs,
      scrollPosition: 0,
      showStickyHeader: false,
      stickyHeaderText: '',
      originalSearchParams: {
        occupations: props.occupations,
        locations: props.locations,
      },
      showSaveSearchPopup: false,
      searchIsSaved: false,
      showCriteriaContent: false,
    };

    this.onAdvertClick = this.onAdvertClick.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    // console.log(this.props.shouldLoadNewJobs, this.props.loading);
    if (this.props.shouldLoadNewJobs) {
      this.props.onSubmitForm();
    }

    let hasMatching = false;
    if (this.props.competences) {
      hasMatching = !!this.props.competences.filter((comp) => {
        return this.props.knownCompetences.includes(comp.varde);
      }).length;
    }

    this.props.setUiState({
      showMatchingJobs: hasMatching,
      tab: hasMatching ? this.props.currentTab : 'all',
      scrollPosition: 0,
      showNonMatchningJobs: this.props.showNonMatchningJobs,
    });


    this.scrollTo(this.props.scrollPosition);

    // console.log('mount');
    // summaryHeaders = [];
    window.addEventListener('scroll', this.onScroll, false);
    // window.addEventListener('touchmove', this.onScroll);

    // if (this.props.occupations && this.props.occupations.length > 0) {
    //   this.props.onSubmitForm();
    // }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
    // window.removeEventListener('touchmove', this.onScroll, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.competences !== this.props.competences) {
      let hasMatching = false;

      if (nextProps.competences) {
        hasMatching = !!nextProps.competences.filter((comp) => {
          return nextProps.knownCompetences.includes(comp.varde);
        }).length;
      }

      this.setState({ showMatchingJobs: hasMatching });

      // console.log(nextProps.currentTab);

      nextProps.setUiState({
        showMatchingJobs: hasMatching,
        tab: nextProps.currentTab,
        scrollPosition: 0,
        showNonMatchningJobs: nextProps.showNonMatchningJobs,
      });
    }
  }

  onScroll() {
    const headers = summaryHeaders.filter(h => h.el);
    // console.log(headers);
    const position = document.documentElement.scrollTop || document.body.scrollTop;

    // console.log(headers);

    if (!!headers.length) {
      if (position > headers[0].el.offsetTop) {
        if (!this.state.showStickyHeader) {
          this.setState({ showStickyHeader: true });
        }
      } else {
        if (this.state.showStickyHeader) {
          this.setState({ showStickyHeader: false });
        }
      }

      const closest = headers.sort((a, b) => {
        // console.log(a, b);
        // console.log(a.el.offsetTop, b.el.offsetTop, position);
        const aOffset = a.el.offsetTop;
        const bOffset = b.el.offsetTop;
        const high = aOffset > bOffset ? aOffset : bOffset;
        const low = aOffset < bOffset ? aOffset : bOffset;

        if (isSafari) {
          return ((position > low) && (position < high)) ? -1 : 1;
        } else {
          return ((position > low) && (position < high)) ? 1 : -1;
        }
      })[0];
    // console.log(closest);

    // const test = _.orderBy(headers, [(o) => {
    //   return o.el.offsetTop;
    // }], ['desc'])[0];

      if (closest.text !== this.state.stickyHeaderText) {
        this.setState({ stickyHeaderText: closest.text });
      }
    }
  }

  // componentWillUpdate() {
  //   this.scrollTo(this.props.scrollPosition);
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.scrollPosition === nextProps.scrollPosition) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  /**
   * Changes the route
   *
   * @param  {string} route The route we want to go to
   */
  openRoute = (route) => {
    // console.log('openRoute', route);
    setTimeout(() => {
      this.props.changeRoute(route);
    }, 1);
  };

  /**
   * Changed route to '/features'
   */
  openHomePage = () => {
    // console.log('openHomePage');

    this.props.setUiState({
      showMatchingJobs: false,
      tab: 'all',
      scrollPosition: 0,
      showNonMatchningJobs: false,
    });

    this.openRoute('/');
  };

  addFilterPage = () => {
    this.props.setUiState({
      showMatchingJobs: this.state.showMatchingJobs,
      tab: this.props.currentTab,
      scrollPosition: 0,
      showNonMatchningJobs: this.props.showNonMatchningJobs,
    });

    this.openRoute('/filter');
  };

  createOccupationTags() {
    return this.props.occupations.map((item, index) => {
      return (
        <div
          className={styles.tag}
          onClick={this.removeOccupationTag.bind(this, index)}
          key={`occupations-${index}`}
        >
          <span className={styles.tagText}>
            {item.namn}
            <span className="glyphicon glyphicon-remove" />
          </span>
        </div>
      );
    });
  }

  createLocationTags() {
    return this.props.locations.map((item, index) => {
      // console.log(item);
      return (
        <div
          className={styles.tag}
          onClick={this.removeLocationTag.bind(this, index)}
          key={`locations-${index}`}
        >
          <span className={styles.tagText}>
            {item.namn}
            <span className="glyphicon glyphicon-remove" />
          </span>
        </div>
      );
    });
  }

  createSearchInput(occ, loc) {
    const occupations = JSON.parse(JSON.stringify(occ || this.props.occupations)).map((item, index) => item.namn);
    const locations = JSON.parse(JSON.stringify(loc || this.props.locations)).map((item, index) => item.namn);
    const str = occupations.concat(locations).join(', ')
    return str.length ? str : 'Alla jobb i Platsbanken';
  }

  createSearchSummary(occ, loc) {
    const occupations = JSON.parse(JSON.stringify(occ || this.props.occupations)).map((item, index) => item.namn);
    const locations = JSON.parse(JSON.stringify(loc || this.props.locations)).map((item, index) => item.namn);
    let str = '';
    if (occupations.length) str += `för ${occupations.join(' & ')}`;
    if (locations.length) str += ` i ${locations.join(', ')}`;
      // else if (!str && locations.length) str += `${locations.join(', ')}`
    return str;
  }

  competenceSelection() {
    let top5 = _.orderBy(JSON.parse(JSON.stringify(this.props.competences)), 'timesRequested', 'desc').slice(0, 5);
    top5 = top5.map((item, index) => {
      item.isTop5 = (index + 1);
      return item;
    });

    return (
      <div>
        {!!this.props.competences.length &&
          <div>
            {(this.props.competences.length > 10) &&
              <div>
                <span
                  className={styles.amount}
                  ref={(r) => summaryHeaders.push({ el: r, text: 'Mest efterfrågade kompetenserna' })}
                >
                  {/*Mest efterfrågade kompetenserna {this.createSearchSummary()}*/}
                  Mest efterfrågade
                </span>
                <List items={top5} component={CompetenceListItem} />
              </div>
            }
            <span
              className={styles.amount}
              ref={(r) => summaryHeaders.push({ el: r, text: 'Alla efterfrågade kompetenserna' })}
            >
              {/*Alla efterfrågade kompetenser {this.createSearchSummary()}*/}
              Alla efterfrågade
            </span>
            <List items={this.props.competences} component={CompetenceListItem} />
          </div>
        }
        {!this.props.competences.length &&
          <div className={styles.matchDescription}>
            <p>Kan inte göra någon matchning för denna sökning</p>
          </div>
        }
      </div>
    );
  }

  criteriaSelection() {
    const renderKnownCompetences = () => {
      const content = []
      this.props.competences.forEach((comp, index) => {
        if (this.props.knownCompetences.includes(comp.varde)) {
          content.push(
            <div
              className={styles.tag}
              key={`competence-${index}`}
            >
              <span className={styles.tagText}>
                {comp.efterfragat}
              </span>
            </div>
          );
        }
      });

      return content;
    };

    let locations = this.createSearchInput([], this.props.locations);
    locations = locations === 'Alla jobb i Platsbanken' ? 'Hela Sverige' : locations;

    return (
      <div className={styles.matchCriteriaPopover}>
        <div className={styles.searchForm}>
          <span
            className={styles.cancel}
            onClick={this.cancelMatchCriteriaPopover.bind(this, !!renderKnownCompetences().length)}
          >Avbryt</span>
          {/*<h1>Matchningskriterier</h1>*/}
          <div className={styles.matchCriteriaSearchSummary}>
            <div className={styles.matchCriteriaSearchSummaryText}>
              <span>{this.createSearchInput(this.props.occupations, [])}</span>
              <span className={styles.small}>{locations}</span>
            </div>
          </div>
        </div>

        <div className={styles.matchDescription}>
          <p>Ange vad du kan för att se jobben som passar dig bäst</p>
        </div>

        <div className={styles.criteraWrappper}>
          <header
            className={styles.criteriaSelectionHeader}
            onClick={this.showCriteriaContent.bind(this)}
          >
            Kompetenser
            <span className={styles.pencilIcon + ' glyphicon glyphicon-pencil'} />
          </header>
          {this.state.showCriteriaContent &&
            <section className={styles.criteriaSelectionContent}>
              {this.competenceSelection()}
            </section>
          }

          {!this.state.showCriteriaContent && !!renderKnownCompetences().length &&
            <section className={styles.criteriaSelectionContent}>
              {renderKnownCompetences()}
            </section>
          }
        </div>
        <div className={styles.criteraWrappper}>
          <header className={styles.criteriaSelectionHeader}>
            Erfarenheter
            <span className={styles.pencilIcon + ' glyphicon glyphicon-pencil'} />
          </header>
        </div>
        <div className={styles.criteraWrappper}>
          <header className={styles.criteriaSelectionHeader}>
            Körkort
            <span className={styles.pencilIcon + ' glyphicon glyphicon-pencil'} />
          </header>
        </div>
      </div>
    );
  }

  showCriteriaContent() {
    this.setState({
      showCriteriaContent: !this.state.showCriteriaContent,
    });
  }

  cancelMatchCriteriaPopover(hasMatchning) {
    let tab;
    let showMatchingJobs;

    if (!hasMatchning) {
      tab = 'all';
      showMatchingJobs = false;
    } else {
      tab = this.props.currentTab;
      showMatchingJobs = true;
    }

    this.setState({
      showMatchingJobs,
      tab
    });
    this.props.setUiState({
      tab,
      showMatchingJobs,
      showNonMatchningJobs: false,
      scrollPosition: 0,
    });
    this.scrollTo(0);
  }

  createCompetencesCloud(matchingJobs) {
    const {
      occupations: ogOccupations,
      locations: ogLocations,
    } = this.state.originalSearchParams;

    if (this.props.loading) {
      return <List component={LoadingIndicator} />
    } else if (!this.props.jobs.length) {
      return (
        <div>
          <div className={styles.matchDescription}>
            <p>Kan inte göra någon matchning för denna sökning</p>
          </div>
        </div>
      )
    } else {
      return (
        <div className={styles.matchWrapper}>
          {this.criteriaSelection()}
          {!!this.props.knownCompetences.size &&
            <button
              className={styles.showMatchingButton + ' btn btn-default'}
              onClick={this.showMatchingJobs.bind(this)}
            >
              Visa matchande jobb
              { !!matchingJobs &&
                ` (${matchingJobs})`
              }
            </button>
          }
        </div>
      );
    }
  }

  experienceTest() {
    return (
      <div className={styles.experience}>
        <Slider
          value={5}
          min={0}
          max={20}
          step={5}
          orientation='horizontal'
          onChange={() => console.log('change')}
        />
        <div>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    )
  }

  showMatchingJobs() {
    this.setState({ showMatchingJobs: true });
    this.props.setUiState({
      showMatchingJobs: true,
      showNonMatchningJobs: false,
      tab: this.props.currentTab,
      scrollPosition: 0,
    });
    this.scrollTo(0);
  }

  hideMatchingJobs() {
    this.setState({
      showMatchingJobs: false,
      showCriteriaContent: false
    });
    this.props.setUiState({
     showMatchingJobs: false,
     showNonMatchningJobs: false,
     tab: this.props.currentTab,
     scrollPosition: 0,
   });
  }

  removeOccupationTag(index, e) {
    e.stopPropagation();
    this.props.onRemoveOccupation(index);
  }

  removeLocationTag(index, e) {
    e.stopPropagation();
    this.props.onRemoveLocation(index);
  }

  setTabState(tabState) {
    // console.log('setTabState');
    // console.log(state);
    this.setState({tab: tabState});
    this.props.setUiState({
      tab: tabState,
      showMatchingJobs: this.state.showMatchingJobs,
      showNonMatchningJobs: this.props.showNonMatchningJobs,
      scrollPosition: 0
    });
    if (this.props.additionalSearchParameters.size) {
      this.setState({
        originalSearchParams: {
          occupations: this.props.occupations,
          locations: this.props.locations,
        },
      })
      this.props.onSubmitForm();
    }
  }

  scrollTo(position = 0, effect = 'instant') {
    if (this.props.location.pathname ===  '/list') {
      // window.requestAnimationFrame(() => {
      //   document.body.scrollTop = document.documentElement.scrollTop = position;
      // });

      if (effect === 'instant') {
        setTimeout(() => {
          window.scrollTo(0, position);
        }, 1);
      } else {
        setTimeout(() => {
          window.scroll({
            top: position,
            behavior: 'smooth',
          });
        }, 1);
      }
    }
  }

  onAdvertClick(link) {
    // console.log('click');
    this.props.setUiState({
      showMatchingJobs: this.state.showMatchingJobs,
      tab: this.props.currentTab,
      scrollPosition: document.body.scrollTop,
      showNonMatchningJobs: this.props.showNonMatchningJobs,
    });

    this.openRoute(link);
  }

  showNonMatchningJobs() {
    this.setState({showNonMatchningJobs: true});
    this.props.setUiState({
      tab: this.props.currentTab,
      showMatchingJobs: this.state.showMatchingJobs,
      showNonMatchningJobs: true,
      scrollPosition: this.props.scrollPosition,
    });
  }

  shouldShowOccupationTips() {
    let showShow = true;
    if (!this.props.occupations.size) {
      showShow = false;
    } else {
      this.props.occupations.forEach(o => {
        // console.log(o.typ);
        switch (o.typ) {
          case 'YRKESOMRADE':
          case 'YRKESGRUPP':
            showShow = false;
            break;
          case 'YRKE':
          case 'YRKESROLL':
            break;
        }
      });
    }
    // console.log(showShow);
    return showShow;
  }

  shouldShowLocationTips() {
    let showShow = true;
    if (!this.props.locations.size) {
      showShow = false;
    } else {
      this.props.locations.forEach(o => {
        // console.log(o.typ);
        switch (o.typ) {
          case 'LAN':
            showShow = false;
            break;
          case 'KOMMUN':
            break;
        }
      });
    }
    // console.log(showShow);
    return showShow;
  }

  onStickyHeaderClick() {
    this.scrollTo(0, 'smooth');
  }

  saveSearch() {
    if (!this.state.searchIsSaved) {
      this.setState({
        showSaveSearchPopup: true,
      });
    }
  }

  onSaveConfirm(shouldNotify) {
    ls.newFavoriteSearch({
      occupations: this.props.occupations,
      locations: this.props.locations,
      time: new Date().valueOf(),
      notify: shouldNotify,
    });

    this.setState({
      searchIsSaved: true,
      showSaveSearchPopup: false,
    });
  }

  shouldShowMatchingJobs() {
    let hasMatching = false;

    if (this.props.competences) {
      hasMatching = !!this.props.competences.filter((comp) => {
        return this.props.knownCompetences.includes(comp.varde);
      }).length;
    }

    return this.state.showMatchingJobs && hasMatching;
  }

  removeAdditionalSearchParams(param, index) {
    // console.log(param.typ);
    let removeIndex;
    if (param.typ === 'YRKESROLL') {
      this.props.occupations.forEach((occ, occIndex) => {
        // console.log(occ);
        if (param.id === occ.id) removeIndex = occIndex;
      });
      this.props.onRemoveOccupation(removeIndex, false);
    } else {
      this.props.locations.forEach((loc, locIndex) => {
        // console.log(loc);
        if (param.id === loc.id) removeIndex = locIndex;
      });
      this.props.onRemoveLocation(removeIndex, false);
    }
    this.props.onRemoveAdditionalJob(index);
  }

  render() {
    // console.log(this.state.showMatchingJobs);
    // console.log(this.props.additionalSearchParameters);
    // console.log(this.props.additionalAds);

    const {
      occupations: ogOccupations,
      locations: ogLocations,
    } = this.state.originalSearchParams;
    let mainContent = null;
    let matchingContent = null;
    const matchingJobs = [];
    const nonMatchingJobs = [];
    summaryHeaders = [];
    const ads = this.props.additionalSearchParameters.map((param, index) => {
      const isLocation = param.typ === 'KOMMUN';
      const searchSummary = isLocation ? this.createSearchSummary(null, [param]) : this.createSearchSummary([param]);
      const inputSummary = isLocation ? this.createSearchInput(null, [param]) : this.createSearchInput([param]);

      return (
        <div className={styles.additionalJobs} key={'additional-ads-' + index}>
          {!this.props.additionalAds.get(index) ?
            <div>
              <div className={styles.additionalAmountWrapper}>
                <span className={styles.amount}>
                  Hittade ... jobb {searchSummary}
                </span>
                <span
                  className={styles.rightPart + ' glyphicon glyphicon-remove-circle'}
                  onClick={this.removeAdditionalSearchParams.bind(this, param, index)}
                />
              </div>
              <List component={LoadingIndicator} />
            </div> :
            <div>
              <div className={styles.additionalAmountWrapper}>
                <span
                  className={styles.amount}
                  ref={(r) => summaryHeaders.push({ el: r, text: inputSummary })}
                >
                  Hittade {this.props.additionalAds.get(index).amount} jobb {searchSummary}
                </span>
                <span
                  className={styles.rightPart + ' glyphicon glyphicon-remove-circle'}
                  onClick={this.removeAdditionalSearchParams.bind(this, param, index)}
                />
              </div>
              <List items={this.props.additionalAds.get(index).jobs.slice(0, 50)} component={JobListItem} click={this.onAdvertClick} />
            </div>
          }
        </div>
      );
    });

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);
      matchingContent = (<List component={LoadingIndicator} />);

      const component = () => (
        <ListItem item={'Something went wrong, please try again!'} />
      );
    } else if (this.props.error !== false) {
      const ErrorComponent = () => (
        <ListItem item={'Something went wrong, please try again!'} />
      );
      mainContent = (<List component={ErrorComponent} />);

    // If we're not loading, don't have an error and there are repos, show the repos
    } else if (!this.props.jobs.length) {
      mainContent = (
        <div>
          {!this.props.additionalAds.size &&
            <SadFace
              summary={this.createSearchSummary()}
            />
          }
          {ads}
          <RutTips
            summary={this.createSearchSummary()}
            occupationSummary={this.createSearchSummary(this.props.occupations, [])}
            shouldShowSadFace={!this.props.amount}
            shouldShowOccupationTips={this.shouldShowOccupationTips()}
            shouldShowLocationTips={this.shouldShowLocationTips()}
          />
        </div>
      );

    } else if (this.props.jobs !== false) {
      // console.log(this.props.additionalAds.get(0));
      // console.log(this.props.additionalSearchParameters);
      // console.log(this.props.additionalSearchParameters[0]);
      mainContent = (
        <div>
          <span
            ref={(r) => summaryHeaders.push({ el: r, text: this.createSearchInput(ogOccupations, ogLocations) })}
            className={styles.amount}
          >
            Hittade {this.props.amount} jobb {this.createSearchSummary()}
          </span>
          <List items={this.props.jobs.slice(0, 50)} component={JobListItem} click={this.onAdvertClick}/>
          {ads}
          <RutTips
            summary={this.createSearchSummary()}
            occupationSummary={this.createSearchSummary(this.props.occupations, [])}
            shouldShowSadFace={!this.props.amount}
            shouldShowOccupationTips={this.shouldShowOccupationTips()}
            shouldShowLocationTips={this.shouldShowLocationTips()}
          />
        </div>
      );

      this.props.jobs.forEach(job => {
        const jobCopy = JSON.parse(JSON.stringify(job));
        const matchingCompetences = [];
        const notMatchingCompetences = [];
        let match = false;
        jobCopy.matchningsresultat.efterfragat.forEach(requirement => {
          if (this.props.knownCompetences.includes(requirement.varde)) {
            matchingCompetences.push(requirement);
            match = true;
          } else {
            if (requirement.typ == "KOMPETENS") {
              notMatchingCompetences.push(requirement);
            }
          }
        });
        if (match) {
          jobCopy.matchingCompetences = matchingCompetences;
          jobCopy.notMatchingCompetences = notMatchingCompetences;
          jobCopy.matchProcent = matchingCompetences.length / _.filter(jobCopy.matchningsresultat.efterfragat, { typ: 'KOMPETENS' }).length;
          // console.log(jobCopy.matchProcent);
          matchingJobs.push(jobCopy);
        } else {
          nonMatchingJobs.push(jobCopy);
        }
      });
      const sortedMatchingJobs = _.orderBy(matchingJobs,
        ['matchProcent', 'matchingCompetences', 'notMatchingCompetences'], ['desc', 'desc', 'asc']);
      // const sortedMatchingJobs = _.orderBy(matchingJobs,['matchProcent'], ['desc']);
      if (!sortedMatchingJobs.length) {
        // matchingContent = ();
      } else {
        matchingContent = (
          <div className={styles.listWrapperMatchingContent}>
            <div className={styles.myCompetences} onClick={this.hideMatchingJobs.bind(this)}>
              Kompetenser, erfarenheter & körkort {/*({this.props.knownCompetences.size})*/}
              <span className={styles.right + ' glyphicon glyphicon-chevron-right'}></span>
            </div>
            <span
              className={styles.amount}
              ref={(r) => summaryHeaders.push({ el: r, text: 'Jobb som matchar dina kompetenser' })}
            >
              {sortedMatchingJobs.length} jobb matchar dina kompetenser
            </span>
            <List items={sortedMatchingJobs.slice(0, 50)} component={JobListItem} click={this.onAdvertClick} />
            { !this.props.showNonMatchningJobs ?
              <button
                className={styles.showNonMatchningJobs}
                onClick={this.showNonMatchningJobs.bind(this)}
              >
                Visa jobb som inte matchar dina kompetenser
              </button> :
              <div>
                <span
                  className={styles.nonMatchingAmount}
                  ref={(r) => summaryHeaders.push({ el: r, text: 'Jobb som inte matchar dina kompetenser' })}
                >
                  Jobb som inte matchar dina kompetenser
                </span>
                <List items={nonMatchingJobs.slice(0, 50)} component={JobListItem} click={this.onAdvertClick} />
              </div>
            }
          </div>
        );
      }
    }

    return (
      <article ref='list' className='noselect'>
        {this.state.showStickyHeader &&
          <div
            className={styles.stickyHeader}
            onClick={this.onStickyHeaderClick.bind(this)}
          >
            {this.state.stickyHeaderText}
          </div>
        }
        <div className={styles.contentWrapper}>
          <section className={styles.textSection}>
            <div className={styles.searchForm}>
              <Tappable className={styles.cancel + ' glyphicon glyphicon-chevron-left'} onTap={this.openHomePage} />
              {/*<h1>Mina sökningar</h1>*/}
              <h1>&nbsp;</h1>
              <span
                className={`${styles.saveSearch} ${this.state.searchIsSaved ? styles.isSaved : ''}`}
                onClick={this.saveSearch.bind(this)}
              >
                {this.state.searchIsSaved ? 'Sparad' : 'Spara sökning'}
              </span>
              <form onClick={this.addFilterPage}>
                <div className="form-group">
                  <div className={styles.searchInputWrapper}>
                    <span className={styles.inputField}>
                      {this.createSearchInput()}
                      <i className={styles.searchIcon + " glyphicon glyphicon-search"} />
                    </span>
                  </div>
                  <span className={styles.filter}>
                    Filter
                  </span>
                </div>
              </form>
            </div>

            <div className={styles.toggleButtons}>
              <button
                className={this.props.currentTab === 'all' ? styles.activeButton : ''}
                onClick={this.setTabState.bind(this, 'all')}
              >
                Alla jobb
                {
                  !this.props.loading && !!this.props.amount &&
                  ` (${this.props.amount})`
                }
              </button>
              <button
                className={this.props.currentTab === 'match' ? styles.activeButton : ''}
                onClick={this.setTabState.bind(this, 'match')}
              >
                Matchande jobb
                { !!matchingJobs.length && !this.props.loading &&
                  ` (${matchingJobs.length})`
                }
              </button>
            </div>
            { this.props.currentTab === 'all' &&
                mainContent
            }
            { this.props.currentTab === 'match' &&
              (this.state.showMatchingJobs ?
                matchingContent :
                this.createCompetencesCloud(matchingJobs.length)
              )
            }
          </section>
          {/*<Button handleRoute={this.openFeaturesPage}>
            <FormattedMessage {...messages.featuresButton} />
          </Button>*/}
        </div>
        <IosMenu
          changeRoute={this.props.changeRoute}
        />
        {this.state.showSaveSearchPopup &&
          <div className={styles.overlay}>
            <div className={styles.saveSearchPopup}>
              <p className={styles.popupText}>
                <span className={styles.bell + ' glyphicon glyphicon-bell'} />
                Vill du få notiser när nya jobb dyker upp {this.createSearchSummary() || 'denna sökning'}?
              </p>
              <div
                className={styles.leftConfirmButton}
                onClick={this.onSaveConfirm.bind(this, true)}
              >Ja</div>
              <div
                className={styles.rightConfirmButton}
                onClick={this.onSaveConfirm.bind(this, false)}
              >Nej</div>
            </div>
          </div>
        }
      </article>
    );
  }
}

ListPage.propTypes = {
  changeRoute: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  repos: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  jobs: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onSubmitForm: React.PropTypes.func,
  // username: React.PropTypes.string,
  occupations: React.PropTypes.object,
  locations: React.PropTypes.object,
  jobLocation: React.PropTypes.string,
  onChangeUsername: React.PropTypes.func,
  onRemoveOccupation: React.PropTypes.func,
  onRemoveLocation: React.PropTypes.func,
  onRemoveAdditionalJob: React.PropTypes.func,
  setUiState: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    // onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onRemoveOccupation: (index, shouldReload) => dispatch(removeOccupation(index, shouldReload)),
    onRemoveLocation: (index, shouldReload) => dispatch(removeLocation(index, shouldReload)),
    onRemoveAdditionalJob: (index) => dispatch(removeAdditionalJob(index)),
    setUiState: (state) => dispatch(setUiState(state)),
    changeRoute: (url) => dispatch(push(url)),
    // onSubmitForm: (evt) => {
    //   if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    //   dispatch(loadRepos());
    // },
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      // console.log('load');
      dispatch(loadJobs());
    },

    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  repos: selectRepos(),
  jobs: selectJobs(),
  amount: selectAmount(),
  related: selectRelated(),
  uiState: selectUiState(),
  currentTab: selectCurrentTab(),
  showMatchingJobs: selectShowMatchingJobs(),
  scrollPosition: selectScrollPosition(),
  showNonMatchningJobs: selectShowNonMatchningJobs(),
  competences: selectCompetences(),
  knownCompetences: selectKnownCompetences(),
  occupations: selectOccupations(),
  shouldLoadNewJobs: selectShouldLoadNewJobs(),
  locations: selectLocations(),
  additionalSearchParameters: selectAdditionalSearchParameters(),
  additionalAds: selectAdditionalAds(),
  // additionalJobs: selectAdditionalJobs(),
  // loadingAdditional: selectLoadingAdditional(),
  // additionalOccupations: selectAdditionalOccupations(),
  // additionalAmount: selectAdditionalAmount(),
  loading: selectLoading(),
  error: selectError(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);