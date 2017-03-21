import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import NumericInput from '../NumericInput.jsx'

class Transpose extends Component {
	render() {
		return (
      <div class="item midi-item">
        <header>
          <h3 class="title">Transpose</h3>
        </header>
        <div class="flex-container">
          <NumericInput
            label="Transpose"
            showLabel={false}
            class="tri small right"
            id={`pan-${this.props.data.id}`}
            min={-48}
            max={48}
            step={1}
            unit={" st"}
            value={this.props.data.value}
            action={{
              type: 'UPDATE_MIDI_EFFECT',
              id: this.props.data.id,
              property: "value"
            }}
            />
        </div>
      </div>
		)
	}
}

export default connect()(Transpose)
