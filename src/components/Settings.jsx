// RENAME: TrackDevices.jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'

import FlipMove from 'react-flip-move'

import generateID from '../utils/generateID'

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

import schema from '../reducers/schema'

const devicesByName = {
  midi: {
    'Transpose': Transpose,
    'Chord': Chord,
    'DisableNotes': DisableNotes
  },
  instrument: {
    'KeySynth': KeySynth,
    'Sampler': Sampler
  },
  audio: {
    'Filter': Filter,
    'StereoPanner': StereoPanner,
    'Compressor': Compressor,
    'Delay': Delay,
    'Distortion': Distortion
  }
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
    const chain = [
      {type: 'midi', title: 'Midi Effects'},
      {type: 'instrument', title: 'Instruments'},
      {type: 'audio', title: 'Audio Effects'}
    ].map(el => {
      const devices = this.props.devices
        .filter(device => el.type === device.deviceType)
        .map((device, i) => {
          const ComponentName = devicesByName[device.deviceType][device.devicePrototype]
          return (<ComponentName key={device.id} dragging={this.props.view.dragging} data={device} />)
        })
      return (
        <FlipMove
          duration={200}
          easing='ease'
          typeName='section'
          className={`settings-section settings-section--${el.type}`}
          staggerDurationBy={20}
          enterAnimation={customEnterAnimation}
          leaveAnimation={customLeaveAnimation} >
          <h3 key='title' className='settings-title'>{el.title}</h3>
          {insertHRs(devices, el.type, true)}
          <button
            key='button'
            className='add-button button'
            onClick={(e) => {
              e.stopPropagation()
              this.setState({
                add: el.type
              })
            }}>+ Add</button>
        </FlipMove>
      )
    })
    return (
      <div className={`${this.state.add !== null ? 'add-open' : ''} ${this.props.view.dragging ? 'dragging' : ''} settings`}>
        <div className='settings-container settings-container-add'>
          <div className='settings-inner-container'>
            {this.state.add !== null
              ? Object.keys(schema[this.state.add]).map(item => (
                <button
                  onClick={() => {
                    console.log(this.state.add)
                    const id = generateID()
                    this.props.dispatch({
                      type: 'CREATE_DEVICE',
                      deviceType: this.state.add,
                      value: item,
                      id: id
                    })
                    this.props.dispatch({
                      type: 'ADD_DEVICE_TO_TRACK',
                      track: 0,
                      id: id
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
    devices: state.tracks[0].devices.map(el => state.devices[el]),
    view: state.view
  }
}

export default connect(mapStateToProps)(Settings)
