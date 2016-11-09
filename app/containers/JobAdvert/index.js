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

export class JobAdvert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      const competences = this.props.advert.kompetenser.map((k) => {
        if (this.props.knownCompetences.includes(k.id)) k.isKnown = true;
      });
      const competencesOrdered = _.orderBy(this.props.advert.kompetenser, 'isKnown', 'asc');
      return competencesOrdered.map((item, index) => {
        return (
          <div className={styles.wrapperDiv}>
            <span className={styles.competence}>
              { item.isKnown && this.props.params.matching &&
                <span className={styles.okIcon + ' glyphicon glyphicon-ok'} />
              }
              { !item.isKnown && this.props.params.matching &&
                <span className={styles.plusIcon + ' glyphicon glyphicon-plus'} />
              }
              {item.namn}
            </span>
            <br />
          </div>
        );
      });
    }
  }

  render() {
    setTimeout(() => {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }, 1);

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
                  <b>Eterfrågade kompetenser:</b>
                  <br />
                  {this.createCompetences()}
                </div>
              }
              <p dangerouslySetInnerHTML={{__html: this.props.advert.annonstext}}></p>
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
