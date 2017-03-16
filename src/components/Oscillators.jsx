import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import reduce from '../reducers'
import * as actions from '../actions'
import chords from '../data/chords'
import Midi from './MIDI.jsx'
import NumericInput from './NumericInput.jsx'
import Envelope from './Envelope.jsx'

import waveIcon from '../images/waves.svg'

class Oscillators extends Component {
	render() {
		return (
      <div class="controls">
        {this.props.synth.oscillators.map((osc, i) => (
          <div class={`osc osc-${i}`}>
            <div className="wave">
              <span class="title">{`OSC ${i}`}</span>
              {["sawtooth", "triangle", "square", "sine"].map((type, typeIndex) => (
                <label title={type}>
                  <input
                    class="hide-input"
                    name={`osc-${i}`}
                    type="radio"
                    value={type}
                    checked={(osc.type === type)}
                    onClick={() => {
                      this.props.dispatch({
                        type: 'UPDATE_OSC_TYPE',
                        value: type,
                        index: i
                      })
                    }}
                    />
                  <svg className='icon icon--wave' viewBox='0 0 32 32'>
                    <use xlinkHref={waveIcon + `#${type}`}></use>
                  </svg>
                </label>
              ))}
            </div>
            <NumericInput
              label="detune"
              class="small"
              id={`detune-${i}`}
              min="-50"
              max="50"
              step="1"
              value={osc.detune}
              action={{
                  type: 'UPDATE_OSC',
                  index: i,
                  property: 'detune'
              }}
              />
            <NumericInput
              label="octave"
              class="small"
              id={`octave-${i}`}
              min="-4"
              max="4"
              step="1"
              value={osc.octave}
              action={{
                  type: 'UPDATE_OSC',
                  index: i,
                  property: 'octave'
              }}
              />
          </div>
        ))}
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { notes: state.notes, synth: state.synth }
}

export default connect(mapStateToProps)(Oscillators)