// RENAME: TrackDevices.jsx
import React, { Component } from 'react'
import { connect } from 'react-redux'

import FlipMove from 'react-flip-move'

import generateID from '@/utils/generateID'

import {
  KeySynth,
  Sampler,

  Filter,
  StereoPanner,
  Compressor,
  Delay,
  Distortion,

  Transpose,
  Chord,
  DisableNotes,

  Text,
  Button,
} from '@/components'

import vars from '@/variables'

import schema from '@/reducers/schema'

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
  },
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

class TrackSettings extends Component {
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
          leaveAnimation={customLeaveAnimation}
        >
          <Text
            type='h3'
            key='title'
            style={{color: vars.grey_4}}
          >{el.title}</Text>

          {insertHRs(devices, el.type, true)}

          <Button
            key='button'
            style={{
              paddingLeft: '22px',
              paddingRight: '24px',
            }}
            onClick={(e) => {
              e.stopPropagation()
              this.setState({
                add: el.type
              })
            }}
          >+ Add</Button>
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
                  key={item}
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

export default connect(mapStateToProps)(TrackSettings)
