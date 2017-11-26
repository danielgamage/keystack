import React, { Component } from 'react'
import { connect } from 'react-redux'

import { format } from 'd3-format'

import {
  NumericInput,
  Item,
  Echo,
} from '@/components'

const parameters = [
  { name: 'mix',
    unit: '%',
    format: '',
    min: 0,
    max: 100,
    step: 1,
    scale: 1
  },
  { name: 'delay',
    unit: 's',
    format: '.3s',
    min: 0.01,
    max: 2,
    step: 0.01,
    scale: 1
  },
  { name: 'feedback',
    unit: '%',
    format: '',
    min: 0,
    max: 90,
    step: 1,
    scale: 1
  }
]

class Delay extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Item type='audio' index={this.props.index} item={this.props.data}>
        <Echo
          id={this.props.data.id}
          feedback={this.props.data.feedback / 100}
          delayTime={this.props.data.delay}
          mix={this.props.data.mix / 100}
          onInput={() => {}}
        />
        <div className='flex-container'>
          {parameters.map(param => (
            <NumericInput
              label={param.name}
              key={param.name}
              className='tri'
              id={param.name}
              min={param.min}
              max={param.max}
              step={param.step}
              scale={param.scale}
              unit={param.unit}
              displayValue={format(param.format)(this.props.data[param.name])}
              value={this.props.data[param.name]}
              onInput={(event) => {
                this.props.dispatch({
                  type: 'UPDATE_DEVICE',
                  id: this.props.data.id,
                  property: param.name,
                  value: event,
                })
              }}
              />
          ))}
        </div>
      </Item>
    )
  }
}

export default connect()(Delay)
