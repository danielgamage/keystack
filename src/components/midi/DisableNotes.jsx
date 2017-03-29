import React, { Component } from 'react'
import { connect } from 'react-redux'

import Item from '../Item.jsx'

class DisableNotes extends Component {
  render () {
    return (
      <Item type='midi' index={this.props.index} item={this.props.data}>
        <div className='piano-checkboxes'>
          {this.props.data.value.map((el, i) => (
            <label key={i} className={`replaced-checkbox ${[1, 3, 6, 8, 10].includes(i) ? 'black' : 'white'}`}>
              <input
                checked={this.props.data.value[i]}
                type='checkbox'
                onChange={(e) => {
                  this.props.dispatch({
                    type: 'UPDATE_DEVICE_ARRAY',
                    id: this.props.data.id,
                    property: 'value',
                    index: i,
                    value: e.target.checked
                  })
                }}
                />
              <div className='checkbox-replacement'>
                <div className={`checkbox-check ${this.props.data.value[i] ? 'active' : ''}`} />
              </div>
            </label>
          ))}
        </div>
      </Item>
    )
  }
}

export default connect()(DisableNotes)
