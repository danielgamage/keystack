import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import NumericInput from './NumericInput.jsx'
import Envelope from './Envelope.jsx'
import Icon from './Icon.jsx'
import uploadIcon from '../images/upload.svg'

import { loadSample } from '../utils/audio'

class Sample extends Component {
	render() {
		return (
      <section class="controls">
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
