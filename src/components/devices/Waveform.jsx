import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { line, curveBundle } from 'd3-shape'
import { scaleLinear, scaleBand, scalePow } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
import { format } from 'd3-format'

import vars from '@/variables.js'

const viewBoxWidth = 256
const viewBoxHeight = 128

export const WaveformContainer = styled.div`
  padding: 8px;
  background: ${vars.grey_0};
  border-radius: ${vars.radius};

  .background {
    fill: ${vars.grey_1}
  }

  .value {
    fill: ${vars.grey_5}
  }
`

class Waveform extends Component {
  constructor (props) {
    super(props)

    this.updateValue = this.updateValue.bind(this)
    this.mouseDown = this.mouseDown.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.drag = this.drag.bind(this)
  }

  updateValue (index, value) {
    let newValue = [...this.props.value]
    newValue[index] = value

    this.props.onInput(newValue)
  }

  mouseDown (e) {
    console.log('mousedown')

    window.addEventListener('mousemove', this.drag)
    window.addEventListener('mouseup', this.mouseUp)
    this.drag(e)
  }

  mouseUp () {
    console.log('mouseup')

    window.removeEventListener('mousemove', this.drag)
    window.removeEventListener('mouseup', this.mouseUp)
  }

  drag (e) {
    const containerBox = this.containerElement.getBoundingClientRect()

    const itemIndex = this.clampToRange(
      Math.floor(((e.clientX - containerBox.left) / containerBox.width) * this.props.value.length),
      0,
      this.props.value.length - 1,
    )

    const value = this.clampToRange(
      1 - (e.clientY - containerBox.top) / containerBox.height,
      0,
      1,
    )

    this.updateValue(itemIndex, value)
  }

  clampToRange (value, min, max) {
    return Math.min(
      Math.max(
        value,
        min
      ),
      max
    )
  }

  render () {
    const x = scaleBand()
      .domain(this.props.value.map((el, i) => i))
      .rangeRound([0, viewBoxWidth])
      .paddingInner(0.1)

    const y = scaleLinear()
      .domain([0, 1])
      .rangeRound([viewBoxHeight, 0]);

    return (
      <WaveformContainer>
        <svg
          className='vis-path'
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          onMouseDown={this.mouseDown.bind(this)}
          ref={(c) => this.containerElement = c}
        >
          {this.props.value.map((rect, i) => (
            <rect
              vectorEffect='non-scaling-stroke'
              className='background'
              x={x(i)}
              y={0}
              height={viewBoxHeight}
              width={x.bandwidth()}
            />
          ))}
          {this.props.value.map((rect, i) => (
            <rect
              vectorEffect='non-scaling-stroke'
              className='value'
              x={x(i)}
              y={y(rect)}
              height={viewBoxHeight - y(rect)}
              width={x.bandwidth()}
            />
          ))}
        </svg>
      </WaveformContainer>
    )
  }
}


Waveform.propTypes = {
  value: PropTypes.array,

  resolution: PropTypes.oneOf([8, 16, 32, 64]),

  onInput: PropTypes.func,
  onResolution: PropTypes.func,
}

export default Waveform
