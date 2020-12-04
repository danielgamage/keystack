import React, { useState, useEffect, useRef } from "react"
import { arc } from "d3-shape"
import { scaleLinear, scaleLog } from "d3-scale"
import styled from "styled-components"

import { Text } from "components"

import vars from "variables"

export const StyledKnob = styled.div`
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
  svg {
    display: block;
    margin: 4px 0 4px;
    width: ${(props) => (props.small ? "1.2rem" : "3rem")};
    height: ${(props) => (props.small ? "1.2rem" : "3rem")};
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
    fill: var(--fg-6);
    opacity: 0;
  }
  .fader-track {
    stroke: var(--fg-3);
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
      <svg viewBox="0 0 32 32" aria-labelledby={`${props.id}-input`}>
        <circle
          vectorEffect="non-scaling-stroke"
          className="fader-knob"
          cx={16}
          cy={16}
          r="10"
        />

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

      <div className="input-output">
        <Text type="value" className="text-items">
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
        </Text>
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
