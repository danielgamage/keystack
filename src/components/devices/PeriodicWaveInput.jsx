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
    this.setScales = this.setScales.bind(this)
    this.generateWave = this.generateWave.bind(this)
    this.setWaveform = this.setWaveform.bind(this)

    this.setScales()
    this.setBackground()
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
      Math.floor(((e.clientX - containerBox.left) / containerBox.width) * this.props.resolution),
      0,
      this.props.value.length - 1,
    )

    const selection = this.getSelectionForEvent(e)



    if (this.matchesSelection(itemIndex, selection)) {
      const value = this.clampToRange(
        1 - (e.clientY - containerBox.top) / containerBox.height,
        0,
        1,
      )

      this.updateValue(itemIndex, value)
    }
  }

  generateWave (type) {
    let waveArray = Array(this.props.resolution).fill(0)

    switch (type) {
      case 'sine':
        waveArray[0] = 1
        break
      case 'saw':
        waveArray.map((el, i) => (
          1 / ((i+1) * Math.PI)
        ))
      case 'square':
        waveArray.map((el, i) => (
          this.matchesSelection(i, 'odd')
            ? 1 / ((i+1) * Math.PI)
            : 0
        ))
      default:

    }
  }

  setWaveform (type) {
    this.props.onInput(
      this.generateWave(type)
    )
  }

  getSelectionForEvent (e) {
    if (e.altKey) return 'odd'
    if (e.shiftKey) return 'even'
    return 'all'
  }

  matchesSelection (index, selection) {
    switch (selection) {
      case 'even':
        return index % 2 === 0
        break
      case 'odd':
        return (index + 1) % 2 === 0
        break
      default:
        return true
    }
  }

  setScales () {
    this.y = scaleLinear()
      .domain([0, 1])
      .rangeRound([viewBoxHeight, 0])

    this.x = scaleBand()
      .domain(Array(this.props.resolution).fill().map((el, i) => i))
      .rangeRound([0, viewBoxWidth])
      .paddingInner(0.2)
  }

  setBackground () {
    this.backgrounds = Array(this.props.resolution).fill().map((rect, i) => (
      <rect
        vectorEffect='non-scaling-stroke'
        className='background'
        x={this.x(i)}
        y={0}
        height={viewBoxHeight}
        width={this.x.bandwidth()}
      />
    ))
  }

  min (a, b) {
    return a < b
      ? a
      : b
  }

  max (a, b) {
    return a > b
      ? a
      : b
  }

  clampToRange (value, min, max) {
    return this.min(
      this.max(
        value,
        min
      ),
      max
    )
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.resolution !== nextProps.resolution) {
      this.setScales()
      this.setBackground()
    }
  }

  render () {
    const foregrounds = this.props.value.map((rect, i) => (
      <rect
        vectorEffect='non-scaling-stroke'
        className='value'
        x={this.x(i)}
        y={this.y(rect)}
        height={viewBoxHeight - this.y(rect)}
        width={this.x.bandwidth()}
      />
    ))

    const oscillators = ['sine', 'saw', 'square']

    return (
      <div>
        <WaveformContainer>
          <svg
            className='vis-path'
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            onMouseDown={this.mouseDown.bind(this)}
            ref={(c) => this.containerElement = c}
          >
            {this.backgrounds}
            {foregrounds}
          </svg>
        </WaveformContainer>
        <div>
          {oscillators.map(type => (
            <button
              title={type}
              // onClick={this.setWaveform(type)}
            >{type}</button>
          ))}
        </div>
      </div>
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
