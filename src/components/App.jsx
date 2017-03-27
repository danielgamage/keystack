import React, { Component } from 'react'
import { connect } from 'react-redux'

import Settings from './Settings.jsx'
import Help from './Help.jsx'
import StatusBar from './StatusBar.jsx'
import Visualizers from './Visualizers.jsx'

class App extends Component {
  render () {
    return (
      <div className='app'>
        <StatusBar />
        <main>
          <Visualizers />
          <Settings />
        </main>
      </div>
    )
  }
}

export default connect()(App)
