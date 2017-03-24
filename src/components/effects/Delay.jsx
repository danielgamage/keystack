import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import { audioEffectNodes } from '../../utils/audio'

import { line, curveCatmullRom } from 'd3-shape'
import { scaleLinear, scaleLog, scalePow } from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'

import Item from '../Item.jsx'
import NumericInput from '../NumericInput.jsx'

const parameters = [
  { name: 'mix',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    scale: 1
  },
  { name: 'delay',
    unit: 's',
    format: '.3s',
    min: 0.01,
    max: 2,
    step: 0.01,
    scale: 1
  },
  { name: 'feedback',
    unit: '%',
    min: 0,
    max: 90,
    step: 1,
    scale: 1
  }
]

class Delay extends Component {
  constructor (props) {
    super(props)

  }
  render () {
    return (
      <Item title='Delay' type='audio' item={this.props.data}>
        <div class='flex-container'>
          {parameters.map(param => (
            <NumericInput
              label={param.name}
              class='tri'
              id={param.name}
              min={param.min}
              max={param.max}
              step={param.step}
              unit={param.unit}
              format={param.format}
              scale={param.scale}
              value={this.props.data[param.name]}
              action={{
                type: 'UPDATE_EFFECT',
                id: this.props.data.id,
                property: param.name
              }}
              />
          ))}
        </div>
      </Item>
    )
  }
}

export default connect()(Delay)
