import React, { Component } from 'react'
import { connect } from 'react-redux'

import NumericInput from '../NumericInput.jsx'
import Item from '../Item.jsx'

class Chord extends Component {
  render () {
    return (
      <Item type='midi' index={this.props.index} item={this.props.data}>
        <div className='flex-container'>
          {this.props.data.value.map((el, i) => (
            <NumericInput
              key={i}
              label={`Note #${i + 1}`}
              showLabel={false}
              className='six small'
              id={`pan-${this.props.data.id}-${i + 1}`}
              min={-24}
              max={24}
              step={1}
              unit=' st'
              value={this.props.data.value[i]}
              action={{
                type: 'UPDATE_DEVICE_ARRAY',
                id: this.props.data.id,
                property: 'value',
                index: i
              }}
              />
          ))}
        </div>
      </Item>
    )
  }
}

export default connect()(Chord)
