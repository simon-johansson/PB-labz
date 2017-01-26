/*
 * AddOccupation
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { browserHistory } from 'react-router';
import Tappable from 'react-tappable';

// import messages from './messages';
import { createStructuredSelector } from 'reselect';

import {
  selectQuery,
  selectOccupations,
  selectOccupationList,
} from './selectors';

import {
  selectRelated,
} from 'containers/App/selectors';

import {
  changeQuery,
  addOccupation,
  occupationsLoaded,
  changeOccupationListQuery,
} from './actions';

import RepoListItem from 'containers/RepoListItem';
import OccupationListItem from 'components/OccupationListItem';
import YrkeslistaListItem from 'components/YrkeslistaListItem';
import Button from 'components/Button';
import H2 from 'components/H2';
import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';

import styles from './styles.css';

export class AddOccupation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      related: 5,
      previous: {},
      picked: [],
    };
  }

  componentDidMount() {
    const { group, id } = this.props.params;
    if (group) {
      this.props.onChangeOccupationListQuery(group, id);
    } else {
      this.props.onChangeQuery({target: { value: '' }});
      ReactDOM.findDOMNode(this.refs.occupationInput).focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { group, id } = this.props.params;
    if (group !== nextProps.params.group) {
      this.props.onChangeOccupationListQuery(nextProps.params.group, nextProps.params.id);
    }
  }

  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  goBack = () => {
    this.setState({
      previous: false,
      picked: [],
    });
    if (this.props.params.group) {
      this.openRoute('/occupation');
    } else {
      // browserHistory.goBack();
      this.openRoute('/filter');
    }
  };

  openYrkeslistan = () => {
    this.openRoute('/occupation/yrkesomraden');
  }

  onListItemClick(item) {
    this.props.onAddOccupation(item);
    this.goBack();
  }

  onItemsPicked() {
    this.state.picked.forEach(pick => {
      this.props.onAddOccupation(pick);
    })
    this.openRoute('/filter');
  }

  onOccupationListItemClick(item) {
    const { group } = this.props.params;
    const pickParent = (item) => {
      item.parent = true;
      item.picked = true;
      this.setState({
        picked: [item],
        previous: item,
      });
    };
    if (item.typ === 'YRKE') {
      let picked = this.state.picked.slice();
      let parent = this.state.previous;
      picked = picked.filter(i => !i.parent);
      parent.picked = false;

      this.setState({
        picked: [item, ...picked],
        previous: parent,
      });
    } else if (group === 'yrkesomraden') {
      pickParent(item);
      this.openRoute(`/occupation/yrkesgrupper/${item.id}`);
    } else if (group === 'yrkesgrupper') {
      pickParent(item);
      this.openRoute(`/occupation/yrken/${item.id}`);
    }
  }

  onSubmitForm(e) {
    if (e !== undefined && e.preventDefault) e.preventDefault();

    this.props.onAddOccupation({
      typ: 'FRITEXT',
      id: `"${this.props.query}"`,
      namn: `"${this.props.query}"`,
    });
    document.activeElement.blur();
    this.openRoute('/filter');
  }

  createRelatedTags() {
    if (this.props.related.length > 0) {
      return this.props.related.map((item, index) => {
        if (index < this.state.related) {
          return (
            <div className={styles.tag} onClick={this.onListItemClick.bind(this, item.matchningskriterium)}>
              <span className={styles.tagText}>
                {item.matchningskriterium.namn} ({item.antal})
              </span>
            </div>
          );
        }
      });
    }
  }

  doneOrYrkeslista() {
    return (
      <div>
        {!!this.state.picked.length &&
          <Tappable className={styles.yrkeslista} onTap={this.onItemsPicked.bind(this)}>
            Klar
          </Tappable>
        }
        {/*!this.props.params.group &&
          <span className={styles.yrkeslista} onClick={this.openYrkeslistan}>
            Yrkeslista
          </span>
        */}
      </div>
    )
  }

  yrkesguideListItem() {
    return [
      <div className={styles.linkWrapper} onClick={this.openYrkeslistan}>
        <span className={styles.yrkeslistan}>Välj ur yrkeslistan</span>
        <span className={styles.chevronRight + ' glyphicon glyphicon-chevron-right'}></span>
      </div>
    ];
  }

  render() {
    // console.log(this.state.previous);
    let mainContent = null;

    // Show a loading indicator when we're loading
    if (this.props.loading) {
      mainContent = (<List component={LoadingIndicator} />);
    }
    else if (!this.props.query && !this.props.related) {
      const EmptyComponent = () => (
        <ListItem item={''} />
      );
      mainContent = (<List component={EmptyComponent} />);
    }
    else if (!this.props.query && this.props.related) {
      mainContent = (
        <div>
          <p className={styles.suggestions}>Yrkesförslag</p>
          <List
            items={this.props.related.slice(0, this.state.related)}
            component={OccupationListItem}
            click={this.onListItemClick.bind(this)}
          />
        </div>
      );
    }
    else if (this.props.occupations !== false) {
      // console.log(this.props.occupations);
      const freetext = {id: `"${this.props.query}"`, namn: `"${this.props.query}"`, typ: 'FRITEXT'};
      mainContent = (
        <div className={styles.autoCompleteList}>
          <List
            items={[...this.props.occupations, freetext]}
            component={OccupationListItem}
            click={this.onListItemClick.bind(this)}
          />
        </div>
      );
    }

    if (this.props.params.group) {
      let list = this.props.occupationList.map((item) => {
        // let isPicked = false;
        // let parent = false;
        this.state.picked.forEach((pick) => {
          if (pick.id === item.id) {
            item.picked = true;
            // parent = true;
            // const prev = this.state.previous;
            // prev.picked = false;
            // this.setState({previous: prev});
          }
        });
        // if (!item.parent || parent) {
        //   item.picked = isPicked;
        // }
        return item;
      });
      // console.log(this.state.previous);
      let items = this.state.previous.namn ? [this.state.previous, ...list] : list;
      mainContent = (
        <div>
          <List
            items={items}
            component={YrkeslistaListItem}
            click={this.onOccupationListItemClick.bind(this)}
          />
        </div>
      );
    }

    return (
      <article>
        <div>
          <section className={styles.textSection}>
            <div className={styles.searchForm}>
              <h1>Jag vill jobba som</h1>
              {this.doneOrYrkeslista()}
              <span className={styles.cancel} onClick={this.goBack}>
                <span className={'glyphicon glyphicon-remove'} />
                {/*Avbryt*/}
              </span>

              {!this.props.params.group &&
                <form onSubmit={this.onSubmitForm.bind(this)} autoComplete="off">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="occupation"
                      placeholder="Yrke, Yrkesgrupp eller Yrkesområde"
                      value={this.props.query}
                      autoComplete="off"
                      autoCapitalize="off"
                      autoCorrect="off"
                      onChange={this.props.onChangeQuery}
                      ref="occupationInput"
                    />
                  </div>
                  <button type="submit" style={{display: 'none'}} className="btn btn-default">Submit</button>

                  {!!this.props.related.length && false &&
                    <div className={styles.tagWrapper}>
                        <span className={styles.smallText}>Yrkesförslag:</span>
                      {this.createRelatedTags()}
                      { false &&
                        <div className={styles.tag}>
                          <span className={styles.tagText}>
                            {this.props.related.length - this.state.related}
                            <span className="glyphicon glyphicon-plus" />
                          </span>
                        </div>
                      }
                    </div>
                  }
                </form>
              }
            </div>
            {!this.props.params.group &&
              <List items={this.yrkesguideListItem()} component={ListItem} />
            }
            {mainContent}
          </section>
        </div>
      </article>
    );
  }
}

AddOccupation.propTypes = {
  changeRoute: React.PropTypes.func,
  loading: React.PropTypes.bool,
  error: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  occupations: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  related: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.bool,
  ]),
  onChangeQuery: React.PropTypes.func,
  onChangeOccupationListQuery: React.PropTypes.func,
  onAddOccupation: React.PropTypes.func,
  query: React.PropTypes.string,
};

export function mapDispatchToProps(dispatch, props) {
  return {
    onChangeQuery: (evt) => dispatch(changeQuery(evt.target.value)),
    onChangeOccupationListQuery: (group, id) => dispatch(changeOccupationListQuery(group, id)),
    onAddOccupation: (occupation) => dispatch(addOccupation(occupation)),
    changeRoute: (url) => dispatch(push(url)),
  };
}

const mapStateToProps = createStructuredSelector({
  query: selectQuery(),
  occupations: selectOccupations(),
  related: selectRelated(),
  occupationList: selectOccupationList(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(AddOccupation);
