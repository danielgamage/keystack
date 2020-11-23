import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { line, curveBundle } from 'd3-shape'
import { scaleLinear, scaleBand, scalePow } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
import { format } from 'd3-format'

import vars from 'variables.js'

const viewBoxWidth = 256
const viewBoxHeight = 64
const marginLeft = 24
const marginRight = 24

export const EchoContainer = styled.div`
  padding: 0 0 10%;
  border-radius: ${vars.radius};

  svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .background {
    fill: ${vars.grey_1}
  }

  .value {
    fill: ${vars.grey_5}
  }

  .grid-line {
    fill: none;
    stroke: #5A5A5F;
    stroke-width: 1;
    stroke-linecap: round;
    stroke-miterlimit: 10;
    &.weak {
      stroke-dasharray: 6;
    }
  }
  .st1,
  .st2 {
    stroke: ${props => vars.accents[props.theme.accent][1]};
    stroke-width: 2;
    stroke-linecap: round;
    stroke-miterlimit: 10;
    fill: none;

    &.first {
      stroke: ${vars.grey_6}
    }
  }
  .st1 {
    opacity: 0.3;
  }
  .st2 {
    stroke-width: 2;
    stroke-linecap: round;
    stroke-miterlimit: 10;
  }
  .handle{
    fill: #B3B3B3;
    stroke: #B3B3B3;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-miterlimit: 10;
  }

  .graph-axis {
    line, path {
      stroke: ${vars.grey_4};
      stroke-width: 1px;
    }
    text {
      font-size: 10px;
      fill: ${vars.grey_4};
    }
  }
`

class Echo extends Component {
  constructor (props) {
    super(props)

    this.updateValue = this.updateValue.bind(this)
    this.mouseDown = this.mouseDown.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.drag = this.drag.bind(this)

    this.setScales()
  }

  componentDidMount () {
    this.renderAxes()
  }

  updateValue (index, value) {
    let newValue = [...this.props.value]
    newValue[index] = value

    // this.props.onInput(newValue)
  }

  //
  //
  //

  mouseDown (e) {
    window.addEventListener('mousemove', this.drag)
    window.addEventListener('mouseup', this.mouseUp)
    this.drag(e)
  }

  mouseUp () {
    window.removeEventListener('mousemove', this.drag)
    window.removeEventListener('mouseup', this.mouseUp)
  }

  //
  //
  //

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

  getDelayCount () {
    let delayIndex = 0
    let size = 1

    while (size > 0.01) {
      size = Math.pow(this.props.feedback, delayIndex)
      delayIndex++
    }

    return delayIndex
  }

  setScales () {
    this.sizeScale = scaleLinear()
      .domain([0, viewBoxHeight])
      .range([0.1, 1])
    this.delayCount = this.getDelayCount()
    this.xScale = scaleLinear()
      .domain([0, (this.delayCount * this.props.delayTime)])
      .range([0, viewBoxWidth - marginLeft - marginRight])
  }

  //
  //
  //

  renderAxes () {
    const formatSeconds = format('.1r')

    const xAxis = axisBottom()
      .scale(this.xScale)
      .ticks(5)
      .tickFormat(d => formatSeconds(d) + 's')
      .tickSizeOuter([6])
      .tickSizeInner([2])

    const axis = select(`.axis-x[data-id="${this.props.id}"]`)
      .call(xAxis.tickSize('5'))
      .selectAll('*')
        .attr('vector-effect', 'non-scaling-stroke')
  }

  //
  //
  //

  render () {
    this.setScales()
    this.renderAxes()

    const delays = Array(this.delayCount + 1).fill().map((el, i) => {
      if (i === 0) return {
        offset: 0,
        size: this.sizeScale(viewBoxHeight * (1 - this.props.mix))
      }

      else return {
        offset: this.xScale(i * this.props.delayTime),
        size: this.sizeScale(viewBoxHeight * this.props.mix * (Math.pow(this.props.feedback, (i - 1))))
      }
    }).reverse()

    return (
      <EchoContainer>
        <svg x="0px" y="0px" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
          <g>
            {/* horizontal */}
            <line
              className="grid-line"
              vectorEffect='non-scaling-stroke'
              x1={0} y1={viewBoxHeight} x2={viewBoxWidth} y2={viewBoxHeight}
            />
            <line
              className="grid-line"
              vectorEffect='non-scaling-stroke'
              x1={0} y1="0" x2={viewBoxWidth} y2="0"
            />


            {/* vertical */}
            <line
              className="grid-line"
              vectorEffect='non-scaling-stroke'
              x1={0} y1={0} x2={0} y2={viewBoxHeight}
            />
            <line
              className="grid-line"
              vectorEffect='non-scaling-stroke'
              x1={viewBoxWidth} y1={0} x2={viewBoxWidth} y2={viewBoxHeight}
            />

            {delays.map((el, i, arr) => (
              <g transform={`translate(${el.offset} 0)`} key={i}>
                <line
                  className="grid-line weak"
                  vectorEffect='non-scaling-stroke'
                  x1={marginLeft} y1="0" x2={marginLeft} y2={viewBoxHeight}
                  style={{opacity: (i * 0.8 / arr.length) + 0.2}}
                />
              </g>
            ))}
          </g>

          <g>
            {delays.map((el, i, arr) => (
              <g transform={`translate(${el.offset} 0)`} key={i}>
                <g>
                  <ellipse
                    className="handle"
                    vectorEffect='non-scaling-stroke'
                    cx={marginLeft} cy={viewBoxHeight / 2} rx="1" ry="2.5"
                  />
                </g>

                <g
                  transform={`
                    translate(${marginLeft} ${viewBoxHeight / 2})
                    scale(${el.size / 2})
                    translate(-32 -${viewBoxHeight})
                  `}
                >
                  <path
                    className={"st1 " + (i == arr.length - 1 ? 'first' : '')}
                    vectorEffect='non-scaling-stroke'
                    d="M32,120C18.7,120,8,94.9,8,64S18.7,8,32,8"
                  />
                	<path
                    className={"st2 " + (i == arr.length - 1 ? 'first' : '')}
                    vectorEffect='non-scaling-stroke'
                    d="M32,8c13.3,0,24,25.1,24,56s-10.7,56-24,56"
                  />
                </g>
              </g>
            ))}
          </g>

          <g
            className='graph-axis axis-x'
            data-id={this.props.id}
            transform={`translate(${marginLeft}, ${viewBoxHeight})`}
          />
        </svg>
      </EchoContainer>
    )
  }
}


Echo.propTypes = {
  delayTime: PropTypes.number, // seconds
  feedback: PropTypes.number,
  mix: PropTypes.number,

  onInput: PropTypes.func,
  onResolution: PropTypes.func,
}

export default Echo
