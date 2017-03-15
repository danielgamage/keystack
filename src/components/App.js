import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import reduce from '../reducers';
import * as actions from '../actions';

import Settings from './Settings.js'

class App extends Component {
	render({ todos }, { text }) {
    console.log(this)
		return (
			<div class="app">
        <div id="chart"></div>
        <Settings />
			</div>
		);
	}
}

function mapStateToProps (state) {
  return { textBoxes: state.textBoxes, view: state.view }
}

export default connect(mapStateToProps)(App)
