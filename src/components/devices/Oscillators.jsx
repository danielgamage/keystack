import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  NumericInput,
  Icon,
  Text,
  Button,
} from '@/components'

import sawtoothIcon from '@/images/wave-sawtooth.svg'
import squareIcon from '@/images/wave-square.svg'
import triangleIcon from '@/images/wave-triangle.svg'
import sineIcon from '@/images/wave-sine.svg'

const waves = {
  'sawtooth': sawtoothIcon,
  'square': squareIcon,
  'triangle': triangleIcon,
  'sine': sineIcon
}

class Oscillators extends Component {
  render () {
    return (
      <section className='controls'>
        {this.props.oscillators.map((osc, i) => (
          <div className={`osc osc-${i}`} key={i}>
            <div className='wave'>
              <Text type='h3'>
                {`OSC ${i}`}
                <Button
                  className='button delete-osc'
                  onClick={() => {
                    this.props.dispatch({
                      id: this.props.instrument.id,
                      type: 'DELETE_OSC',
                      index: i
                    })
                  }}
                >Remove</Button>
              </Text>
              {['sawtooth', 'triangle', 'square', 'sine'].map((type, typeIndex) => (
                <label
                  title={type}
                  key={type}
                >
                  <input
                    className='hide-input'
                    name={`osc-${this.props.instrument.id}-${i}`}
                    type='radio'
                    value={type}
                    checked={(osc.type === type)}
                    onChange={(e) => {
                      this.props.dispatch({
                        id: this.props.instrument.id,
                        type: 'UPDATE_OSC',
                        property: 'type',
                        value: type,
                        index: i
                      })
                    }}
                    />
                  <Icon
                    className='icon icon--wave'
                    src={waves[type]}
                    />
                </label>
              ))}
            </div>
            <NumericInput
              label='tune'
              className='small'
              id={`detune-${i}`}
              min={-50}
              max={50}
              step={1}
              unit=' ct'
              displayValue={osc.detune}
              value={osc.detune}
              onInput={(event) => {
                this.props.dispatch({
                  id: this.props.instrument.id,
                  type: 'UPDATE_OSC',
                  index: i,
                  property: 'detune',
                  value: event,
                })
              }}
              />
            <NumericInput
              label='pitch'
              className='small'
              id={`pitch-${i}`}
              min={-48}
              max={48}
              step={1}
              unit=' st'
              displayValue={osc.pitch}
              value={osc.pitch}
              onInput={(event) => {
                this.props.dispatch({
                  id: this.props.instrument.id,
                  type: 'UPDATE_OSC',
                  index: i,
                  property: 'pitch',
                  value: event,
                })
              }}
              />
            <NumericInput
              label='vol'
              className='small'
              id={`volume-${i}`}
              min={0}
              max={1}
              step={0.01}
              value={osc.volume}
              onInput={(event) => {
                this.props.dispatch({
                  id: this.props.instrument.id,
                  type: 'UPDATE_OSC',
                  index: i,
                  property: 'volume',
                  value: event,
                })
              }}
              />
          </div>
        ))}
        <Button
          className='button add-osc'
          onClick={() => {
            this.props.dispatch({
              id: this.props.instrument.id,
              type: 'ADD_OSC'
            })
          }}
        >Add Oscillator</Button>
      </section>
    )
  }
}

export default connect()(Oscillators)
