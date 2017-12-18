import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  NumericInput,
  Item,
} from '@/components'

class StereoPanner extends Component {
  render () {
    return (
      <Item type='audio' index={this.props.index} item={this.props.data}>
        <div className='flex-container'>
          <NumericInput
            label='Pan'
            className='tri'
            id={`pan-${this.props.data.id}`}
            min={-1}
            max={1}
            steps={{default: 0.01, shiftKey: 0.1, altShiftKey: 1}}
            value={this.props.data['pan']}
            onInput={(event) => {
              this.props.dispatch({
                type: 'UPDATE_DEVICE',
                id: this.props.data.id,
                property: 'pan',
                value: event
              })
            }}
            />
        </div>
      </Item>
    )
  }
}

export default connect()(StereoPanner)
