import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import KeySynth from './instruments/KeySynth.jsx'
import Sampler from './instruments/Sampler.jsx'

import Filter from './effects/Filter.jsx'
import StereoPanner from './effects/StereoPanner.jsx'
import Compressor from './effects/Compressor.jsx'
import Delay from './effects/Delay.jsx'
import Distortion from './effects/Distortion.jsx'

import Transpose from './midi/Transpose.jsx'
import Chord from './midi/Chord.jsx'
import DisableNotes from './midi/DisableNotes.jsx'

import { midiEffectSchema, instrumentSchema, audioEffectSchema } from '../reducers/schema'

const MidiEffectsByName = {
  'Transpose': Transpose,
  'Chord': Chord,
  'DisableNotes': DisableNotes
}
const InstrumentsByName = {
  'KeySynth': KeySynth,
  'Sampler': Sampler
}
const AudioEffectsByName = {
  'Filter': Filter,
  'StereoPanner': StereoPanner,
  'Compressor': Compressor,
  'Delay': Delay,
  'Distortion': Distortion
}

const insertHRs = (arr) => {
  const length = arr.length
  for (let i = 1; i < length; i++) {
    arr.splice(length - i, 0, <hr />)
  }
  return arr
}

class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      add: null
    }
  }
  render () {
    const midiEffects = this.props.midiEffects.map((effect, i) => {
      const ComponentName = MidiEffectsByName[effect.midiEffectType]
      return (<ComponentName key={`${effect.midiEffectType}-${i}`} data={effect} />)
    })
    const instruments = this.props.instruments.map((instrument, i) => {
      const ComponentName = InstrumentsByName[instrument.type]
      return (<ComponentName key={`${instrument.midiEffectType}-${i}`} data={instrument} />)
    })
    const audioEffects = this.props.audioEffects.map((effect, i) => {
      const ComponentName = AudioEffectsByName[effect.audioEffectType]
      return (<ComponentName key={`${effect.midiEffectType}-${i}`} data={effect} />)
    })
    return (
      <div class={`${this.state.add !== null ? 'add-open' : '' } settings`}>
        <div class='settings-container settings-container-add'>
          <div class='settings-inner-container'>
            {this.state.add !== null
              ? Object.keys(this.state.add).map(item => (
                <button
                  onClick={() => {
                    this.props.dispatch({
                      type: this.state.action,
                      value: item
                    })
                  }}
                  class='add-item-option'
                  >{item}</button>
              ))
              : ''
            }
          </div>
        </div>
        <div
          class='settings-container settings-container-main'
          onClick={(e) => {
            this.setState({
              add: null,
              action: null
            })
          }}
          >
          <div class='settings-inner-container'>
            <section class='settings-section'>
              <h3 class='settings-title'>Midi Effects</h3>
              {insertHRs(midiEffects)}
              <button
                class='add-button button'
                onClick={(e) => {
                  e.stopPropagation()
                  this.setState({
                    add: midiEffectSchema,
                    action: 'ADD_MIDI_ITEM'
                  })
                }}>+ Add</button>
            </section>
            <hr class='section-splitter' />
            <section class='settings-section'>
              <h3 class='settings-title'>Instruments</h3>
              {insertHRs(instruments)}
              <button
                class='add-button button'
                onClick={(e) => {
                  e.stopPropagation()
                  this.setState({
                    add: instrumentSchema,
                    action: 'ADD_INSTRUMENT_ITEM'
                  })
                }}>+ Add</button>
            </section>
            <hr class='section-splitter' />
            <section class='settings-section'>
              <h3 class='settings-title'>Audio Effects</h3>
              {insertHRs(audioEffects)}
              <button
                class='add-button button'
                onClick={(e) => {
                  e.stopPropagation()
                  this.setState({
                    add: audioEffectSchema,
                    action: 'ADD_AUDIO_ITEM'
                  })
                }}>+ Add</button>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    instruments: state.instruments,
    audioEffects: state.audioEffects,
    midiEffects: state.midiEffects
  }
}

export default connect(mapStateToProps)(Settings)
