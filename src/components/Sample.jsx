import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { line, curveBundle } from "d3-shape"
import { scaleLinear, scaleLog, scalePow } from "d3-scale"
import { axisBottom, axisLeft } from "d3-axis"
import { select } from "d3-selection"
import { format } from "d3-format"

import NumericInput from './NumericInput.jsx'
import Envelope from './Envelope.jsx'
import Icon from './Icon.jsx'
import uploadIcon from '../images/upload.svg'

import { loadSample } from '../utils/audio'


const viewBoxWidth = 256
const viewBoxHeight = 64

class Sample extends Component {
	render() {
    const x = scaleLinear()
      .domain([0, this.props.instrument.sample.waveform.length - 1])
      .range([0, viewBoxWidth])
      .clamp(true)

    const y = scaleLinear()
      .domain([-1, 1])
      .range([viewBoxHeight, 0])
      .clamp(true)
    const waveform = line()
      .x((d, i) => x(i) )
      .y((d) => y(d) )
      .curve(curveBundle.beta(1))
    const instrument = this.props.instrument
    const sample = instrument.sample

    const loopStartX = this.props.instrument.loopStart / sample.duration * viewBoxWidth
    const loopEndX   = this.props.instrument.loopEnd   / sample.duration * viewBoxWidth

		return (
      <section class="sample">
        <svg class="vis-path" id={`vis-${this.props.instrument.id}`} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
          <path
            vector-effect="non-scaling-stroke"
            d={waveform(sample.waveform)}
            />
          <line x1={loopStartX} y1={viewBoxHeight} x2={loopStartX} y2="0"/>
          <line x1={loopEndX}   y1={viewBoxHeight} x2={loopEndX} y2="0"/>
        </svg>
        <div className="sample-info">
          <span>{sample.name}</span>
          <span class="size">{sample.size != null && `${format(".2")(sample.size / 1024 / 1024)}mb`}</span>
        </div>
        {[
          {name: 'Start', max: instrument.loopEnd, min: 0},
          {name: 'End',   max: sample.duration,    min: instrument.loopStart}
        ].map(el => (
          <NumericInput
            label={`Loop ${el.name}`}
            unit='s'
            format='.3s'
            class="small"
            id={`loop-${el.name}`}
            min={el.min}
            max={el.max}
            step="0.01"
            value={this.props.instrument[`loop${el.name}`]}
            action={{
              id: this.props.instrument.id,
              type: 'UPDATE_INSTRUMENT',
              property: `loop${el.name}`
            }}
            />
        ))}

        <div
          onClick={() => {
            loadSample(this.props.instrument.id)
          }}
          >
          <Icon
            class="icon"
            src={uploadIcon}
            />
        </div>
      </section>
		);
	}
}

export default connect()(Sample)
