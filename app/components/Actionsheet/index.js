

import React from 'react';

import styles from './styles.css';

function noop() {}

class Actionsheet extends React.Component {

  static defaultProps = {
    onRequestClose: noop,
    onCancel: noop,
    show: false,
    menus: []
  }

  render() {
    const {
      onRequestClose,
      onCancel,
      menus,
      show,
    } = this.props

    return (
      <div className={`react-actionsheet${show ? ' react-actionsheet-show' : ''}`}
        onClick={onRequestClose}>
        <div className='react-actionsheet-mask'>
        </div>
        <div className='react-actionsheet-wrap'>
          <div className='react-actionsheet-menu'>
            {
              menus.map((menu, i) => {
                const { content, onClick = noop } = menu
                return (
                  <div key={i} className='react-actionsheet-menu-item' onClick={onClick}>
                    {content}
                  </div>
                )
              })
            }
          </div>
          <div className='react-actionsheet-action'>
            <div className='react-actionsheet-action-item' onClick={onCancel}>
              Cancel
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Actionsheet;