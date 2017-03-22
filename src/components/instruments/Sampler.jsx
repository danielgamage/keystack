import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Sample from '../Sample.jsx'
import Envelope from '../Envelope.jsx'

class Sampler extends Component {
	render() {
		return (
      <div class="item instrument-item">
        <header>
          <h3 class="title">Sampler</h3>
        </header>
        <Sample instrument={this.props.data} />
        <Envelope instrument={this.props.data} envelope={this.props.data.envelope}/>
      </div>
		);
	}
}

export default connect()(Sampler)
