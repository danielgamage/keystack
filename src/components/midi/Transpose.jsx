import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import NumericInput from '../NumericInput.jsx'
import Item from '../Item.jsx'

class Transpose extends Component {
	render() {
		return (
      <Item type="midi" item={this.props.data}>
        <div class="flex-container">
          <NumericInput
            label="Transpose"
            showLabel={false}
            class="tri small right"
            id={`pan-${this.props.data.id}`}
            min={-48}
            max={48}
            step={1}
            unit={` st`}
            displayValue={this.props.data.value}
            value={this.props.data.value}
            action={{
              type: 'UPDATE_MIDI_ITEM',
              id: this.props.data.id,
              property: "value"
            }}
            />
        </div>
      </Item>
		)
	}
}

export default connect()(Transpose)
