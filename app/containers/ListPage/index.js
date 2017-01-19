/*
 * ListPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import _ from 'lodash';
import Tappable from 'react-tappable';
import { defaults, Doughnut, Bar } from 'react-chartjs-2';

defaults.scale.gridLines.display = false;

import { createStructuredSelector } from 'reselect';
import * as ls from 'utils/localstorage';

import {
  selectRepos,
  selectLoading,
  selectError,
  selectJobs,
  selectMatchingJobs,
  selectNonMatchingJobs,
  selectHasMatchningJobs,
  selectAmount,
  selectRelated,
  selectCompetences,
  selectKnownCompetences,
  selectExperiences,
  selectDriverLicenses,
  selectKnownExperiences,
  selectKnownDriversLicenses,
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
  loadJobs,
  removeAdditionalJob,
} from '../App/actions';

import JobListItem from 'components/JobListItem';
import CompetenceListItem from 'components/CompetenceListItem';
import DriversLicenseListItem from 'components/DriversLicenseListItem';
import IosMenu from 'components/IosMenu';
import RutTips from 'components/RutTips';
import SadFace from 'components/SadFace';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import ExperienceSelector from 'components/ExperienceSelector';

import styles from './styles.css';

let summaryHeaders = [];
const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

export class ListPage extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      showMatchingJobs: props.hasMatchningJobs,
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
      showCompetenceCriteriaContent: false,
      showExperienceCriteriaContent: false,
      showDriversLicenseCriteriaContent: false,
      animationDuration: false,
      showAllCompetences: false,
    };

    this.onAdvertClick = this.onAdvertClick.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    window.$('body').removeClass('modal-open');

    if (this.props.shouldLoadNewJobs) {
      this.props.onSubmitForm();
    }

    this.props.setUiState({
      showMatchingJobs: this.props.hasMatchningJobs,
      tab: this.props.hasMatchningJobs ? this.props.currentTab : 'all',
      scrollPosition: 0,
      showNonMatchningJobs: this.props.showNonMatchningJobs,
    });

    this.scrollTo(this.props.scrollPosition);
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.competences !== this.props.competences ||
        nextProps.experiences !== this.props.experiences) {

      this.setState({ showMatchingJobs: nextProps.hasMatchningJobs });
      nextProps.setUiState({
        showMatchingJobs: nextProps.hasMatchningJobs,
        tab: nextProps.currentTab,
        scrollPosition: 0,
        showNonMatchningJobs: nextProps.showNonMatchningJobs,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll() {
    const headers = summaryHeaders.filter(h => h.el);
    const position = document.documentElement.scrollTop || document.body.scrollTop;

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

      if (closest.text !== this.state.stickyHeaderText) {
        this.setState({ stickyHeaderText: closest.text });
      }
    }
  }

  openRoute = (route) => {
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
    let requestedTop5 = 0;
    let requestedNotTop5 = 0;
    const colorArr = [
      '#69B8E3',
      '#F1583B',
      '#FBB678',
      '#394F80',
      '#35AB6E',
      'lightgray',
    ];
    const top5Arr = [];
    let competencesFiltered = [];
    const top5Comps = _.orderBy(JSON.parse(JSON.stringify(this.props.competences)), 'timesRequested', 'desc').slice(0, 5);
    const top5 = top5Comps.map((item, index) => {
      requestedTop5 += item.timesRequested;
      item.isTop5 = (index + 1);
      top5Arr.push(item.varde);
      return item;
    });
    if (this.props.competences.length > 10) {
      this.props.competences.forEach((item, index) => {
        if (!top5Arr.includes(item.varde)) {
          competencesFiltered.push(item);
        }
      });
    } else {
      competencesFiltered = this.props.competences.slice();
    }
    this.props.competences.forEach((comp, index) => requestedNotTop5 += comp.timesRequested);
    requestedNotTop5 -= requestedTop5;
    const dataset = [
      ...top5.map((c) => c.timesRequested),
      requestedNotTop5,
    ];

    // console.log(this.props.competences);

    const data = {
      labels: [
        ...top5.map((c) => {
          const cutoff = 26;
          if (c.efterfragat.length > cutoff) {
            return c.efterfragat.substring(0, cutoff) + '... 50%';
          } else {
            return c.efterfragat + ' 50%';
          }
        }),
        'Resterande'
      ],
      datasets: [{
        data: dataset,
        backgroundColor: colorArr,
      }]
    };
    const options = {
      // layout: {
        // padding: {
          // right: 100,
        // },
      // },
      events: false,
      tooltips: {
        enabled: false,
      },
      responsive: false,
      legend: {
        display: false,
        position: 'right',
        fullWidth: false,
        labels: {
          boxWidth: 12,
        }
      }
    }

    const donutLabels = () => {
      const content = [];
      top5.forEach((c, index) => {
        const procent = Math.floor((c.timesRequested / this.props.jobs.length) * 100);
        content.push(
          <li>
            <figure style={{background: colorArr[index]}} />
            <span className={styles.donutLabel}>{c.efterfragat}</span>
            <span className={styles.donutProcent}>{procent}%</span>
          </li>
        );
      });
      if (!!requestedNotTop5) {
        content.push(
          <li>
            <figure style={{background: colorArr[5]}} />
            <span className={styles.donutLabel}>Resterande</span>
            {/*<span className={styles.donutProcent}>{Math.floor((requestedNotTop5 / this.props.jobs.length) * 100)}</span>*/}
          </li>
        );
      }
      return content;
    };

    return (
      <div>
        <div className={styles.searchFormSticky}>
          <span
            className={styles.cancel}
            onClick={this.toggleCompetenceCriteriaContent.bind(this)}
          >Avbryt</span>
          <span
            className={styles.done}
            onClick={this.toggleCompetenceCriteriaContent.bind(this)}
          >Klar</span>
          <h1>Välj kompetenser</h1>
        </div>


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
                {/*<div className={styles.doughnutWrapper}>
                  <div className={styles.chartWrapper}>
                    <Doughnut
                      data={data}
                      height={100}
                      width={100}
                      options={options}
                    />
                  </div>
                  <div className={styles.doughnutLablesWrapper}>
                    <ul>
                      {donutLabels()}
                    </ul>
                  </div>
                  <i>Antal annonser där kompetensen efterfrågas</i>
                </div>*/}
                <List items={top5} component={CompetenceListItem} />
              </div>
            }
            <span
              className={styles.amount}
              ref={(r) => summaryHeaders.push({ el: r, text: 'Alla efterfrågade kompetenserna' })}
            >
              {/*Alla efterfrågade kompetenser {this.createSearchSummary()}*/}
              {this.props.competences.length > 10 ? 'Efterfrågas också' : 'Efterfrågas för din sökning'}
            </span>
            <List items={competencesFiltered} component={CompetenceListItem} />
          </div>
        }
        {!this.props.competences.length &&
          <div className={styles.matchDescription}>
            <p>Inga kompetenser efterfrågas för denna sökning</p>
          </div>
        }
      </div>
    );
  }

  criteriaSelection() {
    const renderKnownCompetences = () => {
      const content = [];
      let counter = 0;
      this.props.competences.forEach((comp, index) => {
        if (this.props.knownCompetences.includes(comp.varde)) {
          if (this.state.showAllCompetences || counter <= 4) {
            counter += 1;
            content.push(
              <div
                className={styles.tag}
                key={`competence-${index}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className={styles.tagText}>
                  {comp.efterfragat}
                </span>
              </div>
            );
          }
        }
      });

      if (!this.state.showAllCompetences && content.length > 4) {
        content.push(<span className={styles.showAll} onClick={this.onShowAllCompetences.bind(this)}>Visa alla...</span>);
      }

      return content;
    };

    const renderKnownExperiences = () => {
      const content = [];

      this.props.experiences.forEach((exp, index) => {
        let hasExperience = false;
        let years;
        this.props.knownExperiences.forEach((item) => {
          switch(item.get('years')) {
            case 1:
              years = '0-1 år';
              break;
            case 2:
              years = '1-2 år';
              break;
            case 3:
              years = '2-4 år';
              break;
            case 4:
              years = '+4 år';
              break;
          }
          if (item.get('id') === exp.varde) {
            content.push(
              <div
                className={styles.tag}
                key={`experience-${index}`}
                onClick={(e) => e.stopPropagation()}
              >
                <span className={styles.tagText}>
                  {exp.efterfragat} ({years})
                </span>
              </div>
            );
          }
        });
      });

      return content;
    };

    const renderKnownDriversLicenses = () => {
      const content = [];
      this.props.driverLicenses.forEach((dl, index) => {
        if (this.props.knownDriversLicenses.includes(dl.varde)) {
          content.push(
            <div
              className={styles.tag}
              key={`drivers-license-${index}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className={styles.tagText}>
                {dl.efterfragat}
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
        <div className={styles.searchFormSticky}>
          <span
            className={styles.cancel}
            onClick={this.cancelMatchCriteriaPopover.bind(this, !!renderKnownCompetences().length)}
          >Avbryt</span>
          {/*<h1>Matchningskriterier</h1>*/}
          <div className={styles.matchCriteriaSearchSummary}>
            <div className={styles.matchCriteriaSearchSummaryText}>
              <span>Matchningskriterier</span>
              {/*<span>{this.createSearchInput(this.props.occupations, [])}</span>*/}
              <span className={styles.small}>{this.createSearchInput(this.props.occupations, [])}</span>
              {/*<span className={styles.small}>{locations}</span>*/}
            </div>
          </div>
        </div>

        <div className={styles.matchDescription}>
          <p>Ange vad du kan för att se jobben som passar dig bäst</p>
        </div>

        <div
          className={styles.criteraWrappper}
          onClick={!this.state.showCompetenceCriteriaContent && this.toggleCompetenceCriteriaContent.bind(this)}
        >
          <header className={styles.criteriaSelectionHeader}>
            Kompetenser
            {/*<span className={styles.pencilIcon + ' glyphicon glyphicon-pencil'} />*/}
            <span className={styles.pencilIcon + ' glyphicon glyphicon-chevron-right'}></span>
          </header>
          {this.state.showCompetenceCriteriaContent &&
            <section className={styles.criteriaSelectionView}>
              {this.competenceSelection()}
            </section>
          }

          {!this.state.showCompetenceCriteriaContent && !!renderKnownCompetences().length &&
            <section className={styles.criteriaSelectionContent}>
              {renderKnownCompetences()}
            </section>
          }
        </div>
        <div
          className={styles.criteraWrappper}
          onClick={!this.state.showExperienceCriteriaContent && this.toggleExperienceCriteriaContent.bind(this)}
        >
          <header className={styles.criteriaSelectionHeader}>
            Arbetslivserfarenheter
            {/*<span className={styles.pencilIcon + ' glyphicon glyphicon-pencil'} />*/}
            <span className={styles.pencilIcon + ' glyphicon glyphicon-chevron-right'}></span>
          </header>
          {this.state.showExperienceCriteriaContent &&
            <section className={styles.criteriaSelectionView}>
              {this.experienceSelection()}
            </section>
          }

          {!this.state.showExperienceCriteriaContent && !!renderKnownExperiences().length &&
            <section className={styles.criteriaSelectionContent}>
              {renderKnownExperiences()}
            </section>
          }
        </div>
        <div
          className={styles.criteraWrappper}
          onClick={!this.state.showDriversLicenseCriteriaContent && this.toggleDriversLicenseCriteriaContent.bind(this)}
        >
          <header className={styles.criteriaSelectionHeader}>
            Körkort
            {/*<span className={styles.pencilIcon + ' glyphicon glyphicon-pencil'} />*/}
            <span className={styles.pencilIcon + ' glyphicon glyphicon-chevron-right'}></span>
          </header>
          {this.state.showDriversLicenseCriteriaContent &&
            <section className={styles.criteriaSelectionView}>
              {this.driversLicenseSelection()}
            </section>
          }

          {!this.state.showDriversLicenseCriteriaContent && !!renderKnownDriversLicenses().length &&
            <section className={styles.criteriaSelectionContent}>
              {renderKnownDriversLicenses()}
            </section>
          }
        </div>
      </div>
    );
  }

  onShowAllCompetences(e) {
    e.stopPropagation();
    this.setState({
      showAllCompetences: true,
    });
  }

  toggleCompetenceCriteriaContent() {
    this.setState({
      showCompetenceCriteriaContent: !this.state.showCompetenceCriteriaContent,
    });
  }

  toggleExperienceCriteriaContent() {
    const { showExperienceCriteriaContent, animationDuration } = this.state;
    this.setState({
      showExperienceCriteriaContent: !showExperienceCriteriaContent,
      animationDuration: (!showExperienceCriteriaContent || animationDuration) ? false : 1,
      showAllCompetences: false,
    });
  }

  toggleDriversLicenseCriteriaContent() {
    this.setState({
      showDriversLicenseCriteriaContent: !this.state.showDriversLicenseCriteriaContent,
      showAllCompetences: false,
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
      tab,
      showCompetenceCriteriaContent: false,
      showExperienceCriteriaContent: false,
      showAllCompetences: false,
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
          {!!matchingJobs &&
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

  experienceSelection() {
    const dataSet = [0, 0, 0, 0];
    const expArr = [];
    const top5Arr = [];
    const self = this;
    this.props.jobs.forEach(job => {
      job.matchningsresultat.efterfragat.forEach(merit => {
        if (merit.typ === 'YRKE') dataSet[merit.niva.varde - 2] += 1;
      });
    });
    const top5Comps = _.orderBy(JSON.parse(JSON.stringify(this.props.experiences)), 'timesRequested', 'desc').slice(0, 3);
    const top5 = top5Comps.map((exp, index) => {
      if (this.props.experiences.length > 5) {
        top5Arr.push(exp.varde);
        return (
          <ExperienceSelector
            key={'experience-selector-' + index}
            item={exp}
          />
        );
      }
    });
    const experiences = this.props.experiences.map((exp, index) => {
      if (!top5Arr.includes(exp.varde)) {
        return (
          <ExperienceSelector
            key={'experience-selector-' + index}
            item={exp}
          />
        );
      }
    });

    const data = {
      labels: ['0-1 år', '1-2 år', '2-4 år', '+4 år'],
      datasets: [{
        data: dataSet,
        backgroundColor: '#69B8E3',
        borderWidth: 0,
      }]
    };

    const opt = {
      scales: {
        xAxes: [{
          // display: false
        }],
        yAxes: [{
          display: false
        }],
      },
      events: false,
      tooltips: {
        enabled: false
      },
      legend: {
        display: false,
      },
      hover: {
        animationDuration: 0
      },
      animation: {
        duration: this.state.animationDuration || 700,
        onComplete: function () {
          const ctx = this.chart.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          this.data.datasets.forEach(function (dataset) {
            for (var i = 0; i < dataset.data.length; i++) {
              var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                scale_max = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
              ctx.fillStyle = '#69B8E3';
              var y_pos = model.y - 5;
              // Make sure data value does not get overflown and hidden
              // when the bar's value is too close to max value of scale
              // Note: The y value is reverse, it counts from top down
              if ((scale_max - model.y) / scale_max >= 0.85) {
                ctx.fillStyle = '#FAFAFA';
                y_pos = model.y + 20;
              }
              ctx.fillText(dataset.data[i] + ' jobb', model.x, y_pos);
            }
          });
          self.setState({animationDuration: 1})
        }
      }
    };

    return (
      <div>
        <div className={styles.searchFormSticky}>
          <span
            className={styles.cancel}
            onClick={this.toggleExperienceCriteriaContent.bind(this)}
          >Avbryt</span>
          <span
            className={styles.done}
            onClick={this.toggleExperienceCriteriaContent.bind(this)}
          >Klar</span>
          <h1>Välj arbetslivserfarenheter</h1>
        </div>
        <div className={styles.experienceSelectionWrapper}>
        {!!this.props.experiences.length &&
          <div>
            {/*<div className={styles.barChartWrapper}>
              <Bar
                data={data}
                options={opt}
              />
            </div>*/}
            {(experiences.length > 5) &&
              <div>
                <span className={styles.amount}>Mest efterfrågade</span>
                {top5}
              </div>
            }
            <span className={styles.amount}>
              {(experiences.length > 5) ? 'Efterfrågas också' : 'Efterfrågas för din sökning'}
            </span>
            {experiences}
          </div>
        }
        {!this.props.experiences.length &&
          <div className={styles.matchDescription}>
            <p>Inga arbetslivserfarenheter efterfågas för denna sökning</p>
          </div>
        }
        </div>
      </div>
    )
  }

  driversLicenseSelection() {
    const licenses = [];
    this.props.driverLicenses.forEach((dl, index) => {
      switch (dl.efterfragat) {
        case 'AM':
        case 'A1':
        case 'A2':
        case 'A':
          dl.categoryNr = 1;
          dl.category = 'Moped, motorcykel och traktor';
          break;
        case 'B':
        case 'Utökad B':
        case 'BE':
          dl.categoryNr = 2;
          dl.category = 'Personbil';
          break;
        case 'C':
        case 'C1':
        case 'C1E':
        case 'CE':
          dl.categoryNr = 3;
          dl.category = 'Lastbil';
          break;
        case 'D':
        case 'D1':
        case 'D1E':
        case 'DE':
          dl.categoryNr = 4;
          dl.category = 'Buss';
          break;
      }
      licenses.push(dl);
    });

    const sortedLicenses = _.orderBy(licenses, ['categoryNr'], ['asc']);

    return (
      <div>
        <div className={styles.searchFormSticky}>
          <span
            className={styles.cancel}
            onClick={this.toggleDriversLicenseCriteriaContent.bind(this)}
          >Avbryt</span>
          <span
            className={styles.done}
            onClick={this.toggleDriversLicenseCriteriaContent.bind(this)}
          >Klar</span>
          <h1>Välj körkort</h1>
        </div>

        <div>
          {
            !!this.props.driverLicenses.length ?
            <div>
              <span className={styles.amount}>
                Efterfrågade körkort för din sökning
              </span>
              <List items={sortedLicenses} component={DriversLicenseListItem} />
            </div> :
            <div className={styles.matchDescription}>
              <p>Inga körkort efterfågas för denna sökning</p>
            </div>
          }
        </div>
      </div>
    );
  }

  showMatchingJobs() {
    this.setState({
      showMatchingJobs: true,
      showCompetenceCriteriaContent: false,
      showExperienceCriteriaContent: false,
      showDriversLicenseCriteriaContent: false,
      showAllCompetences: false,
    });
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

  onAdvertClick(link) {
    this.props.setUiState({
      showMatchingJobs: this.state.showMatchingJobs,
      tab: this.props.currentTab,
      scrollPosition: this.additionalJobsEl ? this.additionalJobsEl.scrollTop : document.body.scrollTop,
      showNonMatchningJobs: this.props.showNonMatchningJobs,
    });

    this.openRoute(link);
  }

  setTabState(tabState) {
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

      if (effect === 'instant') {
        setTimeout(() => {
          window.scrollTo(0, position);
          window.$(this.additionalJobsEl).scrollTo(position);
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

    window.$('body').removeClass('modal-open');
    this.scrollTo(99999);
  }

  addToSearch() {
    window.$('body').removeClass('modal-open');
    this.setState({ showStickyHeader: false });
    this.props.onSubmitForm();
  }

  render() {
    // console.log(this.props.knownExperiences.toJS());
    // console.log(this.props.driverLicenses);
    // console.log(this.props.additionalAds);

    const {
      occupations: ogOccupations,
      locations: ogLocations,
    } = this.state.originalSearchParams;
    let mainContent = null;
    let matchingContent = null;
    summaryHeaders = [];
    const additionalAds = this.props.additionalSearchParameters.map((param, index) => {
      const isLocation = param.typ === 'KOMMUN';
      const searchSummary = isLocation ? this.createSearchSummary(null, [param]) : this.createSearchSummary([param]);
      const inputSummary = isLocation ? this.createSearchInput(null, [param]) : this.createSearchInput([param]);
      const toAdd = isLocation ? this.createSearchInput([], [param]) : this.createSearchInput([param], []);

      let occupations = !isLocation ? this.createSearchSummary([param], []) : this.createSearchSummary(this.props.occupations, []);
      occupations = occupations.split('för ')[1];
      let locations = isLocation ? this.createSearchInput([], [param]) : this.createSearchInput([], this.props.locations);
      locations = locations === 'Alla jobb i Platsbanken' ? 'Hela Sverige' : locations;

      window.$('body').addClass('modal-open');

      return (
        <div
          className={styles.additionalJobs}
          key={'additional-ads-' + index}
          ref={(div) => { this.additionalJobsEl = div; }}
        >
          <div>
            <div className={styles.searchFormSticky}>
              <span
                className={styles.cancel}
                onClick={this.removeAdditionalSearchParams.bind(this, param, index)}
              >Avbryt</span>
              {/*<span
                className={styles.done}
                onClick={this.addToSearch.bind(this)}
              >Lägg till</span>*/}
              <div className={styles.matchCriteriaSearchSummary}>
                <div className={styles.matchCriteriaSearchSummaryText}>
                  <span>{occupations}</span>
                  <span className={styles.small}>{locations}</span>
                </div>
              </div>
            </div>

            <div className={styles.additionalAmountWrapper}>
              <span
                className={styles.amount}
                ref={(r) => summaryHeaders.push({ el: r, text: inputSummary })}
              >
                Hittade {this.props.additionalAds.get(index) ? this.props.additionalAds.get(index).amount : '...'} jobb {/*searchSummary*/}
                <div className={styles.addToSearchTag} onClick={this.addToSearch.bind(this)}>
                  <span className='glyphicon glyphicon-plus' />
                  Lägg till i min sökning
                </div>
              </span>
              {/*<span
                className={styles.rightPart + ' glyphicon glyphicon-remove-circle'}
                onClick={this.removeAdditionalSearchParams.bind(this, param, index)}
              />*/}
            </div>
            {!this.props.additionalAds.get(index) ?
              <List component={LoadingIndicator} /> :
              <List items={this.props.additionalAds.get(index).jobs.slice(0, 50)} component={JobListItem} click={this.onAdvertClick} />
            }
          </div>
          {/*<div
            className={styles.addToSearchButton + ' btn btn-default'}
            onClick={this.addToSearch.bind(this)}
          >
            Lägg till {toAdd} i min sökning
          </div>*/}
        </div>
      );
    });

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);
      matchingContent = (<List component={LoadingIndicator} />);

    } else if (this.props.error !== false) {
      const ErrorComponent = () => (
        <ListItem item={'Something went wrong, please try again!'} />
      );
      mainContent = (<List component={ErrorComponent} />);

    } else if (!this.props.jobs.length) {
      mainContent = (
        <div>
          {!this.props.additionalAds.size &&
            <SadFace
              summary={this.createSearchSummary()}
            />
          }
          {additionalAds}
          <RutTips
            summary={this.createSearchSummary()}
            occupationSummary={this.createSearchSummary(this.props.occupations, [])}
            locationSummary={this.createSearchSummary([], this.props.locations)}
            shouldShowSadFace={!this.props.amount}
            shouldShowOccupationTips={this.shouldShowOccupationTips()}
            shouldShowLocationTips={this.shouldShowLocationTips()}
          />
        </div>
      );

    } else if (this.props.jobs !== false) {
      mainContent = (
        <div>
          <span
            ref={(r) => summaryHeaders.push({ el: r, text: this.createSearchInput(ogOccupations, ogLocations) })}
            className={styles.amount}
          >
            Hittade {this.props.amount} jobb {/*this.createSearchSummary()*/}
          </span>
          <List items={this.props.jobs.slice(0, 50)} component={JobListItem} click={this.onAdvertClick} />
          {additionalAds}
          <RutTips
            summary={this.createSearchSummary()}
            occupationSummary={this.createSearchSummary(this.props.occupations, [])}
            locationSummary={this.createSearchSummary([], this.props.locations)}
            shouldShowSadFace={!this.props.amount}
            shouldShowOccupationTips={this.shouldShowOccupationTips()}
            shouldShowLocationTips={this.shouldShowLocationTips()}
          />
        </div>
      );

      if (this.props.hasMatchningJobs) {
        matchingContent = (
          <div className={styles.listWrapperMatchingContent}>
            <div className={styles.myCompetences} onClick={this.hideMatchingJobs.bind(this)}>
              Matchningskriterier {/*({this.props.knownCompetences.size})*/}
              <span className={styles.right + ' glyphicon glyphicon-chevron-right'}></span>
            </div>
            <span
              className={styles.amount}
              ref={(r) => summaryHeaders.push({ el: r, text: 'Jobb som matchar dig' })}
            >
              {this.props.matchingJobs.length} jobb matchar dig
            </span>
            <List
              items={this.props.matchingJobs.slice(0, 50)}
              component={JobListItem}
              click={this.onAdvertClick}
              options={{view: 'matching'}}
            />
            { /*!this.props.showNonMatchningJobs ?
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
                <List items={this.props.nonMatchingJobs.slice(0, 50)} component={JobListItem} click={this.onAdvertClick} />
              </div>*/
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
            <span className={styles.stickyHeaderText}>{this.state.stickyHeaderText}</span>
            {/*<span className={styles.toTopArrow}>⬆</span>*/}
            <span className={styles.toTopArrow + ' glyphicon glyphicon-arrow-up'} />
          </div>
        }
        <div className={styles.contentWrapper}>
          <section className={styles.textSection}>
            <div className={styles.searchForm}>
              <Tappable onTap={this.openHomePage}>
                <span className={styles.cancel + ' glyphicon glyphicon-chevron-left'} />
                <span className={styles.cancelText}>Mina sökningar</span>
              </Tappable>

              {/*<h1>Resultat</h1>*/}
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
                    Ändra
                    {/*<span className={styles.filterIcon + " glyphicon glyphicon-tasks"} />*/}
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
                { this.props.hasMatchningJobs && !this.props.loading &&
                  ` (${this.props.matchingJobs.length})`
                }
              </button>
            </div>
            { this.props.currentTab === 'all' &&
                mainContent
            }
            { this.props.currentTab === 'match' &&
              (this.state.showMatchingJobs ?
                matchingContent :
                this.createCompetencesCloud(this.props.matchingJobs.length)
              )
            }
          </section>
        </div>
        <IosMenu
          changeRoute={this.props.changeRoute}
        />
        {this.state.showSaveSearchPopup &&
          <div className={styles.overlay}>
            <div className={styles.saveSearchPopup}>
              <p className={styles.popupText}>
                {/*<span className={styles.bell + ' glyphicon glyphicon-bell'} />*/}
                {/*Din sökning är sparad. Vill du få notiser när nya jobb dyker upp {this.createSearchSummary() || 'denna sökning'}?*/}
                Din sökning är sparad. Vill du få notiser när nya jobb dyker upp för denna sökning?
              </p>
              <div
                className={styles.leftConfirmButton}
                onClick={this.onSaveConfirm.bind(this, true)}
              >
                <span className={styles.bell + ' glyphicon glyphicon-bell'} />
                Ja
              </div>
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
    onRemoveOccupation: (index, shouldReload) => dispatch(removeOccupation(index, shouldReload)),
    onRemoveLocation: (index, shouldReload) => dispatch(removeLocation(index, shouldReload)),
    onRemoveAdditionalJob: (index) => dispatch(removeAdditionalJob(index)),
    setUiState: (state) => dispatch(setUiState(state)),
    changeRoute: (url) => dispatch(push(url)),
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
  matchingJobs: selectMatchingJobs(),
  nonMatchingJobs: selectNonMatchingJobs(),
  hasMatchningJobs: selectHasMatchningJobs(),
  amount: selectAmount(),
  related: selectRelated(),
  uiState: selectUiState(),
  currentTab: selectCurrentTab(),
  showMatchingJobs: selectShowMatchingJobs(),
  scrollPosition: selectScrollPosition(),
  showNonMatchningJobs: selectShowNonMatchningJobs(),
  competences: selectCompetences(),
  experiences: selectExperiences(),
  driverLicenses: selectDriverLicenses(),
  knownCompetences: selectKnownCompetences(),
  knownExperiences: selectKnownExperiences(),
  knownDriversLicenses: selectKnownDriversLicenses(),
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