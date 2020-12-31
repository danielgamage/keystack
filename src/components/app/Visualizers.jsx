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
  .tabs {
    display: flex;
    gap: 0.5rem;
    height: 2.5rem;
  }
  .icon {
    stroke: var(--fg-1);
    stroke-width: 1px;
  }
  .icon--eye {
    flex: 0;
    cursor: pointer;

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
  const [vizVisibility, setVizVisibility] = useState(["GridKeys", "NoteHUD"])

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
              scale={2}
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
              scale={2}
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
              scale={2}
              className={`icon icon--eye ${
                vizVisibility.includes("NoteHUD") && "on"
              }`}
              src={eyeIcon}
            />
          </Button>
        </div>
      </header>

      {vizVisibility.includes("GridKeys") && (
        <GridKeys midiReadPosition={"input"} />
      )}
      {vizVisibility.includes("RadialKeys") && (
        <RadialKeys midiReadPosition={"input"} />
      )}
      {vizVisibility.includes("NoteHUD") && (
        <NoteHUD midiReadPosition={"input"} />
      )}
    </StyledVisualizers>
  )
}

function mapStateToProps(state) {
  return { textBoxes: state.textBoxes, view: state.view }
}

export default connect(mapStateToProps)(Visualizers)
