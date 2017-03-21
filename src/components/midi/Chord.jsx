import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import NumericInput from '../NumericInput.jsx'

class Chord extends Component {
	render() {
		return (
      <div class="item midi-item">
        <header>
          <h3 class="title">Chord</h3>
        </header>
        <div class="flex-container">
          {this.props.data.value.map((el, i) => (
            <NumericInput
              label={`Note #${i + 1}`}
              showLabel={false}
              class="six small"
              id={`pan-${this.props.data.id}-${i + 1}`}
              min={-24}
              max={24}
              step={1}
              unit={" st"}
              value={this.props.data.value[i]}
              action={{
                type: 'UPDATE_MIDI_VALUE_ARRAY',
                id: this.props.data.id,
                index: i
              }}
              />
          ))}
        </div>
      </div>
		)
	}
}

export default connect()(Chord)
