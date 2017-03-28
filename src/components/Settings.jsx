import React, { Component } from 'react'
import { connect } from 'react-redux'

import FlipMove from 'react-flip-move'

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

const customEnterAnimation = {
  from: { opacity: 0, transform: 'scale(0.8, 0.8)' },
  to: { opacity: 1, transform: 'scale(1, 1)' }
}
const customLeaveAnimation = {
  from: { opacity: 1, transform: 'scale(1, 1)' },
  to: { opacity: 0, transform: 'scale(0.8, 0.8)' }
}

const insertHRs = (arr, type, edges) => {
  const length = arr.length
  for (let i = (edges ? 0 : 1); i <= (edges ? length : length - 1); i++) {
    arr.splice(length - i, 0,
      <hr
        key={`${type}-${length - i}`}
        className={`${type} ${type}-${length - i} ${(i === length || i === 0) ? 'edge' : ''}`}
        />
    )
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
    const items = {
      midi: this.props.midiEffects.map((effect, i) => {
        const ComponentName = MidiEffectsByName[effect.midiEffectType]
        return (<ComponentName key={effect.id} index={i} dragging={this.props.view.dragging} data={effect} />)
      }),
      instrument: this.props.instruments.map((instrument, i) => {
        const ComponentName = InstrumentsByName[instrument.type]
        return (<ComponentName key={instrument.id} index={i} dragging={this.props.view.dragging} data={instrument} />)
      }),
      audio: this.props.audioEffects.map((effect, i) => {
        const ComponentName = AudioEffectsByName[effect.audioEffectType]
        return (<ComponentName key={effect.id} index={i} dragging={this.props.view.dragging} data={effect} />)
      })
    }
    const chain = [
      {schema: midiEffectSchema, type: 'midi', title: 'Midi Effects'},
      {schema: instrumentSchema, type: 'instrument', title: 'Instruments'},
      {schema: audioEffectSchema, type: 'audio', title: 'Audio Effects'}
    ].map(el => (
      <FlipMove
        duration={200}
        easing="ease"
        typeName="section"
        className={`settings-section settings-section--${el.type}`}
        staggerDurationBy={20}
        enterAnimation={customEnterAnimation}
        leaveAnimation={customLeaveAnimation} >
        <h3 key='title' className='settings-title'>{el.title}</h3>
        {insertHRs(items[el.type], el.type, true)}
        <button
          key='button'
          className='add-button button'
          onClick={(e) => {
            e.stopPropagation()
            this.setState({
              add: el.schema,
              action: `ADD_${el.type.toUpperCase()}_ITEM`
            })
          }}>+ Add</button>
      </FlipMove>
    ))
    return (
      <div className={`${this.state.add !== null ? 'add-open' : ''} ${this.props.view.dragging ? 'dragging' : ''} settings`}>
        <div className='settings-container settings-container-add'>
          <div className='settings-inner-container'>
            {this.state.add !== null
              ? Object.keys(this.state.add).map(item => (
                <button
                  onClick={() => {
                    this.props.dispatch({
                      type: this.state.action,
                      value: item
                    })
                  }}
                  className='button add-item-option'
                  >{item}</button>
              ))
              : ''
            }
          </div>
        </div>
        <div
          className='settings-container settings-container-main'
          onClick={(e) => {
            this.setState({
              add: null,
              action: null
            })
          }}
          >
          <div className='settings-inner-container'>
            {insertHRs(chain, 'big', false)}
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
    midiEffects: state.midiEffects,
    view: state.view
  }
}

export default connect(mapStateToProps)(Settings)
