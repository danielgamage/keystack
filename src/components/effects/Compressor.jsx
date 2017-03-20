import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { line, curveBundle } from "d3-shape"
import { scaleLinear, scaleLog, scalePow } from "d3-scale"

import { audioEffectNodes } from '../../utils/audio'
import { compressSample } from '../../utils/compressor'

import NumericInput from '../NumericInput.jsx'


const viewBoxWidth = 128
const viewBoxHeight = 128
const frequencyBars = 1024
const minHz = 30
const maxHz = 22000

export const mapSample = (input, knee, ratio, threshold) => {

}

const x = scaleLinear()
  .domain([-100, 0])
  .range([0, viewBoxWidth])
  .clamp(true)

const y = scaleLinear()
  .domain([-100, 0])
  .range([viewBoxHeight, 0])
  .clamp(true)
const compressionCurve = line()
  .x((d) => x(d.x) )
  .y((d) => y(d.y) )
  .curve(curveBundle.beta(1))

class Compressor extends Component {
  componentWillMount() {
    const node = audioEffectNodes[this.props.data.id]
    this.params = [
      { name: 'attack',    max: node.attack.maxValue,    min: node.attack.minValue },
      { name: 'knee',      max: node.knee.maxValue,      min: node.knee.minValue },
      { name: 'ratio',     max: node.ratio.maxValue,     min: node.ratio.minValue },
      { name: 'release',   max: node.release.maxValue,   min: node.release.minValue },
      { name: 'threshold', max: node.threshold.maxValue, min: node.threshold.minValue }
    ]
  }
	render() {
    const points = [
      -100,
      this.props.data.threshold - (this.props.data.knee / 2),
      this.props.data.threshold,
      this.props.data.threshold + (this.props.data.knee / 2),
      0
    ].map(x => ({x: x, y: compressSample(x, this.props.data.threshold, this.props.data.ratio, this.props.data.knee)}))
    console.log(points)
		return (
      <div class="item effect-item">
        <header>
          <h3 class="title">Compressor</h3>
        </header>
        <div className="compressor-container">
          <svg class="vis-path" id={`vis-${this.props.data.id}`} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
            <path
              class="filter-phase"
              vector-effect="non-scaling-stroke"
              d={compressionCurve(points)}
              />
            {points.map(point => (
              <circle
                vector-effect="non-scaling-stroke"
                class="dot"
                cx={x(point.x)}
                cy={y(point.y)}
                r="0.3"
                />
            ))}
          </svg>
          <div class="flex-container">
            {this.params.map((el, i) => (
              <NumericInput
                label={el.name}
                class="tri"
                id={`pan-${this.props.data.id}-${i}`}
                min={el.min}
                max={el.max}
                step={1}
                value={this.props.data[el.name]}
                action={{
                  type: 'UPDATE_EFFECT',
                  id: this.props.data.id,
                  property: el.name
                }}
                />
            ))}
          </div>
        </div>
      </div>
		)
	}
}

export default connect()(Compressor)
