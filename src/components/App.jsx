import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import Settings from './Settings.jsx'
import Help from './Help.jsx'
import StatusBar from './StatusBar.jsx'
import Visualizers from './Visualizers.jsx'

class App extends Component {
	render() {
		return (
      <div class="app">
        <Visualizers />
        <Settings />
        <Help />
			</div>
		);
	}
}

export default connect()(App)
