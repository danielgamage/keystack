import React, { Component } from "react"
import { connect } from "react-redux"
import { NumericInput, Icon, Text, Button, RemoveButton } from "components"

import styled from "styled-components"
import vars from "variables"

import sawtoothIcon from "images/wave-sawtooth.svg"
import squareIcon from "images/wave-square.svg"
import triangleIcon from "images/wave-triangle.svg"
import sineIcon from "images/wave-sine.svg"

const waves = {
  sawtooth: sawtoothIcon,
  square: squareIcon,
  triangle: triangleIcon,
  sine: sineIcon,
}

const StyledOscillators = styled.div`
  margin-bottom: 1rem;

  .oscillator-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .text {
      margin-right: 8px;
    }
  }

  .icon--wave {
    display: block;
    width: 1.5rem;
    height: 1.5rem;

    stroke: var(--fg-5);
    fill: none;
  }
  .wave-options {
    display: flex;
    margin-top: 0.2rem;
    gap: 0.2rem;
    padding: 0 0.3rem;
    background: var(--bg-deep);
    border: 1px solid var(--tick);
    border-radius: var(--radius);
  }
  & :checked + .icon {
    stroke: var(--accent);
  }
`

class Oscillators extends Component {
  render() {
    return (
      <StyledOscillators>
        {this.props.oscillators.map((osc, i) => (
          <div className={`osc osc-${i}`} key={i}>
            <div className="wave">
              <header className="oscillator-header">
                <Text className="text" type="h3">
                  {`OSC ${i}`}
                </Text>
                {this.props.oscillators.length > 1 && (
                  <RemoveButton
                    onClick={() => {
                      this.props.dispatch({
                        id: this.props.instrument.id,
                        type: "DELETE_OSC",
                        index: i,
                      })
                    }}
                  />
                )}
              </header>

              <div className="wave-options">
                {["sawtooth", "triangle", "square", "sine"].map(
                  (type, typeIndex) => (
                    <label title={type} key={type}>
                      <input
                        className="hide-input"
                        name={`osc-${this.props.instrument.id}-${i}`}
                        type="radio"
                        value={type}
                        checked={osc.type === type}
                        onChange={(e) => {
                          this.props.dispatch({
                            id: this.props.instrument.id,
                            type: "UPDATE_OSC",
                            property: "type",
                            value: type,
                            index: i,
                          })
                        }}
                      />
                      <Icon className="icon icon--wave" src={waves[type]} />
                    </label>
                  )
                )}
              </div>
            </div>
            <NumericInput
              label="tune"
              className="small"
              id={`detune-${i}`}
              min={-50}
              max={50}
              unit=" ct"
              displayValue={osc.detune}
              value={osc.detune}
              onInput={(event) => {
                this.props.dispatch({
                  id: this.props.instrument.id,
                  type: "UPDATE_OSC",
                  index: i,
                  property: "detune",
                  value: event,
                })
              }}
            />
            <NumericInput
              label="pitch"
              className="small"
              id={`pitch-${i}`}
              min={-48}
              max={48}
              steps={{ default: 1, shiftKey: 12, altKey: 1 }}
              unit=" st"
              displayValue={osc.pitch}
              value={osc.pitch}
              onInput={(event) => {
                this.props.dispatch({
                  id: this.props.instrument.id,
                  type: "UPDATE_OSC",
                  index: i,
                  property: "pitch",
                  value: event,
                })
              }}
            />
            <NumericInput
              label="vol"
              className="small type--volume"
              id={`volume-${i}`}
              min={0}
              max={1}
              steps={{ default: 0.01 }}
              value={osc.volume}
              onInput={(event) => {
                this.props.dispatch({
                  id: this.props.instrument.id,
                  type: "UPDATE_OSC",
                  index: i,
                  property: "volume",
                  value: event,
                })
              }}
            />
          </div>
        ))}
        <Button
          className="button add-osc"
          onClick={() => {
            this.props.dispatch({
              id: this.props.instrument.id,
              type: "ADD_OSC",
            })
          }}
        >
          Add Oscillator
        </Button>
      </StyledOscillators>
    )
  }
}

export default connect()(Oscillators)
