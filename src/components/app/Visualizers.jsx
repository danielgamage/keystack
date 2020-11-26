import React, { Component } from "react"
import { connect } from "react-redux"

import { NoteHUD, RadialKeys, Button } from "components"

class Visualizers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      midiReadPosition: "input",
    }
  }
  render() {
    const midiReadLabel =
      this.state.midiReadPosition === "input" ? "pre-fx" : "post-fx"
    return (
      <div className="play-area">
        <Button
          title={"Change where visualizers read notes from: pre or post-FX"}
          onClick={() => {
            this.setState({
              midiReadPosition:
                this.state.midiReadPosition === "input" ? "output" : "input",
            })
          }}
          className="button input-output-switch"
        >
          {midiReadLabel}
        </Button>

        <RadialKeys midiReadPosition={this.state.midiReadPosition} />
        <NoteHUD midiReadPosition={this.state.midiReadPosition} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { textBoxes: state.textBoxes, view: state.view }
}

export default connect(mapStateToProps)(Visualizers)
