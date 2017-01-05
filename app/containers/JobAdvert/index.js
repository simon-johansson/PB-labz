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

function SimpleMap (props) {
  return (
    <section
      style={{
        height: '200px',
        width: '100%',
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
      folded: true,
      ad: false,
      isMatch: false,
    };
  }

  componentDidMount() {
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
      console.log(level);
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
      const competences = _.filter(allCriteria, { typ: 'KOMPETENS' });
      const experiences = _.filter(allCriteria, { typ: 'YRKE' });
      const driversLicenses = _.filter(allCriteria, { typ: 'KORKORT' });

      if (competences.length) {
        const known = _.filter(competences, { isKnown: true });
        const unknown = _.filter(competences, { isKnown: false });
        content.push(<b className={styles.criteriaHeading}>Kompetenser</b>);
        if (known.length) {
          // content.push(<span className={styles.criteriaSubHeading}>Du matchar med:</span>);
          known.forEach((comp) => {
            const req = comp.efterfragatKravniva.toLowerCase()[0];
            content.push(
              <span
                className={styles.competenceMatch}
                onClick={this.onCompetenceClick.bind(this, comp)}
              >
                <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
                {comp.efterfragat} <span className={styles.small}>({(req === 's') ? 'k' : req})</span>
              </span>
            );
          });
        }
        if (unknown.length) {
          // content.push(<span className={styles.criteriaSubHeading}>Vi efterfågar{known.length ? ' också' : ''}:</span>);
          unknown.forEach((comp) => {
            const req = comp.efterfragatKravniva.toLowerCase()[0];
            content.push(
              <span
                className={styles.competence}
                onClick={this.onCompetenceClick.bind(this, comp)}
              >
                <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
                {comp.efterfragat} <span className={styles.small}>({(req === 's') ? 'k' : req})</span>
              </span>
            );
          });
        }
      }

      if (experiences.length) {
        const known = _.filter(experiences, { isKnown: true });
        const unknown = _.filter(experiences, { isKnown: false });
        content.push(<b className={styles.criteriaHeading}>Arbetslivserfarenheter</b>);
        if (known.length) {
          // content.push(<span className={styles.criteriaSubHeading}>Du matchar med:</span>);
          known.forEach((exp) => {
            const req = exp.efterfragatKravniva.toLowerCase()[0];
            content.push(
              <span className={styles.competenceMatch}>
                <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
                {`${this.cleanLevel(exp.niva)} ${exp.efterfragat}`} <span className={styles.small}>({(req === 's') ? 'k' : req})</span>
              </span>
            );
          });
        }
        if (unknown.length) {
          // content.push(<span className={styles.criteriaSubHeading}>Vi efterfågar{known.length ? ' också' : ''}:</span>);
          unknown.forEach((exp) => {
            const req = exp.efterfragatKravniva.toLowerCase()[0];
            content.push(
              <span className={styles.competence}>
                {`${this.cleanLevel(exp.niva)} ${exp.efterfragat}`} <span className={styles.small}>({(req === 's') ? 'k' : req})</span>
              </span>
            );
          });
        }
      }

      if (driversLicenses.length) {
        const known = _.filter(driversLicenses, { isKnown: true });
        const unknown = _.filter(driversLicenses, { isKnown: false });
        content.push(<b className={styles.criteriaHeading}>Körkort</b>);
        if (known.length) {
          // content.push(<span className={styles.criteriaSubHeading}>Du matchar med:</span>);
          known.forEach((dl) => {
            content.push(
              <span
                className={styles.competenceMatch}
                onClick={this.onDriversLicenseClick.bind(this, dl)}
              >
                <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
                {dl.efterfragat} <span className={styles.small}> - {this.typeOfLicense(dl.efterfragat).toLowerCase()}</span>
              </span>
            );
          });
        }
        if (unknown.length) {
          // content.push(<span className={styles.criteriaSubHeading}>Vi efterfågar{known.length ? ' också' : ''}:</span>);
          unknown.forEach((dl) => {
            content.push(
              <span
                className={styles.competence}
                onClick={this.onDriversLicenseClick.bind(this, dl)}
              >
                <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
                {dl.efterfragat} <span className={styles.small}> - {this.typeOfLicense(dl.efterfragat).toLowerCase()}</span>
              </span>
            );
          });
        }
      }

      if (isMatch) {
        content.push(
          <Circle
            known={knownCriteria.length}
            total={allCriteria.length}
            showText={false}
            style={{right: '10px'}}
          />
        );
      }

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

  render() {
    const { erbjudenArbetsplats } = this.state.ad;
    const adIsSaved = !!this.props.savedAdverts.filter(saved => {
      return saved.id === this.state.ad.id;
    }).size;
    let markers;

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

    return (
      <article>
        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <span
              className={styles.back + ' glyphicon glyphicon-chevron-left'}
              onClick={this.goBack}
            />
            <h1>Annons</h1>
            {
              adIsSaved ?
              <span
                onClick={this.toggleSaveAd.bind(this, this.state.ad, adIsSaved)}
                className={styles.savedAdvert + ' glyphicon glyphicon-star'}
              /> :
              <span
                onClick={this.toggleSaveAd.bind(this, this.state.ad, adIsSaved)}
                className={styles.saveAdvert + ' glyphicon glyphicon-star-empty'}
              />
            }
          </header>

          {this.state.ad &&
            <div className={styles.advertWrapper}>
              {/*<object
                style={{maxHeight: '60px'}}
                data={`http://api.arbetsformedlingen.se/platsannons/${this.state.ad.id}/logotyp`} type="image/gif"
              >
              </object> <br />*/}
              <b>{this.state.ad.arbetsgivarenamn}</b>
              <h3>{this.state.ad.rubrik}</h3>
              <p>{this.state.ad.yrkesroll.namn}</p>

              {(!!this.state.ad.matchingCriteria.length || !!this.state.ad.notMatchingCriteria.length) &&
                <div>
                  <div className={styles.competenceWrapper}>
                    {/*<ul className={styles.criteriaTabs}>
                      <li className={styles.criteriaTab}>Allt efterfrågat</li>
                      <li className={styles.criteriaTab}>Krav</li>
                      <li className={styles.criteriaTab}>Meriterande</li>
                    </ul>*/}
                    {this.createCompetences()}
                  </div>
                  <span className={styles.reqDescription}>(k) = krav, (m) = meriterande</span>
                </div>
              }
              <div className={styles.advertTextWrapper} onClick={this.unFoldText.bind(this)}>
                <p
                  dangerouslySetInnerHTML={{__html: this.state.ad.annonstext}}
                  className={"annons-text folded"}
                  ref={(p) => this.annonsText = p}
                />
                <span
                  className={styles.showmore}
                  ref={(span) => this.showMore = span}
                >
                  Visa hela annonsen
                </span>
              </div>


              {!!this.shouldShowMap(erbjudenArbetsplats) &&
                <div className={styles.map}>
                  <p><b>Arbetsplats:</b> {this.state.ad.besoksadressGatuadress}</p>
                  <SimpleMap
                    markers={markers}
                  />
                </div>
              }
              <button
                className={styles.applyButton + ' btn btn-default'}
                onClick={() => alert('Går ej att ansöka i prototypen')}
              >
                Ansök
              </button>
            </div>
          }
          {!this.state.ad &&
            <div className={styles.loading}>
              <LoadingIndicator />
            </div>
          }
        </div>
        <IosMenu
          changeRoute={this.props.changeRoute}
        />
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
