/*
 * AddOccupation
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import {GoogleMapLoader, GoogleMap, Marker} from "react-google-maps";
import AnimateOnChange from 'react-animate-on-change';
import _ from 'lodash';
import matching from 'utils/matching';

import {
  selectId,
  selectAdvert,
} from './selectors';

import {
  selectKnownCompetences,
  selectKnownExperiences,
  selectKnownDriversLicenses,
  selectSavedAdverts,
} from 'containers/App/selectors';

import {
  setCompetence,
  removeCompetence,
  setDriversLicense,
  removeDriversLicense,
  saveAdvert,
  removeAdvert,
  setAppState,
} from 'containers/App/actions';

import {
  loadAdvert,
  advertLoaded
} from './actions';

import LoadingIndicator from 'components/LoadingIndicator';
import IosMenu from 'components/IosMenu';
import Circle from 'components/Circle';
// import RepoListItem from 'containers/RepoListItem';
// import OccupationListItem from 'components/OccupationListItem';
// import Button from 'components/Button';
// import H2 from 'components/H2';
// import List from 'components/List';
// import ListItem from 'components/ListItem';
// import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';
import gradient from './gradient.png';

function SimpleMap (props) {
  return (
    <section
      style={{
        height: '270px',
        width: 'calc(100% + 31px)',
        marginLeft: '-15px',
        marginTop: '20px',
      }}
    >
      <GoogleMapLoader
        containerElement={
          <div
            style={{
              height: '100%',
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => '' }
            defaultZoom={12}
            options={{
              mapTypeControl: false,
              zoomControl: false,
              scaleControl: false,
              streetViewControl: false,
              draggable: false,
              disableDoubleClickZoom: true,
            }}
            defaultCenter={{
              lat: props.markers[0].position.lat,
              lng: props.markers[0].position.lng,
            }}
          >
            {props.markers.map((marker, index) => {
              return (
                <Marker
                  {...marker}
                  key={'marker-' + index}
                />
              );
            })}
          </GoogleMap>
        }
      />
    </section>
  );
}

export class JobAdvert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      folded: false,
      ad: false,
      isMatch: false,
      starHasChanged: false,
    };
  }

  componentDidMount() {
    this.props.setAppState({ searches: '/advert/' + this.props.params.id });

    window.$('body').removeClass('modal-open');
    this.props.onLoadAdvert(this.props.params.id);

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.advert) {
      const {
        knownCompetences,
        knownExperiences,
        knownDriversLicenses,
      } = nextProps;
      const [all, match] = matching(
          [nextProps.advert], knownCompetences, knownExperiences, knownDriversLicenses
        );
      this.setState({
        ad: all[0],
        isMatch: !!match.length,
      });
    }
  }

  openRoute = (route) => {
    setTimeout(() => {
      this.props.changeRoute(route);
    }, 1);
  };

  goBack = () => {
    const { pathname } = window.location;
    if (pathname.indexOf('saved') !== -1) {
      this.openRoute('/saved');
    } else {
      this.openRoute('/list');
    }
  };

  cleanLevel(level) {
    if (level) {
      // console.log(level);
      return level.efterfragat
        .replace('Mindre än 1 års erfarenhet', '0-1 år')
        .replace('1-2 års erfarenhet', '1-2 år')
        .replace('2-4 års erfarenhet', '2-4 år')
        .replace('5 års erfarenhet eller mer', '+5 år');
    } else {
      return '';
    }
  }

  typeOfLicense(efterfragat) {
    let type;
    switch (efterfragat) {
      case 'AM': case 'A1': case 'A2': case 'A':
        type = 'Moped, motorcykel och traktor';
        break;
      case 'B': case 'Utökad B': case 'BE':
        type = 'Personbil';
        break;
      case 'C': case 'C1': case 'C1E': case 'CE':
        type = 'Lastbil';
        break;
      case 'D': case 'D1': case 'D1E': case 'DE':
        type = 'Buss';
      default:
        type = '';
    }
    return type;
  }

  createCompetences() {

    if (this.state.ad.matchningsresultat.efterfragat.length) {
      const ad = this.state.ad;
      const content = [];
      const isMatch = ad.isMatch;
      const allCriteria = [...ad.matchingCriteria, ...ad.notMatchingCriteria];
      const knownCriteria = ad.matchingCriteria;
      const unknownCriteria = ad.notMatchingCriteria;
      const competences = _.orderBy(_.filter(allCriteria, { typ: 'KOMPETENS' }), 'efterfragat', 'asc');
      // const competences = _.filter(allCriteria, { typ: 'KOMPETENS' }).sort((a, b) => {
      //   return a.efterfragat.length - b.efterfragat.length;
      // });
      const experiences = _.filter(allCriteria, { typ: 'YRKE' });
      const driversLicenses = _.orderBy(_.filter(allCriteria, { typ: 'KORKORT' }), 'efterfragat', 'asc');
      // const driversLicenses = _.filter(allCriteria, { typ: 'KORKORT' });
      // const driversLicenses = _.filter(allCriteria, { typ: 'KORKORT' }).sort((a, b) => {
      //   return a.varde - b.varde;
      // });

      if (competences.length) {
        // console.log(competences);
        const known = _.filter(competences, { isKnown: true });
        const unknown = _.filter(competences, { isKnown: false });
        const requirement = _.filter(competences, { efterfragatKravniva: 'SKALLKRAV' });
        const merit = _.filter(competences, { efterfragatKravniva: 'MERITERANDE' });
        content.push(<b className={styles.criteriaHeading}>Kompetenser</b>);

        // competences.forEach((comp) => {
        //   const req = comp.efterfragatKravniva.toLowerCase()[0];
          // content.push(
          //   <span
          //     className={comp.isKnown ? styles.competenceMatch : styles.competence}
          //     onClick={this.onCompetenceClick.bind(this, comp)}
          //   >
          //     {comp.isKnown ?
          //       <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
          //       <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
          //     }
          //     {comp.efterfragat} <span className={styles.small}>({(req === 's') ? 'k' : req})</span>
          //   </span>
          // );
        // });

        if (requirement.length) {
          content.push(<span className={styles.criteriaSubHeading}>Krav</span>);
          requirement.forEach((comp) => {
            const req = comp.efterfragatKravniva.toLowerCase()[0];
            content.push(
              <span
                className={styles.comp}
                // className={comp.isKnown ? styles.competenceMatch : styles.competence}
                // onClick={this.onCompetenceClick.bind(this, comp)}
              >
                {/*comp.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
                */}
                {comp.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.dotIcon}>•</span>
                }
                {comp.efterfragat} {/*<span className={styles.small}>({(req === 's') ? 'k' : req})</span>*/}
              </span>
            );
          });
        }
        if (merit.length) {
          // content.push(<span className={styles.criteriaSubHeading}>Vi efterfågar{known.length ? ' också' : ''}:</span>);
          content.push(<span className={styles.criteriaSubHeading}>Meriterande</span>);
          merit.forEach((comp) => {
            const req = comp.efterfragatKravniva.toLowerCase()[0];
            content.push(
              <span
                className={styles.comp}
                // className={comp.isKnown ? styles.competenceMatch : styles.competence}
                // onClick={this.onCompetenceClick.bind(this, comp)}
              >
                {/*comp.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
                */}
                {comp.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.dotIcon}>•</span>
                }
                {comp.efterfragat} {/*<span className={styles.small}>({(req === 's') ? 'k' : req})</span>*/}
              </span>
            );
          });
        }
      }

      if (experiences.length) {
        const known = _.filter(experiences, { isKnown: true });
        const unknown = _.filter(experiences, { isKnown: false });
        const requirement = _.filter(experiences, { efterfragatKravniva: 'SKALLKRAV' });
        const merit = _.filter(experiences, { efterfragatKravniva: 'MERITERANDE' });
        content.push(<b className={styles.criteriaHeading}>Arbetslivserfarenheter</b>);
        if (requirement.length) {
          content.push(<span className={styles.criteriaSubHeading}>Krav</span>);
          requirement.forEach((exp) => {
            const req = exp.efterfragatKravniva.toLowerCase()[0];
            content.push(
              // <span className={exp.isKnown ? styles.competenceMatch : styles.competence}>
              <span className={styles.comp}>
                {exp.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.dotIcon}>•</span>

                }
                {`${this.cleanLevel(exp.niva)} ${exp.efterfragat}`}
              </span>
            );
            // content.push(
            //   <span className={styles.competenceMatch}>
            //     <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
            //     {`${this.cleanLevel(exp.niva)} ${exp.efterfragat}`} {/*<span className={styles.small}>({(req === 's') ? 'k' : req})</span>*/}
            //   </span>
            // );
          });
        }
        if (merit.length) {
          content.push(<span className={styles.criteriaSubHeading}>Meriterande</span>);
          merit.forEach((exp) => {
            const req = exp.efterfragatKravniva.toLowerCase()[0];
            content.push(
              // <span className={exp.isKnown ? styles.competenceMatch : styles.competence}>
              <span className={styles.comp}>
                {exp.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.dotIcon}>•</span>

                }
                {`${this.cleanLevel(exp.niva)} ${exp.efterfragat}`}
              </span>
            );
          });
        }
      }

      if (driversLicenses.length) {
        const known = _.filter(driversLicenses, { isKnown: true });
        const unknown = _.filter(driversLicenses, { isKnown: false });
        const requirement = _.filter(driversLicenses, { efterfragatKravniva: 'SKALLKRAV' });
        const merit = [
          ..._.filter(driversLicenses, { efterfragatKravniva: 'OKAND' }),
          ..._.filter(driversLicenses, { efterfragatKravniva: 'MERITERANDE' })
        ];
        content.push(<b className={styles.criteriaHeading}>Körkort</b>);
        // driversLicenses.forEach((dl) => {
          // content.push(
          //   <span
          //    className={dl.isKnown ? styles.competenceMatch : styles.competence}
          //    onClick={this.onDriversLicenseClick.bind(this, dl)}
          //  >
          //   {dl.isKnown ?
          //     <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
          //     <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
          //   }
          //    {dl.efterfragat} <span className={styles.small}> - {this.typeOfLicense(dl.efterfragat).toLowerCase()}</span>
          //  </span>
          // );
        // });

        if (requirement.length) {
          content.push(<span className={styles.criteriaSubHeading}>Krav</span>);
          requirement.forEach((dl) => {
            const dlType = this.typeOfLicense(dl.efterfragat).toLowerCase();
            content.push(
              <span
                className={styles.comp}
                // className={comp.isKnown ? styles.competenceMatch : styles.competence}
                // onClick={this.onDriversLicenseClick.bind(this, comp)}
              >
                {/*comp.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
                */}
                {dl.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.dotIcon}>•</span>
                }
                {dl.efterfragat} <span className={styles.small}>{dlType ? ' - ' + dlType : ''}</span>
              </span>
            );
          });
        }
        if (merit.length) {
          content.push(<span className={styles.criteriaSubHeading}>Meriterande</span>);
          merit.forEach((dl) => {
            const dlType = this.typeOfLicense(dl.efterfragat).toLowerCase();
            content.push(
              <span
                className={styles.comp}
                // className={comp.isKnown ? styles.competenceMatch : styles.competence}
                // onClick={this.onDriversLicenseClick.bind(this, comp)}
              >
                {/*comp.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
                */}
                {dl.isKnown ?
                  <span className={styles.okIcon + ' glyphicon glyphicon-ok'} /> :
                  <span className={styles.dotIcon}>•</span>
                }
                {dl.efterfragat} <span className={styles.small}>{dlType ? ' - ' + dlType : ''}</span>
              </span>
            );
          });
        }
      }

      // content.push(
      //   <Circle
      //     known={knownCriteria.length}
      //     total={allCriteria.length}
      //     showText={false}
      //     style={{top: '56px'}}
      //     isMatch={isMatch}
      //   />
      // );

      return content;
    }
  }

  onCompetenceClick(item) {
    // console.log(item);
    if (!this.props.knownCompetences.includes(item.varde)) {
      this.props.onSetCompetence(item.varde);
    } else {
      this.props.onRemoveCompetence(item.varde);
    }
  }

  onDriversLicenseClick(item) {
    if (!this.props.knownDriversLicenses.includes(item.varde)) {
      this.props.onSetDriversLicenses(item.varde);
    } else {
      this.props.onRemoveDriversLicenses(item.varde);
    }
  }

  unFoldText(e) {
    // console.log(this.annonsText);
    // this.setState({ folded: false });
    // let className = e.target.className;
    this.annonsText.className = 'annons-text unfolded';
    this.showMore.className = 'hidden';
  }

  shouldShowMap(erbjudenArbetsplats) {
    // console.log(erbjudenArbetsplats);
    return erbjudenArbetsplats && erbjudenArbetsplats.geoPosition;
  }

  toggleSaveAd(item, isSaved) {
    if (!isSaved) {
      this.props.onSaveAdvert(item);
    } else {
      this.props.onRemoveAdvert(item.id);
    }
  }

  adText() {
    if (this.state.ad.annonstext) {
      return this.state.ad.annonstext;
    } else {
      return `${this.state.ad.beskrivningBehov} \n\n ${this.state.ad.beskrivningKrav}`;
    }
  }

  render() {
    const { erbjudenArbetsplats } = this.state.ad;
    const adIsSaved = !!this.props.savedAdverts.filter(saved => {
      return saved.id === this.state.ad.id;
    }).size;
    let markers;
    // this.setState({starHasChanged: !!adIsSaved});

    // console.log(erbjudenArbetsplats);
    if (this.shouldShowMap(erbjudenArbetsplats)) {
      const { latitud, longitud } = erbjudenArbetsplats.geoPosition;
      markers = [{
        position: {
          lat: latitud > longitud ? latitud : longitud,
          lng: latitud < longitud ? latitud : longitud,
        }
      }];
    }
    let kommun = '';
    if (this.state.ad) {
      kommun = this.state.ad.erbjudenArbetsplats.kommun.namn;
    }

    return (
      <article>
        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <span
              className={styles.cancelChevron + ' iosIcon'}
              onClick={this.goBack}
            ></span>
            <span
              className={styles.done}
              onClick={this.toggleSaveAd.bind(this, this.state.ad, adIsSaved)}
            >
              {adIsSaved ? 'Sparad' : 'Spara'}
            </span>
            <h1>Annons</h1>
          </header>

          {this.state.ad &&
            <div className={styles.advertWrapper}>
              {/*<AnimateOnChange
                  baseClassName={styles.starAnimate}
                  animationClassName={styles.starAnimateBouceDisable}
                  animate={adIsSaved}
                >
                  <div
                    className={adIsSaved ? styles.savedAdvert : styles.saveAdvert}
                    onClick={this.toggleSaveAd.bind(this, this.state.ad, adIsSaved)}
                  >
                    <span className={`${styles.saveIcon} glyphicon ${adIsSaved ? 'glyphicon-star' : 'glyphicon-star-empty'}`} />
                  </div>
                </AnimateOnChange>*/}
              {/*<object
                style={{maxHeight: '60px'}}
                data={`http://api.arbetsformedlingen.se/platsannons/${this.state.ad.id}/logotyp`} type="image/gif"
              >
              </object> <br />*/}
              <b className={styles.companyName}>{this.state.ad.arbetsgivarenamn}, {kommun}</b>
              <h3 className={styles.adTitle}>{this.state.ad.rubrik}</h3>
              <div className={styles.adInfo}>
                <p className={styles.adOccupation}><b>Yrkesroll:</b> {this.state.ad.yrkesroll.namn}</p>
                <p className={styles.adPublicated}><b>Publicerad:</b> {this.state.ad.sistaPubliceringsdatum}</p>
                <p className={styles.adForm}><b>Anställningsform:</b> {this.state.ad.varaktighet.namn}</p>
                <p className={styles.adSalary}><b>Lön:</b> {this.state.ad.lonetyp}</p>
                <p className={styles.adPositions}><b>Antal platser:</b> {'...'}</p>
              </div>
              {(!!this.state.ad.matchingCriteria.length || !!this.state.ad.notMatchingCriteria.length) &&
                <div>
                  <div className={styles.matchCriteria}>
                    <span>Matchningskriterier</span>
                  </div>

                  <div className={styles.competenceWrapper}>
                    {/*<ul className={styles.criteriaTabs}>
                      <li className={styles.criteriaTab}>Allt efterfrågat</li>
                      <li className={styles.criteriaTab}>Krav</li>
                      <li className={styles.criteriaTab}>Meriterande</li>
                    </ul>*/}
                    {this.createCompetences()}
                  </div>
                  {/*<span className={styles.reqDescription}>(k) = krav, (m) = meriterande</span>*/}
                </div>
              }
              <div className={styles.advertTextWrapper} onClick={this.unFoldText.bind(this)}>
                <p
                  dangerouslySetInnerHTML={{__html: this.adText()}}
                  className={"annons-text unfolded"}
                  ref={(p) => this.annonsText = p}
                />
                {/*<span
                  className={styles.showmore}
                  ref={(span) => this.showMore = span}
                >
                  Visa hela annonsen
                </span>*/}
              </div>


              {!!this.shouldShowMap(erbjudenArbetsplats) &&
                <div className={styles.map}>
                  <p className={styles.mapTitle}>Arbetsplats</p>
                  {/*<span className={styles.mapLocation}>{kommun}</span>*/}
                  <SimpleMap
                    markers={markers}
                  />
                  <span className={styles.mapAddress}><b>Adress:</b>{this.state.ad.besoksadressGatuadress}, {this.state.ad.postadressPostnummer} {this.state.ad.postadressPostort}</span>
                </div>
              }
              <div className={styles.adFooter}>
                <p className={styles.applyDescription}>Sök jobber senast</p>
                <p className={styles.applyDate}>{this.state.ad.sistaPubliceringsdatum}</p>
                {/*<span className={styles.adId}>ANNONS-ID: {this.state.ad.id}</span>*/}
              </div>
              <button
                className={styles.applyButton + ' btn btn-default'}
                onClick={() => alert('Går ej att ansöka i prototypen')}
              >
                Ansök
              </button>
              <img className={styles.gradientImg} src={gradient} />
            </div>
          }
          {!this.state.ad &&
            <div className={styles.loading}>
              <LoadingIndicator />
            </div>
          }
        </div>
        {/*<IosMenu
          changeRoute={this.props.changeRoute}
        />*/}
      </article>
    );
  }
}

JobAdvert.propTypes = {
  changeRoute: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  advert: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  onLoadAdvert: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onLoadAdvert: (id) => dispatch(loadAdvert(id)),
    changeRoute: (url) => dispatch(push(url)),
    onSetCompetence: (id) => dispatch(setCompetence(id)),
    onRemoveCompetence: (id) => dispatch(removeCompetence(id)),
    onSetDriversLicenses: (id) => dispatch(setDriversLicense(id)),
    onRemoveDriversLicenses: (id) => dispatch(removeDriversLicense(id)),
    onSaveAdvert: (ad) => dispatch(saveAdvert(ad)),
    onRemoveAdvert: (id) => dispatch(removeAdvert(id)),
    setAppState: (state) => dispatch(setAppState(state)),
  };
}

const mapStateToProps = createStructuredSelector({
  advert: selectAdvert(),
  knownCompetences: selectKnownCompetences(),
  knownExperiences: selectKnownExperiences(),
  knownDriversLicenses: selectKnownDriversLicenses(),
  savedAdverts: selectSavedAdverts(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(JobAdvert);
