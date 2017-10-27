import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { arc } from 'd3-shape'
import { scaleLinear, scaleLog } from 'd3-scale'
import styled from 'styled-components'

import vars from '@/variables'

export const Fader = styled.div`
  margin: 1rem 0 0 0;
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
  svg {
    display: block;
    margin: 0.5rem 0 0.2rem;
    width: ${props => props.small ? '1.2rem' : '3rem'};
    height: ${props => props.small ? '1.2rem' : '3rem'};
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
  .input-output {
    position: relative;
    flex: 1;
    height: 1rem;
    input,
    output {
      ${vars.sc_mixin}
      display: block;
      opacity: 0;
      &.active {
        opacity: 1;
      }
    }
    input {
      position: absolute;
      padding: 0.3rem 0.5rem;
      top: -0.3rem;
      left: -0.5rem;
      bottom: -0.3rem;
      right: -0.5rem;
    }
  }
  input {
    display: block;
    appearance: none;
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    flex: 1;
  }
`

class NumericInput extends Component {
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
  }
  handleBlur (e) {
    this.setState({
      showInput: false
    })
  }
  onMouseDown (e) {
    e.preventDefault()
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
  onMouseUp (e) {
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
    if (e.keyCode === 38 || e.keyCode === 40) {
      if (e.keyCode === 38) { // up
        e.preventDefault()
        direction = 1
      }
      if (e.keyCode === 40) { // down
        e.preventDefault()
        direction = -1
      }

      const multiplier = this.getMultiplier(e)

      const value = this.shiftValue(direction * multiplier)

      this.props.onUpdate(value, 'value')
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

    this.props.onUpdate(value, 'value')
  }
  shiftValue (amount) {
    let value = this.props.value || 0

    value = this.scale(value)

    let step = this.props.step || 1
    value = (amount * (step || 1)) + value
    value = this.unscale(value)
    value = (this.props.min !== undefined) ? Math.max(this.props.min, value) : value
    value = (this.props.max !== undefined) ? Math.min(this.props.max, value) : value
    value = Math.round(value * 100) / 100

    return value
  }
  onChange (e) {
    const value = parseFloat(e.target.value)
    this.props.onUpdate(value)
  }
  angle (value) {
    const scale = this.props.scale || 1
    let angle
    if (scale !== 1) {
      angle = scaleLog()
        .domain([this.props.min, this.props.max])
        .range([Math.PI / 2 * 2.5, Math.PI / 2 * 5.5])
        .base(scale)
    } else {
      angle = scaleLinear()
        .domain([this.props.min, this.props.max])
        .range([Math.PI / 2 * 2.5, Math.PI / 2 * 5.5])
    }
    return angle(value)
  }
  render () {
    var arcPath = arc()

    return (
      <Fader
        {...this.props}
        className={`control fader ${this.props.className && this.props.className} ${this.props.disabled ? 'disabled' : ''}`}
        innerRef={(c) => this.containerElement = c}
        title={this.props.showLabel === false ? this.props.label : ''} >
        <label
          id={`${this.props.id}-input`}
          htmlFor={this.props.id}
          className={`ControlTitle`}
          >
          {this.props.showLabel !== false &&
            <span className='label-text'>{this.props.label}</span>
          }
        </label>
        <svg
          viewBox='0 0 32 32'
          className={`draggable`}
          aria-labelledby={`${this.props.id}-input`}
          onMouseDown={this.onMouseDown.bind(this)}
          onTouchStart={this.onMouseDown.bind(this)}
          >
          <circle
            vectorEffect='non-scaling-stroke'
            className='fader-knob'
            cx={16}
            cy={16}
            r='10'
            />
          <path
            vectorEffect='non-scaling-stroke'
            className='fader-track'
            transform='translate(16, 16)'
            d={arcPath({
              innerRadius: 14,
              outerRadius: 14,
              startAngle: this.angle(this.props.min),
              endAngle: this.angle(this.props.max)
            })}
            />
          <path
            vectorEffect='non-scaling-stroke'
            className='fader-value'
            transform='translate(16, 16)'
            d={arcPath({
              innerRadius: 14,
              outerRadius: 14,
              startAngle: this.angle(this.props.min),
              endAngle: this.angle(this.props.value)
            })}
            />
        </svg>
        <div className='input-output'>
          <output
            htmlFor={this.props.id}
            className={!this.state.showInput && 'active'}
            >
            {this.props.displayValue !== undefined ? this.props.displayValue : this.props.value}
            <span className='suffix'>{this.props.unit}</span>
          </output>
          <input
            ref={i => this.inputElement = i}
            className={this.state.showInput && 'active'}
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
            />
        </div>
      </Fader>
    )
  }
}

NumericInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string,

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

  onUpdate: PropTypes.func,
}

export default NumericInput
