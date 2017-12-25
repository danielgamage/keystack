import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Icon } from '@/components'

import { stopNote, startNote } from '@/utils/notes'
import { keys, noteForIndex, getNoteIndexForMIDI } from '@/utils'

import midiIcon from '@/images/icon/keyboard.svg'

class Midi extends Component {
  constructor (props) {
    super(props)
    this.onMIDIMessage = this.onMIDIMessage.bind(this)
    this.onMIDISuccess = this.onMIDISuccess.bind(this)
    this.onMIDIChange = this.onMIDIChange.bind(this)
    this.onMIDIFailure = this.onMIDIFailure.bind(this)
    this.createMIDIObject = this.createMIDIObject.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
  }
  onMIDIMessage (event) {
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
  createMIDIObject (device) {
    return {
      id: device.id,
      manufacturer: device.manufacturer,
      name: device.name,
      type: device.type
    }
  }
  onMIDISuccess (midiAccess) {
    this.props.dispatch({
      type: 'CHANGE_MIDI_SUPPORT',
      value: true
    })
    const inputs = midiAccess.inputs.values()
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      this.props.dispatch({
        type: 'ADD_MIDI',
        value: this.createMIDIObject(input.value)
      })
      // listen for midi messages
      input.value.onmidimessage = this.onMIDIMessage
    }
    // listen for connect/disconnect message
    midiAccess.onstatechange = this.onMIDIChange
  }
  onMIDIChange (e) {
    const device = e.port
    if ((device.type === 'input') && (this.props.midi.inputs.indexOf(this.createMIDIObject(device)) === -1)) {
      this.props.dispatch({
        type: (device.state === 'connected') ? 'ADD_MIDI' : 'REMOVE_MIDI',
        value: this.createMIDIObject(device)
      })
      // listen for midi messages
      device.onmidimessage = this.onMIDIMessage
    }
  }
  onMIDIFailure (e) {
    this.props.dispatch({
      type: 'CHANGE_MIDI_SUPPORT',
      value: false
    })
  }
  componentWillMount () {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: false
      }).then(this.onMIDISuccess, this.onMIDIFailure)
    }
  }
  render () {
    const hasMidi = this.props.midi.inputs.length > 0
    return (
      <div className='inputs'>
        <div className='section-icon'>
          <Icon
            className={`icon icon--midi ${hasMidi && 'on'}`}
            src={midiIcon}
          />
        </div>
        {this.props.midi.supports
          ? hasMidi
            ? this.props.midi.inputs.map(el => (
              <div className='viewer'>
                <span className='midi-manufacturer'>{el.manufacturer}</span>
                <span className='midi-name'>{el.name}</span>
              </div>
            ))
            : <div>No MIDI connected</div>
          : <div>No MIDI support</div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { midi: state.midi }
}

export default connect(mapStateToProps)(Midi)
