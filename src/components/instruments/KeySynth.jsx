import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Oscillators from '../Oscillators.jsx'
import Envelope from '../Envelope.jsx'
import Item from '../Item.jsx'

class KeySynth extends Component {
	render() {
		return (
      <Item type='instrument' item={this.props.data}>
        <Oscillators instrument={this.props.data} oscillators={this.props.data.oscillators} />
        <Envelope instrument={this.props.data} envelope={this.props.data.envelope} />
      </Item>
		)
	}
}

export default connect()(KeySynth)
