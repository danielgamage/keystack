import React, { Component } from 'react'
import { connect } from 'react-redux'

import Item from '../Item.jsx'
import NumericInput from '../NumericInput.jsx'

class StereoPanner extends Component {
  render () {
    return (
      <Item type='audio' item={this.props.data}>
        <div className='flex-container'>
          <NumericInput
            label='Pan'
            className='tri'
            id={`pan-${this.props.data.id}`}
            min={-1}
            max={1}
            step={0.01}
            value={this.props.data['pan']}
            action={{
              type: 'UPDATE_AUDIO_ITEM',
              id: this.props.data.id,
              property: 'pan'
            }}
            />
        </div>
      </Item>
    )
  }
}

export default connect()(StereoPanner)
