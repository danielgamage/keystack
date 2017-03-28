import React, { Component } from 'react'
import { connect } from 'react-redux'

import { audioEffectNodes } from '../../utils/audio'

import Item from '../Item.jsx'
import NumericInput from '../NumericInput.jsx'

const parameters = [
  { name: 'mix',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    scale: 1
  },
  { name: 'amount',
    unit: '%',
    min: 0,
    max: 400,
    step: 1,
    scale: 1
  }
  // { name: 'feedback',
  //   unit: '%',
  //   min: 0,
  //   max: 90,
  //   step: 1,
  //   scale: 1
  // }
]

class Delay extends Component {
  render () {
    return (
      <Item type='audio' index={this.props.index} item={this.props.data}>
        <div className='flex-container'>
          {parameters.map(param => (
            <NumericInput
              label={param.name}
              className='tri'
              id={param.name}
              min={param.min}
              max={param.max}
              step={param.step}
              scale={param.scale}
              unit={param.unit}
              displayValue={this.props.data[param.name]}
              value={this.props.data[param.name]}
              action={{
                type: 'UPDATE_AUDIO_ITEM',
                id: this.props.data.id,
                property: param.name
              }}
              />
          ))}
        </div>
      </Item>
    )
  }
}

export default connect()(Delay)
