// RENAME: TrackDevices.jsx
import React, { Component } from "react"
import { connect } from "react-redux"

import FlipMove from "react-flip-move"

import generateID from "utils/generateID"

import {
  KeySynth,
  Sampler,
  Filter,
  StereoPanner,
  Compressor,
  Delay,
  Waveshaper,
  Transpose,
  Chord,
  DisableNotes,
  Button,
} from "components"

import styled from "styled-components"
import vars from "variables"

import schema from "reducers/schema"

const StyledTrackSettings = styled.div`
  display: flex;
  flex-flow: column;
  background-color: var(--bg-recessed);
  border: 1px solid var(--bg-deep);
  color: var(--fg);
  border-radius: var(--radius-large);
  overflow: hidden;
  h2 {
    color: var(--fg-3);
    display: flex;
    justify-content: space-between;
  }
  &.add-open {
    .settings-container-add {
      height: 12rem;
      box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.1);
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
    padding: 1rem 2rem;
  }
  .settings-section {
    position: relative;
  }
  .add-button,
  .settings-title {
    transition: opacity 0.2s ease;
  }
  hr {
    display: block;
    border: 0;
    border-top: 1px solid var(--bg-deep);
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

  .vis {
    position: relative;
    background: var(--bg-deep);
    box-shadow: 0 0 0 1px var(--tick) inset,
      0 -1.5px 0 0 var(--bg-elevated) inset,
      0 40px 20px -30px var(--bg-deepest) inset;
    border-radius: var(--radius);
    * {
      vector-effect: non-scaling-stroke;
    }
  }

  .vis-path {
    overflow: visible;
    stroke: var(--tick);
    fill: none;
    stroke-width: 2px;
    stroke-linejoin: round;
    stroke-linecap: round;
    .graph-axis,
    .grid {
      line,
      path {
        stroke-linecap: butt;
        stroke-width: 0.5px;
      }
    }
    .grid {
      stroke: var(--tick);
      .domain {
        display: none;
      }
    }
  }
  .vis-path--primary {
    stroke: var(--accent);
  }
  .graph-axis {
    font-family: unset;
    font-size: 10px;
    .tick {
      fill: var(--tick);
    }
    text {
      fill: var(--tick);
      stroke: none;
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
  .draggable {
    cursor: ns-resize;
  }

  .sample {
    .frame,
    .loop-bar,
    .loop-marker,
    .start-marker,
    .start-marker-flag {
      stroke-width: 1px;
    }
    .frame {
      stroke: var(--grey-1);
    }
    .start-marker-flag {
      fill: var(--fg-5);
    }
    .sample-text {
      display: none;

      ${vars.mixins.sc};

      font-size: 0.6rem;
      fill: var(--fg-5);
      stroke: none;
    }
    .vis-path {
      margin-bottom: 0.5rem;
      &.empty {
        .empty-text {
          display: block;
        }
        .waveform {
          stroke: var(--fg-5);
        }
      }
      &.dragging {
        background-color: var(--fg-5);
        .drop-text {
          display: block;
        }
        .empty-text {
          display: none;
        }
      }
    }
    .inactive-cover {
      fill: var(--grey-0);
      stroke: var(--grey-0);
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
      color: var(--fg-4);
      margin-left: 1rem;
    }
  }
`

const devicesByName = {
  midi: {
    Transpose: Transpose,
    Chord: Chord,
    DisableNotes: DisableNotes,
  },
  instrument: {
    KeySynth: KeySynth,
    Sampler: Sampler,
  },
  audio: {
    Filter: Filter,
    StereoPanner: StereoPanner,
    Compressor: Compressor,
    Delay: Delay,
    Waveshaper: Waveshaper,
  },
}

const customEnterAnimation = {
  from: { opacity: 0, transform: "scale(0.8, 0.8)" },
  to: { opacity: 1, transform: "scale(1, 1)" },
}
const customLeaveAnimation = {
  from: { opacity: 1, transform: "scale(1, 1)" },
  to: { opacity: 0, transform: "scale(0.8, 0.8)" },
}

class TrackSettings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      add: null,
    }
  }
  render() {
    const chain = [
      { type: "instrument", title: "Instruments" },
      { type: "audio", title: "Audio Effects" },
    ].map((el) => {
      const devices = this.props.devices
        .filter((device) => el.type === device.deviceType)
        .map((device, i) => {
          const ComponentName =
            devicesByName[device.deviceType][device.devicePrototype]
          return (
            <ComponentName
              key={device.id}
              dragging={this.props.view.dragging}
              data={device}
            />
          )
        })
      return devices
    })

    return (
      <StyledTrackSettings
        className={`
          ${this.state.add !== null ? "add-open" : ""}
          ${this.props.view.dragging ? "dragging" : ""}
          settings
        `}
      >
        <div className="settings-container settings-container-add">
          <div className="settings-inner-container">
            {this.state.add !== null
              ? Object.keys(schema[this.state.add]).map((item) => (
                  <Button
                    key={item}
                    className="button add-item-option"
                    onClick={() => {
                      const id = generateID()
                      this.props.dispatch({
                        type: "CREATE_DEVICE",
                        deviceType: this.state.add,
                        value: item,
                        id: id,
                      })
                      this.props.dispatch({
                        type: "ADD_DEVICE_TO_TRACK",
                        track: 0,
                        id: id,
                      })
                    }}
                  >
                    {item}
                  </Button>
                ))
              : ""}
          </div>
        </div>

        <div
          className="settings-container settings-container-main"
          onClick={(e) => {
            this.setState({
              add: null,
              action: null,
            })
          }}
        >
          <div className="settings-inner-container">{chain}</div>
        </div>
      </StyledTrackSettings>
    )
  }
}

function mapStateToProps(state) {
  return {
    devices: state.tracks[0].devices.map((el) => state.devices[el]),
    view: state.view,
  }
}

export default connect(mapStateToProps)(TrackSettings)
