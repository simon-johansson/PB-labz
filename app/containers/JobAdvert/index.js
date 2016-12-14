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

import {
  selectId,
  selectAdvert,
} from './selectors';

import {
  selectKnownCompetences,
  selectKnownExperiences,
} from 'containers/App/selectors';

import {
  setCompetence,
  removeCompetence,
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
    };
  }

  componentDidMount() {
    this.props.onLoadAdvert(this.props.params.id);

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1);
  }

  openRoute = (route) => {
    setTimeout(() => {
      this.props.changeRoute(route);
    }, 1);
  };

  openListPage = () => {
    this.openRoute('/list');
  };

  cleanLevel(level) {
    if (level) {
      return level.efterfragat.replace('Mindre än 1 års erfarenhet', 'Erfarenhet') + ' som ';
    } else {
      return '';
    }
  }

  createCompetences() {
    const isKnown = (k) => {
      if (k.typ === 'KOMPETENS') {
        return this.props.knownCompetences.includes(k.varde);
      }
      else if (k.typ === 'YRKE') {
        let hasExperience = false;
        this.props.knownExperiences.forEach((item) => {
          if (item.id === k.varde) {
            if ((item.years + 1) >= parseInt(k.niva.varde)) {
              hasExperience = true;
            }
          }
        });
        return hasExperience;
      } else {
        return undefined;
      }
    };
    if (this.props.advert.matchningsresultat.efterfragat.length) {
      const { efterfragat } = this.props.advert.matchningsresultat;
      const content = [];
      const competences = efterfragat.map((k) => {
        k.isKnown = isKnown(k);
        return k;
      });
      const allCompetences = competences.filter((k) => typeof k.isKnown !== 'undefined');
      const knownCompetences = _.filter(allCompetences, {isKnown: true});
      const unknownCompetences = _.filter(allCompetences, {isKnown: false});

      if (!this.props.params.matching) {
        return allCompetences.map((item, index) => {
          return (
            <div
              className={styles.wrapperDiv}
              key={'all-competences-' + index}
            >
              {item.typ === 'YRKE' &&
                <span className={styles.competence}>{`${this.cleanLevel(item.niva)} ${item.efterfragat}`}</span>
              }

              {item.typ === 'KOMPETENS' &&
                <span className={styles.competence}>{item.efterfragat}</span>
              }
              <br />
            </div>
          );
        });
      }

      // if (knownCompetences.length) content.push(<span className={styles.competenceHeader}>Du kan:</span>);
      knownCompetences.forEach((item, index) => {
        content.push(
          <div
            className={styles.wrapperDiv}
            onClick={this.onCompetenceClick.bind(this, item)}
            key={'known-competences-' + index}
          >
            {item.typ === 'YRKE' &&
              <span className={styles.competence}>
                <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
                {`${this.cleanLevel(item.niva)} ${item.efterfragat}`}
              </span>
            }

            {item.typ === 'KOMPETENS' &&
              <span className={styles.competence}>
                <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
                {item.efterfragat}
              </span>
            }
            <br />
          </div>
        );
      });

      // console.log(unknownCompetences);

      if (unknownCompetences.length && knownCompetences.length) {
        content.push(<span className={styles.competenceHeader}>Vi efterfrågar också:</span>);
      }
      unknownCompetences.forEach((item, index) => {
        content.push(
          <div
            className={styles.wrapperDiv}
            onClick={this.onCompetenceClick.bind(this, item)}
          >
            {item.typ === 'YRKE' &&
              <span className={styles.competence}>
                {`${this.cleanLevel(item.niva)} ${item.efterfragat}`}
              </span>
            }

            {item.typ === 'KOMPETENS' &&
              <span className={styles.competence}>
                <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
                {item.efterfragat}
              </span>
            }
            <br />
          </div>
        );
      });

      content.push(
        <Circle
          known={knownCompetences.length}
          total={allCompetences.length}
          showText={false}
        />
      )

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

  render() {
    const { erbjudenArbetsplats } = this.props.advert;
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
          <header className={styles.header} onClick={this.openListPage}>
            <span className='glyphicon glyphicon-chevron-left' />
            {/*<h1>Annons</h1>*/}
            <h1>&nbsp;</h1>
            {/*<span className={styles.saveAdvert}>Spara jobb</span>*/}

            <span className={styles.saveAdvert + ' glyphicon glyphicon-star-empty'} />
          </header>

          {this.props.advert &&
            <div className={styles.advertWrapper}>
              {/*<object
                style={{maxHeight: '60px'}}
                data={`http://api.arbetsformedlingen.se/platsannons/${this.props.advert.id}/logotyp`} type="image/gif"
              >
              </object> <br />*/}
              <b>{this.props.advert.arbetsgivarenamn}</b>
              <h3>{this.props.advert.rubrik}</h3>
              <p>{this.props.advert.yrkesroll.namn}</p>

              {!!this.props.advert.matchningsresultat.efterfragat.length &&
                <div className={styles.competenceWrapper}>
                  {this.props.params.matching ?
                    <b>Du matchar med:</b> :
                    <b>Vi efterfrågar:</b>
                  }
                  <br />
                  {this.createCompetences()}
                </div>
              }
              <div className={styles.advertTextWrapper} onClick={this.unFoldText.bind(this)}>
                <p
                  dangerouslySetInnerHTML={{__html: this.props.advert.annonstext}}
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
                  <p><b>Karta:</b> {this.props.advert.besoksadressGatuadress}</p>
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
          {!this.props.advert &&
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
  };
}

const mapStateToProps = createStructuredSelector({
  advert: selectAdvert(),
  knownCompetences: selectKnownCompetences(),
  knownExperiences: selectKnownExperiences(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(JobAdvert);
