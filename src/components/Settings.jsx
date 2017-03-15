import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import reduce from '../reducers'
import * as actions from '../actions'
import chords from '../data/chords'
import Midi from './MIDI.jsx'

import waveIcon from '../images/waves.svg'

class Settings extends Component {
	render() {
    let matches = []
    if (this.props.notes.length > 0) {
      const sortedNotes = [...this.props.notes].sort((a,b) => (a.index - b.index))
      const root = sortedNotes[0]
      const chord = sortedNotes.map(note => ((note.index - sortedNotes[0].index) % 12 ))
      matches = chords.filter(el => el.set.length === chord.length && el.set.every((e, i) => e === chord[i]))
    }
		return (
      <div class="settings">
        <Midi />
        <div class="viewer note-viewer">{
          this.props.notes.map(el => (
            <span class="notes">{el.note}<sub>{el.octave}</sub></span>
          ))
        }</div>
        <div class="viewer chord-viewer">{
          matches.map(match => (
            <span class="match">{root.note} {match.name} <span class="quality">{match.quality}</span></span>
          ))
        }</div>
        <div>
          <div class="controls">
            {this.props.synth.oscillators.map((osc, i) => (
              <div class={`osc-${i}`}>
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
            ))}
          </div>
        </div>
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { notes: state.notes, synth: state.synth }
}

export default connect(mapStateToProps)(Settings)
