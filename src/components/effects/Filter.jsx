import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import NumericInput from '../NumericInput.jsx'

const filterTypes = [
  { name: "lowpass",   frequency: true, q: true,  gain: false },
  { name: "highpass",  frequency: true, q: true,  gain: false },
  { name: "bandpass",  frequency: true, q: true,  gain: false },
  { name: "lowshelf",  frequency: true, q: false, gain: true  },
  { name: "highshelf", frequency: true, q: false, gain: true  },
  { name: "peaking",   frequency: true, q: true,  gain: true  },
  { name: "notch",     frequency: true, q: true,  gain: false },
  { name: "allpass",   frequency: true, q: true,  gain: false },
]

class Filter extends Component {
	render() {
    console.log(filterTypes.find(el => el.name === this.props.data.type))
		return (
      <div>
        <h3>Filter</h3>
        <div className="select">
          <select
            onChange={(e) => {
              this.props.dispatch({
                type: 'UPDATE_FILTER',
                id: this.props.data.id,
                property: 'type',
                value: e.target.value
              })
            }}
            >
            {filterTypes.map(type => (
              <option value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>
        {[
          { name: "frequency",
            min: 30,
            max: 12000,
            step: 1
          },
          { name: "q",
            min: 0,
            max: 1,
            step: .01
          },
          { name: "gain",
            min: 0,
            max: 1,
            step: .01
          }
        ].map(param => (
          <NumericInput
            label={param.name}
            class="tri"
            disabled={!filterTypes.find(el => el.name === this.props.data.type)[param.name]}
            id={param.name}
            min={param.min}
            max={param.max}
            step={param.step}
            value={this.props.data[param.name]}
            action={{
              type: 'UPDATE_FILTER',
              id: this.props.data.id,
              property: param.name
            }}
            />
        ))}
      </div>
		);
	}
}

export default connect()(Filter)
