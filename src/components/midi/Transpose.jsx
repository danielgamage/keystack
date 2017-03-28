import React, { Component } from 'react'
import { connect } from 'react-redux'

import NumericInput from '../NumericInput.jsx'
import Item from '../Item.jsx'

class Transpose extends Component {
  render () {
    return (
      <Item type='midi' index={this.props.index} item={this.props.data}>
        <div className='flex-container'>
          <NumericInput
            label='Transpose'
            showLabel={false}
            className='tri small right'
            id={`pan-${this.props.data.id}`}
            min={-48}
            max={48}
            step={1}
            unit={` st`}
            displayValue={this.props.data.value}
            value={this.props.data.value}
            action={{
              type: 'UPDATE_MIDI_ITEM',
              id: this.props.data.id,
              property: 'value'
            }}
            />
        </div>
      </Item>
    )
  }
}

export default connect()(Transpose)