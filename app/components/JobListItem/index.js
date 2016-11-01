/**
 * JobListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';
moment.locale('sv');

import { FormattedNumber } from 'react-intl';
import { selectCurrentUser } from 'containers/App/selectors';
import ListItem from 'components/ListItem';
import IssueIcon from 'components/IssueIcon';
import A from 'components/A';

import styles from './styles.css';

export class JobListItem extends React.Component { // eslint-disable-line react/prefer-stateless-function

  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  addLocationPage = (id) => {
    // console.log(id);
    this.openRoute(`/advert/${id}`);
  };

  render() {
    const momentOptions = {
      sameElse: 'DD MMM',
    };
    const item = this.props.item;
    // console.log(item);

    const content = (
      <div className={styles.linkWrapper} onClick={this.addLocationPage.bind(this, item.id)}>
        <div>
          <span>{item.arbetsgivarenamn}, {item.erbjudenArbetsplats.kommun && item.erbjudenArbetsplats.kommun.namn}</span>
          <br />
          <b>{item.rubrik}</b>
          <br />
          <span className={styles.smallText}>Yrkesroll: {item.yrkesroll.namn}</span>
          <br />
          <span className={styles.smallText}>Publicerad: {moment(item.publiceringsdatum).calendar(null, momentOptions)}</span>
        </div>
      </div>
    );

    // Render the content into a list item
    return (
      <ListItem key={`repo-list-item-${item.full_name}`} item={content} />
    );
  }
}

JobListItem.propTypes = {
  item: React.PropTypes.object,
  changeRoute: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
  }
}

const mapStateToProps = createStructuredSelector({});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(JobListItem);