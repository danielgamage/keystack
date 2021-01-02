import React, { useState, useEffect, useRef } from "react"
import { arc } from "d3-shape"
import { scaleLinear, scaleLog } from "d3-scale"
import styled from "styled-components"

export const StyledKnob = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  --width: 3rem;
  --height: calc(var(--size) * 26 / 32);
  &.small {
    --width: 1.2rem;
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
  .svg-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  svg {
    display: block;
    width: var(--width);
    height: 100%;
  }
  &.active {
    .fader-knob {
      background: var(--bg-elevated);
    }
  }
  .fader-knob {
    border-radius: 4rem;
    position: absolute;
    width: calc(var(--width) - 12px);
    height: calc(var(--width) - 12px);
    top: calc(var(--width) / 2);
    left: calc(var(--width) / 2);
    min-width: 0.9rem;
    min-height: 0.9rem;
    transform: translate(-50%, -50%);
    transition: 0.2s ease;
    .theme--light & {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3),
        0 1px 0 -0.5px rgba(255, 255, 255, 0.5) inset,
        0 -4px 10px -4px rgba(0, 0, 0, 0.1) inset;
    }
    .theme--dark & {
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5),
        0 1px 0 -0.5px rgba(255, 255, 255, 0.2) inset,
        0 -4px 10px -4px rgba(0, 0, 0, 0.3) inset;
    }
  }
  .fader-track {
    stroke: var(--fg-7);
  }
  .fader-pointer {
    stroke: var(--fg-1);
  }
  .fader-value {
    stroke: var(--accent);
  }
  .input-output {
    position: relative;
    flex: 1;
    height: 1rem;

    .text-items {
      position: relative;
    }
    input,
    output {
      display: block;
    }
    input {
      position: absolute;
      display: block;
      width: calc(100% + 1rem);
      border: none;
      padding: 0;
      flex: 1;

      padding: 5px 0.5rem;
      top: -0.3rem;
      left: -0.5rem;
      bottom: -0.3rem;
      right: -0.5rem;
      height: 22px;

      opacity: ${(props) => (props.isFocused ? 1 : 0)};
      appearance: none;
      background: none;
      color: inherit;

      -moz-appearance: textfield;
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
    output {
      opacity: ${(props) => (props.isFocused ? 0 : 1)};
    }
  }
`

const Knob = (props) => {
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState(props.value)
  const containerElement = useRef(null)

  useEffect(() => {
    console.log("knob", props.value)
    setInputValue(props.value)
  }, [props.value])

  const handleFocus = (e) => {
    setIsFocused(true)
    setInputValue(props.value)

    document.execCommand("selectall", null, false)
  }

  const handleBlur = (e) => {
    setIsFocused(false)

    props.onInput(e)
  }

  const onChange = (e) => {
    setInputValue(e.target.value)
  }

  const getAngle = (value) => {
    const scale = props.scale || 1
    let angle

    if (scale !== 1) {
      angle = scaleLog()
        .domain([props.min, props.max])
        .range([(Math.PI / 2) * 2.5, (Math.PI / 2) * 5.5])
        .base(scale)
    } else {
      angle = scaleLinear()
        .domain([props.min, props.max])
        .range([(Math.PI / 2) * 2.5, (Math.PI / 2) * 5.5])
    }

    return angle(value)
  }

  const radiansToDegrees = (value) => {
    return (value * 180) / Math.PI
  }

  var arcPath = arc()

  const min = getAngle(props.min)
  const max = getAngle(props.max)
  const value = getAngle(props.value)

  return (
    <StyledKnob
      {...props}
      className={props.className}
      isFocused={isFocused}
      ref={containerElement}
      title={props.showLabel === false ? props.label : ""}
    >
      <div className="svg-wrapper">
        <div className="fader-knob"></div>
        <svg viewBox="0 0 32 26" aria-labelledby={`${props.id}-input`}>
          <path
            vectorEffect="non-scaling-stroke"
            className="fader-track"
            transform="translate(16, 16)"
            d={arcPath({
              innerRadius: 14,
              outerRadius: 14,
              startAngle: min,
              endAngle: max,
            })}
          />

          <path
            vectorEffect="non-scaling-stroke"
            className="fader-value"
            transform="translate(16, 16)"
            d={arcPath({
              innerRadius: 14,
              outerRadius: 14,
              startAngle: min,
              endAngle: value,
            })}
          />

          <line
            className="fader-pointer"
            x1="16"
            y1="2"
            x2="16"
            y2="12"
            vectorEffect="non-scaling-stroke"
            transform={`rotate(${radiansToDegrees(value)} 16 16)`}
          />
        </svg>
      </div>

      <div className="input-output">
        <div className="value text-items">
          <output htmlFor={props.id}>
            {props.displayValue !== undefined
              ? props.displayValue
              : props.value}
            <span className="suffix">{props.unit}</span>
          </output>

          <input
            ref={props.inputRef}
            id={`${props.id}-input`}
            type="number"
            disabled={props.disabled}
            inputMode="numeric"
            min={props.min}
            max={props.max}
            value={inputValue}
            step={props.steps.default || 1}
            onFocus={handleFocus}
            onBlur={handleBlur}
            defaultValue={props.defaultValue}
            onChange={onChange}
            onInput={(e) => {
              e.stopPropagation()
            }}
          />
        </div>
      </div>
    </StyledKnob>
  )
}

Knob.defaultProps = {
  showLabel: true,
  viz: "knob",

  steps: {},

  onInput: () => {},
}

export default Knob
