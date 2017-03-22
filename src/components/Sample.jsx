import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { line, curveBundle } from "d3-shape"
import { scaleLinear, scaleLog, scalePow } from "d3-scale"
import { axisBottom, axisLeft } from "d3-axis"
import { select } from "d3-selection"

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
		return (
      <section class="controls">
        <svg class="vis-path" id={`vis-${this.props.instrument.id}`} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
          {this.props.instrument.sample.waveform !== null &&
            <path
              vector-effect="non-scaling-stroke"
              d={waveform(this.props.instrument.sample.waveform)}
              />
          }
        </svg>
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
