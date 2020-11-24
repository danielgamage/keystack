import React, { Component, useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { arc } from "d3-shape"
import { scaleLinear, scaleLog } from "d3-scale"
import styled from "styled-components"

import { Text, Knob } from "components"

import vars from "variables"

export const StyledInputBar = styled.div`
  position: relative;
  flex: 1;
  height: 20px;
  border: 1px solid ${(props) => (props.isFocused ? vars.grey_7 : vars.grey_1)};
  border-bottom-width: 6px;
  cursor: ew-resize;

  .text-items {
    position: relative;
  }
  input,
  output {
    display: block;
    cursor: inherit;
    text-align: center;
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

    &:focus {
      outline: 0;
    }

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
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -6px;
    transform-origin: top left;

    &::before,
    &::after {
      content: "";
      display: block;
      position: absolute;
    }

    &::before {
      top: 0;
      left: 0;
      bottom: 6px;
      right: 0;
      opacity: 0.3;
      background-color: ${(props) => vars.grey_1};
    }

    &::after {
      left: 1px;
      bottom: 2px;
      right: 1px;
      height: 2px;
      background-color: ${(props) => vars.accents[props.theme.accent][0]};
    }
  }
`

const InputBar = (props) => {
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState(props.value)
  const containerElement = useRef(null)
  const inputElement = useRef(null)

  useEffect(() => {
    setInputValue(props.value)
  }, [props.value])

  const handleFocus = (e) => {
    setIsFocused(true)
    setInputValue(props.value)

    document.execCommand("selectall", null, false)
  }

  const handleBlur = (e) => {
    setIsFocused(true)

    props.onInput(e)
  }

  const onChange = (e) => {
    setInputValue(e.target.value)
  }

  const bar = (value) => {
    const scale = props.scale || 1
    let angle

    if (scale !== 1) {
      angle = scaleLog()
        .domain([props.min, props.max])
        .range([0, 100])
        .base(scale)
    } else {
      angle = scaleLinear().domain([props.min, props.max]).range([0, 100])
    }

    return angle(value)
  }

  return (
    <StyledInputBar
      {...props}
      isFocused={isFocused}
      ref={containerElement}
      title={props.showLabel === false ? props.label : ""}
      className="input-output"
    >
      <div
        className="progress-bar"
        style={{
          transform: `scaleX(${bar(props.value) / 100})`,
        }}
      />
      <Text type="value" className="text-items">
        <output htmlFor={props.id}>
          {props.displayValue !== undefined ? props.displayValue : props.value}
          <span className="suffix">{props.unit}</span>
        </output>

        <input
          ref={inputElement}
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
    </StyledInputBar>
  )
}

// InputBar.propTypes = {
//   className: PropTypes.string,
//   disabled: PropTypes.bool,
//   showLabel: PropTypes.bool,
//   label: PropTypes.string,
//   id: PropTypes.string,
//   viz: PropTypes.oneOf(["knob", "bar"]),

//   value: PropTypes.number,
//   displayValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   unit: PropTypes.string,

//   min: PropTypes.number,
//   max: PropTypes.number,
//   steps: PropTypes.object,
//   scale: PropTypes.number,

//   onInput: PropTypes.func,
// }

// InputBar.defaultProps = {
//   showLabel: true,
//   viz: "knob",

//   steps: {},

//   onInput: () => {},
// }

export default InputBar
