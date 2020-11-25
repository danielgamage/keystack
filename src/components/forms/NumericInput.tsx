import React, { Component, useState, useRef } from "react"
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
    fill: var(--grey-2);
    opacity: 0;
  }
  .fader-track {
    stroke: var(--grey-2);
  }
  .fader-pointer {
    stroke: var(--grey-7);
  }
  .fader-value {
    stroke: var(--accent);
  }
`

const NumericInput = (props: {
  className?: string
  disabled?: boolean
  showLabel?: boolean
  label?: string
  id?: string
  viz?: "knob" | "bar"

  value?: number
  displayValue?: string | number
  defaultValue?: number
  unit?: string

  min?: number
  max?: number
  steps: {
    altShiftKey?: number
    shiftKey?: number
    altKey?: number
    default?: number
  }
  step?: number
  scale?: number

  onInput: (value: number) => void
}) => {
  const [showInput, setShowInput] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const containerElement = useRef<any>(null)
  const inputRef = useRef<HTMLElement>(null)

  const didMove = useRef(false)
  const currentValue = useRef(props.value)

  const handleFocus = (e: FocusEvent) => {
    setShowInput(true)

    document.execCommand("selectall", true, undefined)
  }

  const handleBlur = (e: FocusEvent) => {
    setShowInput(false)
  }

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault()

    const isRightClick = e.button === 2 || e.ctrlKey

    if (!isRightClick) {
      ;(e.target as any).requestPointerLock()

      setIsActive(true)

      document.addEventListener("mousemove", onDrag)
      document.addEventListener("mouseup", onMouseUp)
      document.addEventListener("touchmove", onDrag)
      document.addEventListener("touchend", onMouseUp)

      document.body.classList.add("cursor--lr")
    }
  }

  const onMouseUp = (e: MouseEvent | TouchEvent) => {
    document.exitPointerLock()

    if (!didMove.current) {
      inputRef.current!.focus()
    }

    didMove.current = false
    setIsActive(false)
    document.removeEventListener("mousemove", onDrag)
    document.removeEventListener("mouseup", onMouseUp)
    document.removeEventListener("touchmove", onDrag)
    document.removeEventListener("touchend", onMouseUp)
    document.body.classList.remove("cursor--lr")
  }

  const scaleValue = (v: number) => {
    const newScale = props.scale || 1
    if (newScale !== 1) {
      v = Math.log(v) / Math.log(newScale)
    }
    return v
  }

  const unscaleValue = (v: number) => {
    const newScale = props.scale || 1
    if (newScale !== 1) {
      v = newScale ** v
    }
    return v
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    let direction = 1
    switch (e.code) {
      case "ArrowUp":
      case "ArrowDown":
        e.preventDefault()

        if (e.code === "ArrowUp") direction = 1
        if (e.code === "ArrowDown") direction = -1

        const multiplier = getMultiplier(e)
        const v = shiftValue(direction * multiplier)
        props.onInput(v)
        break
      case "Escape":
      case "Enter":
        inputRef.current!.blur()
        break
    }
  }

  const handleInput = (e: any) => {
    let v = parseFloat(e.target!.value)

    if (!isNaN(v)) {
      v = clampValue(v)

      props.onInput(v)
    }
  }

  const getMultiplier = (e: KeyboardEvent) => {
    if (e.altKey && e.shiftKey) return props.steps.altShiftKey || 100
    if (e.shiftKey) return props.steps.shiftKey || 10
    if (e.altKey) return props.steps.altKey || 0.1
    else return props.steps.default || 1
  }

  const onDrag = (e: MouseEvent | TouchEvent) => {
    didMove.current = true
    props.onInput(shiftValue((e as any).movementX))
    currentValue.current = shiftValue((e as any).movementX)
  }

  const shiftValue = (amount: number) => {
    let v = currentValue.current || props.value || 0
    v = scaleValue(v)

    let step = props.steps.default || 1
    v += amount * (step || 1)
    v = unscaleValue(v)
    v = clampValue(v)
    v = Math.round(v * 100) / 100

    return v
  }

  const clampValue = (v: number) => {
    v = props.min !== undefined ? Math.max(props.min, v) : v
    v = props.max !== undefined ? Math.min(props.max, v) : v
    return v
  }

  const VizComponent = props.viz === "knob" ? Knob : InputBar

  return (
    <StyledNumericInput
      className={`control fader ${props.className} ${
        props.disabled ? "disabled" : ""
      } ${isActive && "active"}`}
      ref={containerElement!}
      title={props.showLabel === false ? props.label : ""}
    >
      <label
        id={`${props.id}-input`}
        htmlFor={props.id}
        className={`ControlTitle`}
      >
        {props.showLabel !== false && <Text type="h3">{props.label}</Text>}
      </label>

      <VizComponent
        {...props}
        onMouseDown={onMouseDown}
        className={props.className + ` draggable`}
        aria-labelledby={`${props.id}-input`}
        inputRef={inputRef}
        onTouchStart={onMouseDown}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
      />
    </StyledNumericInput>
  )
}

NumericInput.defaultProps = {
  showLabel: true,
  viz: "knob",
  steps: {},
  onInput: () => {},
}
export default NumericInput
