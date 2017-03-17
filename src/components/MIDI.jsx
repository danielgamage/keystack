import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import Icon from './Icon.jsx'

import { stopNote, startNote } from '../utils/audio'
import { keys, noteForIndex, getNoteIndexForMIDI } from '../utils'

import midiIcon from '../images/midi.svg'

class Settings extends Component {
  constructor (props) {
    super(props)
    this.onMIDIMessage = this.onMIDIMessage.bind(this)
    this.onMIDISuccess = this.onMIDISuccess.bind(this)
    this.onMIDIFailure = this.onMIDIFailure.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
  }
  onMIDIMessage(event) {
      var data = event.data,
          cmd = data[0] >> 4,
          channel = data[0] & 0xf,
          type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
          note = data[1],
          velocity = data[2]
      /*  WITH PRESSURE AND TILT OFF
       *    note off: 128, cmd: 8
       *    note on: 144, cmd: 9
       *  PRESSURE / TILT ON
       *    pressure: 176, cmd 11:
       *    bend: 224, cmd: 14
      */

      var note = getNoteIndexForMIDI(note)

      switch (type) {
          case 144: // noteOn message
              startNote(keys[note])
              break
          case 128: // noteOff message
              stopNote(keys[note])

              break
      }
  }
  onMIDISuccess(midiAccess) {
      // when we get a succesful response, run this code
      console.log('MIDI Access Object', midiAccess)
      const inputs = midiAccess.inputs.values()
      for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
          // listen for midi messages
          this.props.dispatch({
            type: 'ADD_MIDI',
            value: {
              id: input.value.id,
              manufacturer: input.value.manufacturer,
              name: input.value.name,
              type: input.value.type
            }
          })
          input.value.onmidimessage = this.onMIDIMessage
      }
      // listen for connect/disconnect message
      // midiAccess.onstatechange = onStateChange
  }
  onMIDIFailure(e) {
      // when we get a failed response, run this code
      console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e)
  }
  componentWillMount() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({
            sysex: false // this defaults to 'false' and we won't be covering sysex in this article.
        }).then(this.onMIDISuccess, this.onMIDIFailure)
    } else {
        console.log("No MIDI support in your browser.")
    }
  }
	render() {
    const hasMidi = this.props.midi.length > 0
		return (
      <div class="inputs info-section">
        <div class="section-icon">
          <Icon
            class={`icon icon--midi ${hasMidi && 'on'}`}
            src={midiIcon}
            />
        </div>
        {this.props.midi.map(el => (
            <div class="viewer">
              <span class="midi-manufacturer">{el.manufacturer}</span>
              <span class="midi-name">{el.name}</span>
            </div>
          ))
        }
      </div>
		);
	}
}

function mapStateToProps (state) {
  return { midi: state.midi }
}

export default connect(mapStateToProps)(Settings)
