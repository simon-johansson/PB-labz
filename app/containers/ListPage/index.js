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

    this.state = {
      tab: 'all',
      showMatchingJobs: props.showMatchingJobs,
      showNonMatchningJobs: props.showNonMatchningJobs,
      scrollPosition: 0,
      showStickyHeader: false,
      stickyHeaderText: '',
      originalSearchParams: {
        occupations: props.occupations,
        locations: props.locations,
      },
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

  createCompetencesCloud(matchingJobs) {
    const {
      occupations: ogOccupations,
      locations: ogLocations,
    } = this.state.originalSearchParams;

    // if (this.props.competences.length) {
    //   return this.props.competences.map((item) => {
    //     return (
    //       <div>
    //         <span>{item.efterfragat}</span>
    //         <br />
    //       </div>
    //     );
    //   });
    // }
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
      let top5 = _.orderBy(JSON.parse(JSON.stringify(this.props.competences)), 'timesRequested', 'desc').slice(0, 5);
      top5 = top5.map((item, index) => {
        item.isTop5 = (index + 1);
        return item;
      });
      return (
        <div className={styles.matchWrapper}>
          {!!this.props.competences.length &&
            <div>
              <div className={styles.matchDescription}>
                <p>Ange dina kompetenser för att se jobben som passar dig bäst</p>
              </div>
              <span
                className={styles.amount}
                ref={(r) => summaryHeaders.push({ el: r, text: 'Mest efterfrågade kompetenserna' })}
              >
                Mest efterfrågade kompetenserna {this.createSearchSummary()}
              </span>
              <List items={top5} component={CompetenceListItem} />
              <span
                className={styles.amount}
                ref={(r) => summaryHeaders.push({ el: r, text: 'Alla efterfrågade kompetenserna' })}
              >
                Alla efterfrågade kompetenser {this.createSearchSummary()}
              </span>
              <List items={this.props.competences} component={CompetenceListItem} />
            </div>
          }
          {!this.props.competences.length &&
            <div className={styles.matchDescription}>
              <p>Kan inte göra någon matchning för denna sökning</p>
            </div>
          }
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
    this.setState({ showMatchingJobs: false });
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
      scrollPosition: 0,
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

  shouldShowTips() {
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

  onStickyHeaderClick() {
    this.scrollTo(0, 'smooth');
  }

  render() {
    // console.log('render');
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
      return (
        <div className={styles.additionalJobs} key={'additional-ads-' + index}>
          {!this.props.additionalAds.get(index) ?
            <div>
              <span className={styles.amount}>
                Hittade ... jobb {this.createSearchSummary([param])}
              </span>
              <List component={LoadingIndicator} />
            </div> :
            <div>
              <span
                className={styles.amount}
                ref={(r) => summaryHeaders.push({ el: r, text: this.createSearchInput([param]) })}
              >
                Hittade {this.props.additionalAds.get(index).amount} jobb {this.createSearchSummary([param])}
              </span>
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

    // Show an error if there is one
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
            shouldShowSadFace={!this.props.amount}
            shouldShowTips={this.shouldShowTips()}
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
            shouldShowSadFace={!this.props.amount}
            shouldShowTips={this.shouldShowTips()}
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
              Matchningskriterier ({this.props.knownCompetences.size})
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
              {/*<span className={styles.saveSearch} onClick={() => console.log('star')}>Spara</span>*/}
              <Tappable className={styles.cancel + ' glyphicon glyphicon-chevron-left'} onTap={this.openHomePage} />
              <h1>Mina sökningar</h1>
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
              (this.props.showMatchingJobs ?
                matchingContent :
                this.createCompetencesCloud(matchingJobs.length)
              )
            }
          </section>
          {/*<Button handleRoute={this.openFeaturesPage}>
            <FormattedMessage {...messages.featuresButton} />
          </Button>*/}
        </div>
        <IosMenu />
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
  setUiState: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    // onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
    onRemoveOccupation: (index) => dispatch(removeOccupation(index)),
    onRemoveLocation: (index) => dispatch(removeLocation(index)),
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