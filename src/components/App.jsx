import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../reducers';
import * as actions from '../actions';

import Settings from './Settings.jsx'
import NoteHUD from './visualizers/NoteHUD.jsx'
import RadialKeys from './visualizers/RadialKeys.jsx'
import Midi from './MIDI.jsx'
import Help from './Help.jsx'
import StatusBar from './StatusBar.jsx'

class App extends Component {
	render() {
		return (
      <div class="app">
        <div class="play-area">
          <RadialKeys />
          <NoteHUD />
          <Midi />
          <Help></Help>
        </div>
        <Settings />
			</div>
		);
	}
}

function mapStateToProps (state) {
  return { textBoxes: state.textBoxes, view: state.view }
}

export default connect(mapStateToProps)(App)
