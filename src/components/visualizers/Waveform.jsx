import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import styled from "styled-components"

import { line, curveBundle } from "d3-shape"
import { scaleLinear, scaleBand, scalePow } from "d3-scale"
import { axisBottom, axisLeft } from "d3-axis"
import { select } from "d3-selection"
import { format } from "d3-format"

import vars from "variables.js"

const viewBoxWidth = 256
const viewBoxHeight = 128

export const WaveformContainer = styled.div`
  padding: 8px;
  background: var(--fg-1);
  border-radius: var(--radius);

  .background {
    fill: var(--fg-1);
  }

  .value {
    fill: var(--fg-4);
  }
`

class Waveform extends Component {
  constructor(props) {
    super(props)

    this.drawWave = this.drawWave.bind(this)
    this.loop = this.loop.bind(this)
    this.mouseDown = this.mouseDown.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
  }

  componentWillMount() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.audioContext = new window.AudioContext()

    this.masterGain = this.audioContext.createGain()
    this.analyser = this.audioContext.createAnalyser()

    this.masterGain.connect(this.analyser)
    this.analyser.connect(this.audioContext.destination)

    this.isPlaying = false
  }

  componentDidMount() {
    var canvas = document.getElementById("scope")
    this.canvasContext = canvas.getContext("2d")

    canvas.height = 200
    canvas.width = 600

    this.canvasContext.moveTo(0, 100.5)
    this.canvasContext.lineTo(this.canvasContext.width, 100.5)
    this.canvasContext.stroke()
    canvas.style.backgroundImage = "url(" + canvas.toDataURL() + ")"

    this.drawWave(this.analyser)

    document
      .querySelector("button.start")
      .addEventListener("mousedown", this.mouseDown)
    document
      .querySelector("button.start")
      .addEventListener("mouseup", this.mouseUp)
  }

  mouseDown() {
    this.osc = this.audioContext.createOscillator()

    this.osc.frequency.value = 220
    var imag = new Float32Array([0, ...this.props.value]) // sine
    var real = new Float32Array(imag.length) // cos
    var customWave = this.audioContext.createPeriodicWave(real, imag) // cos,sine
    this.osc.setPeriodicWave(customWave)

    this.osc.connect(this.masterGain)
    this.osc.start()
    this.isPlaying = true

    this.drawWave(this.analyser)
  }

  mouseUp() {
    this.isPlaying = false
    this.osc.stop()
  }

  drawWave() {
    this.buffer = new Float32Array(512)
    this.w = this.canvasContext.canvas.width

    this.canvasContext.strokeStyle = vars.orange
    this.canvasContext.setTransform(1, 0, 0, -1, 0, 100.5) // flip y-axis and translate to center
    this.canvasContext.lineWidth = 2

    this.loop()
  }

  loop() {
    this.analyser.getFloatTimeDomainData(this.buffer)

    this.canvasContext.clearRect(
      0,
      -100,
      this.w,
      this.canvasContext.canvas.height
    )

    this.canvasContext.beginPath()
    this.canvasContext.moveTo(0, this.buffer[0] * 90)

    for (var x = 2; x < this.w; x += 2) {
      this.canvasContext.lineTo(x, this.buffer[x] * 90)
    }

    this.canvasContext.stroke()

    if (this.isPlaying) requestAnimationFrame(this.loop)
  }

  render() {
    return (
      <WaveformContainer>
        <canvas id="scope"></canvas>
        <button className="start">click me</button>
      </WaveformContainer>
    )
  }
}

Waveform.propTypes = {
  value: PropTypes.array,

  onInput: PropTypes.func,
  onResolution: PropTypes.func,
}

export default Waveform
