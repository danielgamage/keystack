import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import NoteHUD from './visualizers/NoteHUD.jsx'
import RadialKeys from './visualizers/RadialKeys.jsx'
import Midi from './MIDI.jsx'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      midiReadPosition: 'input'
    }
  }
  render () {
    return (
      <div class='play-area'>
        <button
          title={'Change where visualizers read notes from: pre or post-FX'}
          onClick={() => {
            this.setState({midiReadPosition: this.state.midiReadPosition === 'input' ? 'output' : 'input'})
          }}
          class='button input-output-switch'>
          {this.state.midiReadPosition}
        </button>

        <RadialKeys midiReadPosition={this.state.midiReadPosition} />
        <NoteHUD midiReadPosition={this.state.midiReadPosition} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return { textBoxes: state.textBoxes, view: state.view }
}

export default connect(mapStateToProps)(App)
