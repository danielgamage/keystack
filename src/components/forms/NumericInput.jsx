import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { arc } from 'd3-shape'
import { scaleLinear, scaleLog } from 'd3-scale'
import styled from 'styled-components'

import {
  Text,
  InputBar,
  Knob,
} from '@/components'

import vars from '@/variables'

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
  svg {
    display: block;
    margin: 0.4rem 0 0.2rem;
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
    stroke: ${props => vars.accents[props.theme.accent][1]}
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
    this.clampValue = this.clampValue.bind(this)
    this.scale = this.scale.bind(this)
    this.unscale = this.unscale.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onChange = this.onChange.bind(this)

    this.initialX = 0
    this.didMove = false
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

    if (!this.didMove) {
      this.vizElement.inputElement.focus()
    }

    this.didMove = false
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
    this.didMove = true

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

  radiansToDegrees (value) {
    return value * 180 / Math.PI
  }

  render () {
    const VizComponent = this.props.viz === 'knob'
      ? Knob
      : InputBar

    return (
      <StyledNumericInput
        {...this.props}
        showInput={this.state.showInput}
        className={`control fader ${this.props.className && this.props.className} ${this.props.disabled ? 'disabled' : ''}`}
        innerRef={(c) => this.containerElement = c}
        title={this.props.showLabel === false ? this.props.label : ''}
      >
        <label
          id={`${this.props.id}-input`}
          htmlFor={this.props.id}
          className={`ControlTitle`}
          >
          {this.props.showLabel !== false &&
            <Text type='h3'>
              {this.props.label}
            </Text>
          }
        </label>

        <VizComponent
          {...this.props}
          className={`draggable`}
          aria-labelledby={`${this.props.id}-input`}
          onMouseDown={this.onMouseDown.bind(this)}
          ref={(c) => this.vizElement = c}
          onTouchStart={this.onMouseDown.bind(this)}
        />
      </StyledNumericInput>
    )
  }
}

NumericInput.propTypes = {
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

NumericInput.defaultProps = {
  showLabel: true,
  viz: 'knob',

  step: 1,

  onInput: () => {},
}

export default NumericInput
