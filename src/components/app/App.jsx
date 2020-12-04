import React, { Component } from "react"
import { connect } from "react-redux"
import { bindKeyboardEvents, unbindKeyboardEvents } from "utils/keyboard"

import styled, { ThemeProvider } from "styled-components"
import vars from "variables"

import { TrackSettings, StatusBar, Visualizers } from "components"

const StyledApp = styled.div`
  height: 100%;
  background-color: var(--bg);
  color: var(--fg-3);

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
  componentDidMount() {
    bindKeyboardEvents()
  }

  componentWillUnmount() {
    unbindKeyboardEvents()
  }

  render() {
    return (
      <ThemeProvider theme={this.props.theme}>
        <StyledApp
          className={`hello theme--${this.props.theme.lightness}`}
          style={{
            "--accent-dark": `var(--${this.props.theme.accent}-dark)`,
            "--accent": `var(--${this.props.theme.accent})`,
            "--accent-bright": `var(--${this.props.theme.accent}-bright)`,
          }}
        >
          <div className="app-container">
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

function mapStateToProps(state) {
  return {
    theme: state.preferences.theme,
  }
}

export default connect(mapStateToProps)(App)
