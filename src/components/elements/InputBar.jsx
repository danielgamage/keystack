import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { arc } from 'd3-shape'
import { scaleLinear, scaleLog } from 'd3-scale'
import styled from 'styled-components'

import {
  Text,
  Knob,
} from '@/components'

import vars from '@/variables'

export const StyledInputBar = styled.div`
  position: relative;
  flex: 1;
  height: 1rem;
  border: 1px solid ${vars.grey_2};
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

    opacity: ${props => props.showInput ? 1 : 0};
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
    opacity: ${props => props.showInput ? 0 : 1};
  }
  .progress-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    opacity: 0.5;
    background-color: ${props => vars.grey_2};
  }
`

class InputBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showInput: false
    }
    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.getMultiplier = this.getMultiplier.bind(this)
    this.shiftValue = this.shiftValue.bind(this)
    this.clampValue = this.clampValue.bind(this)
    this.scale = this.scale.bind(this)
    this.unscale = this.unscale.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onChange = this.onChange.bind(this)
    this.initialX = 0
    this.mouseDownX = 0
    this.mouseDownY = 0
  }

  handleFocus (e) {
    this.setState({
      showInput: true
    })

    document.execCommand('selectall', null, false)
  }

  handleBlur (e) {
    this.setState({
      showInput: false
    })
  }

  onMouseDown (e) {
    e.preventDefault()

    const isRightClick = (
      e.button === 2 ||
      e.ctrlKey
    )

    if (!isRightClick) {
      e.target.requestPointerLock()

      this.initialX = e.pageX || e.touches[0].pageX
      this.mouseDownX = e.pageX || e.touches[0].pageX
      this.mouseDownY = e.pageY || e.touches[0].pageY

      this.containerElement.classList.add('active')

      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.onMouseUp)
      document.addEventListener('touchmove', this.onDrag)
      document.addEventListener('touchend', this.onMouseUp)

      document.body.classList.add('cursor--lr')
    }
  }

  onMouseUp (e) {
    document.exitPointerLock()
    const currentMouseDownX = e.pageX || e.touches[0].pageX
    const currentMouseDownY = e.pageY || e.touches[0].pageY

    if (this.mouseDownX === currentMouseDownX && this.mouseDownY === currentMouseDownY) {
      this.inputElement.focus()
    }

    this.containerElement.classList.remove('active')
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('touchmove', this.onDrag)
    document.removeEventListener('touchend', this.onMouseUp)
    document.body.classList.remove('cursor--lr')
  }

  scale (value) {
    const scale = this.props.scale || 1
    if (scale !== 1) {
      value = Math.log(value) / Math.log(scale)
    }
    return value
  }

  unscale (value) {
    const scale = this.props.scale || 1
    if (scale !== 1) {
      value = scale ** value
    }
    return value
  }

  handleKeyDown (e) {
    let direction
    switch (e.keyCode) {
      case 38: // up
      case 40: // down
        e.preventDefault()

        if (e.keyCode === 38) direction = 1
        if (e.keyCode === 40) direction = -1

        const multiplier = this.getMultiplier(e)
        const value = this.shiftValue(direction * multiplier)
        this.props.onInput(value)
        break
      case 27: // esc
      case 13: // enter
        this.inputElement.blur()
        break;
    }
  }

  getMultiplier (e) {
    if (e.altKey && e.shiftKey) return 100
    if (e.shiftKey) return 10
    if (e.altKey) return 0.1
    else return 1
  }

  onDrag (e) {
    let movement

    if (e.movementX !== undefined) {
      movement = e.movementX
    } else {
      if (e.pageX !== undefined) {
        movement = e.pageX - this.initialX
        this.initialX = e.pageX
      } else {
        movement = e.touches[0].pageX - this.initialX
        this.initialX = e.touches[0].pageX
      }
    }

    const value = this.shiftValue(movement)

    this.props.onInput(value)
  }

  shiftValue (amount) {
    let value = this.props.value || 0
    value = this.scale(value)

    let step = this.props.step || 1
    value = (amount * (step || 1)) + value
    value = this.unscale(value)
    value = this.clampValue(value)
    value = Math.round(value * 100) / 100

    return value
  }

  clampValue (value) {
    value = (this.props.min !== undefined) ? Math.max(this.props.min, value) : value
    value = (this.props.max !== undefined) ? Math.min(this.props.max, value) : value
    return value
  }

  onChange (e) {
    let value = parseFloat(e.target.value)
    if (value) {
      value = this.clampValue(value)
      this.props.onInput(value)
    }
  }

  bar (value) {
    const scale = this.props.scale || 1
    let angle

    if (scale !== 1) {
      angle = scaleLog()
        .domain([this.props.min, this.props.max])
        .range([0, 100])
        .base(scale)
    } else {
      angle = scaleLinear()
        .domain([this.props.min, this.props.max])
        .range([0, 100])
    }

    return angle(value)
  }

  render () {
    return (
      <StyledInputBar
        {...this.props}
        showInput={this.state.showInput}
        innerRef={(c) => this.containerElement = c}
        title={this.props.showLabel === false ? this.props.label : ''}
        className='input-output'
        onMouseDown={this.onMouseDown.bind(this)}
        onTouchStart={this.onMouseDown.bind(this)}
      >
        <div
          className='progress-bar'
          style={{
            width: this.bar(this.props.value) + '%',
          }}
        />
        <Text type='value' className='text-items'>
          <output htmlFor={this.props.id}>
            {this.props.displayValue !== undefined
              ? this.props.displayValue
              : this.props.value
            }
            <span className='suffix'>{this.props.unit}</span>
          </output>

          <input
            ref={i => this.inputElement = i}
            id={`${this.props.id}-input`}
            type='number'
            disabled={this.props.disabled}
            inputMode='numeric'
            min={this.props.min}
            max={this.props.max}
            value={this.props.value}
            step={this.props.step}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            defaultValue={this.props.defaultValue}
            onChange={this.onChange.bind(this)}
            onInput={(e) => {e.stopPropagation()}}
          />
        </Text>
      </StyledInputBar>
    )
  }
}

InputBar.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string,
  viz: PropTypes.oneOf([
    'knob',
    'bar',
  ]),

  value: PropTypes.number,
  displayValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  unit: PropTypes.string,

  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  scale: PropTypes.number,

  onInput: PropTypes.func,
}

InputBar.defaultProps = {
  showLabel: true,
  viz: 'knob',

  step: 1,

  onInput: () => {},
}

export default InputBar
