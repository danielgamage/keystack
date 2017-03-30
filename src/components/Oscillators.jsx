import React, { Component } from 'react'
import { connect } from 'react-redux'
import NumericInput from './NumericInput.jsx'
import Icon from './Icon.jsx'

import sawtoothIcon from '../images/wave-sawtooth.svg'
import squareIcon from '../images/wave-square.svg'
import triangleIcon from '../images/wave-triangle.svg'
import sineIcon from '../images/wave-sine.svg'

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
          <div className={`osc osc-${i}`}>
            <div className='wave'>
              <span className='title'>
                {`OSC ${i}`}
                <button
                  className='button delete-osc'
                  onClick={() => {
                    this.props.dispatch({
                      id: this.props.instrument.id,
                      type: 'DELETE_OSC',
                      index: i
                    })
                  }}
                  >Remove</button>
              </span>
              {['sawtooth', 'triangle', 'square', 'sine'].map((type, typeIndex) => (
                <label title={type}>
                  <input
                    className='hide-input'
                    name={`osc-${this.props.instrument.id}-${i}`}
                    type='radio'
                    value={type}
                    checked={(osc.type === type)}
                    onClick={(e) => {
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
              min='-50'
              max='50'
              step='1'
              unit=' ct'
              displayValue={osc.detune}
              value={osc.detune}
              action={{
                id: this.props.instrument.id,
                type: 'UPDATE_OSC',
                index: i,
                property: 'detune'
              }}
              />
            <NumericInput
              label='pitch'
              className='small'
              id={`pitch-${i}`}
              min='-48'
              max='48'
              step='1'
              unit=' st'
              displayValue={osc.pitch}
              value={osc.pitch}
              action={{
                id: this.props.instrument.id,
                type: 'UPDATE_OSC',
                index: i,
                property: 'pitch'
              }}
              />
            <NumericInput
              label='vol'
              className='small'
              id={`volume-${i}`}
              min='0'
              max='1'
              step='0.01'
              value={osc.volume}
              action={{
                id: this.props.instrument.id,
                type: 'UPDATE_OSC',
                index: i,
                property: 'volume'
              }}
              />
          </div>
        ))}
        <button
          className='button add-osc'
          onClick={() => {
            this.props.dispatch({
              id: this.props.instrument.id,
              type: 'ADD_OSC'
            })
          }}
          >Add Oscillator</button>
      </section>
    )
  }
}

export default connect()(Oscillators)
