import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import chords from '../data/chords'
import Midi from './MIDI.jsx'
import NumericInput from './NumericInput.jsx'
import Envelope from './Envelope.jsx'
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
      <section class='controls'>
        {this.props.oscillators.map((osc, i) => (
          <div class={`osc osc-${i}`}>
            <div className='wave'>
              <span class='title'>
                {`OSC ${i}`}
                <button
                  class='button delete-osc'
                  onClick={() => {
                    this.props.dispatch({
                    id: this.props.instrument.id,
                    type: 'DELETE_OSC',
                    index: i
                  })
                  }}
                  >Delete</button>
              </span>
              {['sawtooth', 'triangle', 'square', 'sine'].map((type, typeIndex) => (
                <label title={type}>
                  <input
                    class='hide-input'
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
                    class='icon icon--wave'
                    src={waves[type]}
                    />
                </label>
              ))}
            </div>
            <NumericInput
              label='tune'
              class='small'
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
              class='small'
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
              class='small'
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
          class='button add-osc'
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
