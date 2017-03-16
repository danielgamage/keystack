import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../reducers';
import * as actions from '../actions';

import Settings from './Settings.jsx'
import NoteHUD from './NoteHUD.jsx'

class App extends Component {
	render() {
		return (
			<div class="app">
        <div class="play-area">
          <div id="chart"></div>
          <NoteHUD />
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
