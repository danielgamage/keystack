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

import styled, { ThemeProvider } from 'styled-components'
import vars from '@/variables'

import schema from '@/reducers/schema'

const StyledTrackSettings = styled.div`
  display: flex;
  flex-flow: column;
  background-color: ${props => props.theme.lightness === 'light'
    ? vars.grey_0
    : vars.black
  };
  color: ${vars.grey_6};
  border-radius: $radius;
  &.add-open {
    .settings-container-add {
      height: 12rem;
      box-shadow: 0 1rem 1rem rgba(0,0,0,0.1);
    }
  }
  &.dragging {
    .add-button,
    .settings-title {
      opacity: 0;
    }
  }
  .settings-container {
    overflow: scroll;
    transition: height 0.2s ease, max-height 0.2s ease, box-shadow 0.2s ease;
  }
  .settings-container-main {
    flex: 1 1 1rem;
  }
  .settings-container-add {
    height: 0;
    position: relative;
    z-index: 1;
  }
  .settings-inner-container {
    padding: 2rem;
  }
  .settings-section{
    position: relative;
  }
  .add-button,
  .settings-title {
    transition: opacity 0.2s ease;
  }
  .settings-title {
    @extend %sc;
    margin: 0;
    color: ${vars.grey_2};
  }
  hr {
    display: block;
    border: 0;
    border-top: 2px solid ${vars.grey_1};
    margin: 0;
    &.edge {
      opacity: 0;
    }
    &.big {
      margin: 2rem -2rem;
    }
  }
  .add-button {
    @extend %sc;
    width: 5rem;
  }
  .add-item-option {
    display: block;
    margin-bottom: 0.25rem;
    &:hover {
      color: ${props => vars.accents[props.theme.accent].light};
    }
  }
  .add-item-toggle {
    width: 2rem;
    margin: auto;
    text-align: center;
    font-weight: 700;
  }

  .osc {
    display: flex;
    line-height: 2rem;
    .title {
      margin-right: 1rem;
      display: block;
      @extend %sc;
    }
    .fader {
      margin: 0 0 0 1rem;
      flex: 1;
    }
  }

  .midi-manufacturer {
    margin-right: 0.5rem;
  }
  .midi-manufacturer {
    font-family: $sc;
    text-transform: lowercase;
    color: $orange-bright;
  }

  .vis-path {
    overflow: visible;
    margin: 1rem 0 2rem;
    stroke: ${vars.grey_4};
    fill: none;
    stroke-width: 2px;
    stroke-linejoin: round;
    stroke-linecap: round;
    .graph-axis,
    .grid {
      line,
      path {
        stroke-linecap: butt;
        stroke-width: 1px;
      }
    }
    .grid {
      opacity: 0.5;
      .domain {
        display: none;
      }
      stroke: ${vars.grey_1};
    }
  }
  .graph-axis {
    font-family: unset;
    font-size: 10px;
    .tick {
      fill: ${vars.grey_4};
    }
    text {
      fill: ${vars.grey_4};
      stroke: none;
    }
  }
  .filter-phase {
    stroke: ${vars.grey_1};
  }
  .envelope {
    .vis-path {
      padding: 0.5rem;
      fill: unset;
    }
    .dot {
      fill: ${vars.grey_0};
    }
  }
  .compressor-container {
    display: flex;
    .vis {
      margin-right: 2rem;
    }
    .vis-path {
      margin: 0 0 1rem;
    }
    .flex-container {
      .control {
        width: 50%;
      }
    }
  }
  .flex-container {
    display: flex;
    flex-flow: row wrap;
    margin-top: -1rem;
  }
  .fader {
    margin: 1rem 0 0 0;
    &.small {
      svg {
        width: 1.2rem;
        height: 1.2rem;
      }
    }
    &.right {
      display: flex;
      align-items: center;
      flex-flow: row wrap;
      svg {
        display: inline-block;
        margin-right: 0.5rem;
      }
    }
    &.disabled {
      opacity: 0.1;
      pointer-events: none;
    }
    label {
      display: block;
      width: 100%;
      @extend %sc;
    }
    svg {
      display: block;
      margin: 0.5rem 0 0.2rem;
      width: 3rem;
      height: 3rem;
      &:hover {
        .fader-knob {
          opacity: 1;
        }
      }
    }
    &.active {
      .fader-knob {
        opacity: 1;
      }
    }
    .fader-knob {
      transition: 0.2s ease;
      fill: ${vars.grey_1};
      opacity: 0;
    }
    .fader-track {
      stroke: ${vars.grey_1};
    }
    .fader-value {
      stroke: ${vars.grey_6};
    }
  }
  .draggable {
    cursor: ew-resize;
  }
  .tri {
    width: calc(100% / 3);
  }
  .quad {
    width: calc(100% / 4);
  }
  .six {
    width: calc(100% / 6);
  }
  input {
    width: 100%;
  }

  .sample{
    .frame,
    .loop-bar,
    .loop-marker,
    .start-marker,
    .start-marker-flag {
      stroke-width: 1px;
    }
    .frame {
      stroke: ${vars.grey_1};
    }
    .start-marker-flag {
      fill: ${vars.grey_4};
    }
    .sample-text {
      display: none;

      ${vars.mixins.sc};

      font-size: 0.6rem;
      fill: ${vars.grey_4};
      stroke: none;
    }
    .vis-path {
      margin-bottom: 0.5rem;
      &.empty {
        .empty-text {
          display: block;
        }
        .waveform {
          stroke: ${vars.grey_1};
        }
      }
      &.dragging {
        background-color: ${vars.grey_1};
        .drop-text {
          display: block;
        }
        .empty-text {
          display: none;
        }
      }
    }
    .inactive-cover {
      fill: ${vars.grey_0};
      stroke: ${vars.grey_0};
      opacity: 0.9;
    }
  }
  .sample-info {
    ${vars.mixins.sc};

    display: flex;
    white-space: nowrap;
    margin-bottom: 1rem;
    .name {
      overflow: scroll;
    }
    .size {
      color: ${vars.grey_3};
      margin-left: 1rem;
    }
  }
`

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
      <StyledTrackSettings
        className={`
          ${this.state.add !== null ? 'add-open' : ''}
          ${this.props.view.dragging ? 'dragging' : ''}
          settings
        `}
      >
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
      </StyledTrackSettings>
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
