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
} from 'containers/App/selectors';

import {
  loadAdvert,
  advertLoaded
} from './actions';

import LoadingIndicator from 'components/LoadingIndicator';
import IosMenu from 'components/IosMenu';
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
        width: '100%'
      }}
    >
      <GoogleMapLoader
        containerElement={
          <div
            style={{
              height: "100%",
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => console.log(map)}
            defaultZoom={12}
            options={{
              mapTypeControl: false,
              zoomControl: true,
              scaleControl: false,
              streetViewControl: false,
              draggable: false,
              disableDoubleClickZoom: true,
            }}
            defaultCenter={{
              lat: props.markers[0].position.lat,
              lng: props.markers[0].position.lng
            }}
          >
            {props.markers.map((marker, index) => {
              return (
                <Marker {...marker} />
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
  }

  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  openListPage = () => {
    this.openRoute('/list');
  };

  createCompetences() {
    if (this.props.advert.kompetenser.length) {
      const content = [];
      const competences = this.props.advert.kompetenser.map((k) => {
        k.isKnown = (this.props.knownCompetences.includes(k.id) ?  true : false);
      });
      const allCompetences = this.props.advert.kompetenser;
      const knownCompetences = _.filter(this.props.advert.kompetenser, {isKnown: true});
      const unknownCompetences = _.filter(this.props.advert.kompetenser, {isKnown: false});

      if (!this.props.params.matching) {
        return allCompetences.map((item, index) => {
          return (
            <div className={styles.wrapperDiv}>
              <span className={styles.competence}>{item.namn}</span>
              <br />
            </div>
          );
        });
      }

      // if (knownCompetences.length) content.push(<span className={styles.competenceHeader}>Du kan:</span>);
      knownCompetences.forEach((item, index) => {
        content.push(
          <div className={styles.wrapperDiv}>
            <span className={styles.competence}>
              <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />{item.namn}</span>
            <br />
          </div>
        );
      });

      if (unknownCompetences.length && knownCompetences.length) {
        content.push(<span className={styles.competenceHeader}>Vi efterfrågar också:</span>);
      }
      unknownCompetences.forEach((item, index) => {
        content.push(
          <div className={styles.wrapperDiv}>
            <span className={styles.competence}>
              <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />{item.namn}</span>
            <br />
          </div>
        );
      });

      return content;
    }
  }

  foldText() {
    this.setState({ folded: false });
  }

  render() {
    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, 1);

    const { erbjudenArbetsplats } = this.props.advert;
    let markers;

    if (erbjudenArbetsplats) {
      markers = [{
        position: {
          lat: erbjudenArbetsplats.geoPosition.latitud,
          lng: erbjudenArbetsplats.geoPosition.longitud,
        }
      }];
    }

    return (
      <article>
        <div className={styles.contentWrapper}>
          <header className={styles.header} onClick={this.openListPage}>
            <span className='glyphicon glyphicon-chevron-left' />
            <h1>Annons</h1>
          </header>

          {this.props.advert &&
            <div className={styles.advertWrapper}>
              <b>{this.props.advert.arbetsgivarenamn}</b>
              <h3>{this.props.advert.rubrik}</h3>
              <p>{this.props.advert.yrkesroll.namn}</p>

              {!!this.props.advert.kompetenser.length &&
                <div className={styles.competenceWrapper}>
                  <b>Eterfrågade kompetenser:</b> <br />
                  {this.createCompetences()}
                </div>
              }
              <div className={styles.advertTextWrapper} onClick={this.foldText.bind(this)}>
                <p
                  dangerouslySetInnerHTML={{__html: this.props.advert.annonstext}}
                  className={`${styles.advertText} ${this.state.folded ? styles.unfolded : ''}`}
                />
                {this.state.folded &&
                  <span className={styles.showmore}>Visa hela annonsen</span>
                }
              </div>


              {!!erbjudenArbetsplats &&
                <div>
                  <p><b>Karta:</b> {this.props.advert.besoksadressGatuadress}</p>
                  <SimpleMap
                    markers={markers}
                  />
                </div>
              }
            </div>
          }
          {!this.props.advert &&
            <div className={styles.loading}>
              <LoadingIndicator />
            </div>
          }
        </div>
        <IosMenu />
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
  };
}

const mapStateToProps = createStructuredSelector({
  advert: selectAdvert(),
  knownCompetences: selectKnownCompetences(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(JobAdvert);
