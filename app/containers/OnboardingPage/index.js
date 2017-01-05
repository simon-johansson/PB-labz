
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from './styles.css';
import match from './match.png';

export class FeaturePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgClass: '',
    };
  }

  openHomePage = () => {
    this.props.dispatch(push('/'));
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ imgClass: styles.animate });
    }, 100);
  }

  render() {
    return (
      <div className={styles.splashWrapper}>
        <div className={styles.imgWrapper}>
          <img
            src={match}
            className={this.state.imgClass}
          />
        </div>
        <div className={styles.welcome}>
          <h1>Välkommen till nya Platsbanken</h1>
          <p>Här kan du söka bland tusentals lediga jobb och hitta de som matchar dig bäst</p>
          <button
            className={styles.startButton + ' btn btn-default'}
            onClick={this.openHomePage}
          >Sätt igång</button>
        </div>
      </div>
    );
  }
}

FeaturePage.propTypes = {
  dispatch: React.PropTypes.func,
};

export default connect()(FeaturePage);
