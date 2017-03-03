
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import styles from './styles.css';
import match from './match.png';
import splash from './splash.png';
import bg from './Welcome_man_headphones_white.jpg';

export class FeaturePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      splash: true,
      imgClass: '',
    };
  }

  openHomePage = () => {
    this.props.dispatch(push('/'));
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ splash: false });
      setTimeout(() => {
        this.setState({ imgClass: styles.animate });
      }, 500);
    }, 3000);
  }

  render() {
    return (
      <div className={styles.splashWrapper}>
        <div className={`${styles.splashImgWrapper} ${!this.state.splash ? styles.fadeout : ''} `}>
          <img
            src={splash}
            className={styles.splashImg}
          />
        </div>
        <div
          className={styles.imgWrapper}
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: '-70px',
          }}
        >
        </div>
        <div className={styles.welcome}>
          <div className={styles.textWrapper}>
            <h1>Välkommen till nya Platsbanken</h1>
            <p>Här kan du söka bland tusentals lediga jobb och hitta de som matchar dig bäst</p>
          </div>
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
