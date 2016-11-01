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

import {
  selectId,
  selectAdvert,
} from './selectors';

import {
  loadAdvert,
  advertLoaded
} from './actions';

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
    this.props.onLoadAdvert(this.props.params.id)
  }

  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  openHomePage = () => {
    this.openRoute('/');
  };

  createCompetences() {
    if (this.props.advert.kompetenser.length) {
      return this.props.advert.kompetenser.map((item, index) => {
        return (
          <div>
            <span>{item.namn}</span>
            <br />
          </div>
        );
      });
    }
  }

  render() {
    // console.log(this.props.advert);

    return (
      <article>
        <header className={styles.header}>
          <span className='glyphicon glyphicon-chevron-left' onClick={this.openHomePage} />
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
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(JobAdvert);
