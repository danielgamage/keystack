import React, { useState } from "react"
import { connect } from "react-redux"

import { NoteHUD, RadialKeys, Icon, Button, GridKeys } from "components"
import styled from "styled-components"
import eyeIcon from "images/icon/eye.svg"
import radialKeysIcon from "images/icon/radialkeys.svg"
import gridKeysIcon from "images/icon/gridkeys.svg"

const StyledVisualizers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: auto;

  header {
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: var(--bg);
  }
  .icon--gridkeys,
  .icon--radialkeys {
    fill: var(--fg-1);
  }
  .icon--eye {
    flex: 0;
    cursor: pointer;

    circle,
    path {
      fill: none;
      stroke: var(--fg-1);
    }
    .pupil {
      transition: 0.5s ease;
    }
    &.on {
      .pupil {
        fill: var(--fg-3);
      }
    }
  }
`
const Visualizers = () => {
  const [midiReadPosition, setMidiReadPosition] = useState("input")
  const [vizVisibility, setVizVisibility] = useState(["GridKeys", "NoteHUD"])
  const midiReadLabel = midiReadPosition === "input" ? "pre-fx" : "post-fx"

  const toggleVizVisibility = (viz) => {
    if (vizVisibility.includes(viz)) {
      setVizVisibility(vizVisibility.filter((el) => el !== viz))
    } else {
      setVizVisibility([...vizVisibility, viz])
    }
  }

  return (
    <StyledVisualizers className="play-area">
      <header>
        <div className="tabs">
          <Button
            onClick={() => toggleVizVisibility("GridKeys")}
            className="button input-output-switch"
          >
            <Icon
              className={`icon icon--gridkeys ${
                vizVisibility.includes("GridKeys") && "on"
              }`}
              src={gridKeysIcon}
            />
          </Button>

          <Button
            onClick={() => toggleVizVisibility("RadialKeys")}
            className="button input-output-switch"
          >
            <Icon
              className={`icon icon--radialkeys ${
                vizVisibility.includes("RadialKeys") && "on"
              }`}
              src={radialKeysIcon}
            />
          </Button>
          <Button
            onClick={() => toggleVizVisibility("NoteHUD")}
            className="button input-output-switch"
          >
            <Icon
              className={`icon icon--eye ${
                vizVisibility.includes("NoteHUD") && "on"
              }`}
              src={eyeIcon}
            />
          </Button>
        </div>

        <Button
          title={"Change where visualizers read notes from: pre or post-FX"}
          onClick={() => {
            setMidiReadPosition(
              midiReadPosition === "input" ? "output" : "input"
            )
          }}
          className="button input-output-switch"
        >
          {midiReadLabel}
        </Button>
      </header>

      {vizVisibility.includes("GridKeys") && (
        <GridKeys midiReadPosition={midiReadPosition} />
      )}
      {vizVisibility.includes("RadialKeys") && (
        <RadialKeys midiReadPosition={midiReadPosition} />
      )}
      {vizVisibility.includes("NoteHUD") && (
        <NoteHUD midiReadPosition={midiReadPosition} />
      )}
    </StyledVisualizers>
  )
}

function mapStateToProps(state) {
  return { textBoxes: state.textBoxes, view: state.view }
}

export default connect(mapStateToProps)(Visualizers)
