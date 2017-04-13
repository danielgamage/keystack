import React, { Component } from 'react'
import { connect } from 'react-redux'

import TrackSettings from './TrackSettings.jsx'
import StatusBar from './StatusBar.jsx'
import Visualizers from './Visualizers.jsx'

class App extends Component {
  render () {
    return (
      <div className='app'>
        <StatusBar />
        <main>
          <Visualizers />
          <TrackSettings />
        </main>
      </div>
    )
  }
}

export default connect()(App)
