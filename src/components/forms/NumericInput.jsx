import React, { Component, useState, useRef } from "react"
import { connect } from "react-redux"
import { arc } from "d3-shape"
import { scaleLinear, scaleLog } from "d3-scale"
import styled from "styled-components"

import { Text, InputBar, Knob } from "components"

import vars from "variables"

export const StyledNumericInput = styled.div`
  margin: 12px 0 0 0;
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

    ${vars.sc_mixin}
  }
  &.active {
    .fader-knob {
      opacity: 1;
    }
  }
  .fader-knob {
    transition: 0.2s ease;
    fill: ${vars.grey_2};
    opacity: 0;
  }
  .fader-track {
    stroke: ${vars.grey_2};
  }
  .fader-pointer {
    stroke: ${vars.grey_7};
  }
  .fader-value {
    stroke: ${(props) => vars.accents[props.theme.accent][1]};
  }
`

const NumericInput = ({
  className, // string,
  disabled, // bool,
  showLabel = true, // bool,
  label, // string,
  id, // string,
  viz = "knob", // oneOf(['knob','bar',]),

  value, // number,
  displayValue, // oneOfType([string,number,]),
  defaultValue, // number,
  unit, // string,

  min, // number,
  max, // number,
  steps = {}, // object,
  step, // number,
  scale, // number,

  onInput = () => {}, // func,
  ...props
}) => {
  const [showInput, setShowInput] = useState(false)

  const containerElement = useRef(null)
  const vizElement = useRef(null)

  const didMove = useRef(false)

  const handleFocus = (e) => {
    setShowInput(true)

    document.execCommand("selectall", null, false)
  }

  const handleBlur = (e) => {
    setShowInput(false)
  }

  const onMouseDown = (e) => {
    e.preventDefault()

    const isRightClick = e.button === 2 || e.ctrlKey

    if (!isRightClick) {
      e.target.requestPointerLock()

      containerElement.current.classList.add("active")

      document.addEventListener("mousemove", onDrag)
      document.addEventListener("mouseup", onMouseUp)
      document.addEventListener("touchmove", onDrag)
      document.addEventListener("touchend", onMouseUp)

      document.body.classList.add("cursor--lr")
    }
  }

  const onMouseUp = (e) => {
    document.exitPointerLock()

    if (!didMove.current) {
      vizElement.current.inputElement.focus()
    }

    didMove.current = false
    containerElement.current.classList.remove("active")
    document.removeEventListener("mousemove", onDrag)
    document.removeEventListener("mouseup", onMouseUp)
    document.removeEventListener("touchmove", onDrag)
    document.removeEventListener("touchend", onMouseUp)
    document.body.classList.remove("cursor--lr")
  }

  const scaleValue = (v) => {
    const newScale = scale || 1
    if (newScale !== 1) {
      v = Math.log(v) / Math.log(newScale)
    }
    return v
  }

  const unscaleValue = (v) => {
    const newScale = scale || 1
    if (newScale !== 1) {
      v = newScale ** v
    }
    return v
  }

  const handleKeyDown = (e) => {
    let direction
    switch (e.keyCode) {
      case 38: // up
      case 40: // down
        e.preventDefault()

        if (e.keyCode === 38) direction = 1
        if (e.keyCode === 40) direction = -1

        const multiplier = getMultiplier(e)
        const v = shiftValue(direction * multiplier)
        onInput(v)
        break
      case 27: // esc
      case 13: // enter
        vizElement.inputElement.blur()
        break
    }
  }

  const handleInput = (e) => {
    let v = parseFloat(e.target.value)

    if (!isNaN(v)) {
      v = clampValue(v)

      onInput(v)
    }
  }

  const getMultiplier = (e) => {
    if (e.altKey && e.shiftKey) return steps.altShiftKey || 100
    if (e.shiftKey) return steps.shiftKey || 10
    if (e.altKey) return steps.altKey || 0.1
    else return steps.default || 1
  }

  const onDrag = (e) => {
    didMove.current = true

    onInput(shiftValue(e.movementX))
  }

  const shiftValue = (amount) => {
    // why does this have the old `value`
    console.log("shift", value)
    let v = value || 0
    v = scaleValue(v)

    let step = steps.default || 1
    v += amount * (step || 1)
    v = unscaleValue(v)
    v = clampValue(v)
    v = Math.round(v * 100) / 100
    // console.log("shift", value, amount, v)
    return v
  }

  const clampValue = (v) => {
    v = min !== undefined ? Math.max(min, v) : v
    v = max !== undefined ? Math.min(max, v) : v
    return v
  }

  const VizComponent = viz === "knob" ? Knob : InputBar

  console.log({ value })

  return (
    <StyledNumericInput
      {...props}
      showInput={showInput}
      className={`control fader ${className && className} ${
        disabled ? "disabled" : ""
      }`}
      ref={containerElement}
      title={showLabel === false ? label : ""}
    >
      <label id={`${id}-input`} htmlFor={id} className={`ControlTitle`}>
        {showLabel !== false && <Text type="h3">{label}</Text>}
      </label>

      <VizComponent
        {...{
          className,
          disabled,
          showLabel,
          label,
          id,
          viz,
          value,
          displayValue,
          defaultValue,
          unit,
          min,
          max,
          steps,
          step,
          scale,
          onMouseDown,
        }}
        className={className + ` draggable`}
        aria-labelledby={`${id}-input`}
        ref={vizElement}
        onTouchStart={onMouseDown}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />
    </StyledNumericInput>
  )
}

export default NumericInput
