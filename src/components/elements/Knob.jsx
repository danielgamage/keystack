import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { arc } from 'd3-shape'
import { scaleLinear, scaleLog } from 'd3-scale'
import styled from 'styled-components'

import {
  Text
} from '@/components'

import vars from '@/variables'

export const Knob = styled.div`
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

  radiansToDegrees (value) {
    return value * 180 / Math.PI
  }

  render () {
    var arcPath = arc()

    const min = this.angle(this.props.min)
    const max = this.angle(this.props.max)
    const value = this.angle(this.props.value)

    return (
      <Knob
        {...this.props}
        showInput={this.state.showInput}
        innerRef={(c) => this.containerElement = c}
        title={this.props.showLabel === false ? this.props.label : ''}
      >
        <svg
          viewBox='0 0 32 32'
          aria-labelledby={`${this.props.id}-input`}
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
              startAngle: min,
              endAngle: max
            })}
          />

          <path
            vectorEffect='non-scaling-stroke'
            className='fader-value'
            transform='translate(16, 16)'
            d={arcPath({
              innerRadius: 14,
              outerRadius: 14,
              startAngle: min,
              endAngle: value
            })}
          />

          <line
            className='fader-pointer'
            x1='16'
            y1='2'
            x2='16'
            y2='12'
            vectorEffect='non-scaling-stroke'
            transform={`rotate(${this.radiansToDegrees(value)} 16 16)`}
          />
        </svg>

        <div
          className='input-output'
        >
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
              onChange={this.props.onInput}
              onInput={(e) => {e.stopPropagation()}}
            />
          </Text>
        </div>
      </Knob>
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
