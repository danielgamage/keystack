import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeyboardEvents, unbindKeyboardEvents } from 'utils/keyboard'

import styled, { ThemeProvider } from 'styled-components'
import vars from 'variables'

import {
  TrackSettings,
  StatusBar,
  Visualizers,
} from 'components'

const StyledApp = styled.div`
  height: 100%;
  background-color: ${props => props.theme.lightness === 'light'
    ? vars.white
    : vars.grey_0
  };
  color: ${props => props.theme.lightness === 'light'
    ? vars.grey_3
    : vars.grey_5
  };

  .app-container {
    height: 100%;
    padding: 2rem;
    max-width: 56rem;
    margin: auto;
    align-items: stretch;
    align-content: stretch;
    flex-flow: column;
    justify-content: space-between;
    display: flex;
  }

  .play-area,
  .settings {
    flex: 0 0 auto;
    width: calc((100% / 2) - 0.5rem);
  }

`

class App extends Component {
  componentDidMount () {
    bindKeyboardEvents()
  }

  componentWillUnmount () {
    unbindKeyboardEvents()
  }

  render () {
    return (
      <ThemeProvider theme={this.props.theme}>
        <StyledApp>
          <div className='app-container'>
            <StatusBar />
            <main>
              <Visualizers />
              <TrackSettings />
            </main>
          </div>
        </StyledApp>
      </ThemeProvider>
    )
  }
}

function mapStateToProps (state) {
  return {
    theme: state.preferences.theme,
  }
}

export default connect(mapStateToProps)(App)
