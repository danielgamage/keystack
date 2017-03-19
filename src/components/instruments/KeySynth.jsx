import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Oscillators from '../Oscillators.jsx'
import Envelope from '../Envelope.jsx'

class KeySynth extends Component {
	render() {
		return (
      <div class="item instrument-item">
        <header>
          <h3 class="title">KeySynth</h3>
        </header>
        <Oscillators instrument={this.props.data} oscillators={this.props.data.oscillators}/>
        <Envelope instrument={this.props.data} envelope={this.props.data.envelope}/>
      </div>
		);
	}
}

export default connect()(KeySynth)
