import React, { useState } from "react"
import { connect } from "react-redux"
import { startNote, stopNote } from "utils/notes"

import { NumericInput } from "components"
import { keys } from "utils"
import styled from "styled-components"

const StyledGridKeys = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  .columnCountInput {
    display: flex;
    gap: 0.5rem;
  }

  #chart {
    margin-bottom: 2rem;
    svg {
      width: 100%;
      height: 100%;
      stroke-linecap: butt;
    }
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--column-count), 1fr);
    padding: 1rem;
    border-radius: var(--radius);
    background-color: var(--bg-recessed);
  }
  .key {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.2rem;
    height: 1rem;
    transition: 0.3s ease-out;
    border-radius: var(--radius);
    cursor: pointer;
    box-shadow: 0 0 0 0.5px var(--bg-recessed) inset;
    &.black {
      background-color: var(--grey-10);
      color: var(--fg-4);
    }
    &.white {
      background-color: var(--grey-0);
      color: var(--fg-3);
    }
    &.key-C {
      &::after {
        content: "•";
        margin-left: 0.2rem;
        display: inline-block;
        color: var(--accent);
      }
    }
    &.on {
      transition: 0s ease;
      background-color: var(--accent);
    }
  }
  .play-area,
  .settings {
    width: calc((100% - 2rem) / 2);
  }

  .axis {
    & text {
      font-size: 13px;
      fill: var(--fg-3);
    }
  }
`

interface IGridKeysProps {
  notes: any[]
  midiReadPosition: "input" | "output"
}

const GridKeys = (props: IGridKeysProps) => {
  const [columnCount, setColumnCount] = useState<number>(8)

  const interact = (event: any) => {
    noteOn(event)

    event.preventDefault()
    ;[...(document.querySelectorAll(".grid .key") as any)].forEach((el) => {
      el.addEventListener("mousemove", noteOn)
      el.addEventListener("mouseleave", noteOff)
      el.addEventListener("mouseup", noteOff)
      el.addEventListener("touchmove", noteOn)
      el.addEventListener("touchcancel", noteOff)
      el.addEventListener("touchend", noteOff)
    })

    window.addEventListener("mouseup", unBind)
    window.addEventListener("mouseleave", unBind)
    window.addEventListener("touchend", unBind)
  }

  const unBind = (event: any) => {
    ;[...(document.querySelectorAll(".grid .key") as any)].forEach((el) => {
      el.removeEventListener("mousemove", noteOn)
      el.removeEventListener("mouseleave", noteOff)
      el.removeEventListener("mouseup", noteOff)
      el.removeEventListener("touchmove", noteOn)
      el.removeEventListener("touchcancel", noteOff)
      el.removeEventListener("touchend", noteOff)
    })
  }

  const noteOn = (e: any) => {
    console.log("noteOn")
    startNote(keys[e.target.getAttribute("data-index")])
  }

  const noteOff = (e: any) => {
    console.log("noteOff")
    stopNote(keys[e.target.getAttribute("data-index")])
  }

  keys.reverse()

  return (
    <StyledGridKeys>
      <div className="columnCountInput">
        <NumericInput
          label={"columns"}
          min={2}
          max={16}
          step={1}
          viz="bar"
          value={columnCount}
          onInput={setColumnCount}
        />
        <NumericInput
          label={"columns"}
          min={2}
          max={16}
          step={1}
          viz="bar"
          value={columnCount}
          onInput={setColumnCount}
        />
        <NumericInput
          label={"columns"}
          min={2}
          max={16}
          step={1}
          viz="bar"
          value={columnCount}
          onInput={setColumnCount}
        />
      </div>
      <div className="grid" style={{ "--column-count": columnCount } as any}>
        {keys.map((key, i) => {
          var index = i / 12 + 2
          var isOn = props.notes[props.midiReadPosition as any].some(
            (note: any) => note.index === key.index
          )
          return (
            <div
              key={key.index}
              className={`key key-${key.index} key-${key.note} ${
                key.black ? "black" : "white"
              } ${isOn ? "on" : ""}`}
              data-index={i}
              onTouchStart={(e) => interact(e)}
              onMouseDown={(e) => interact(e)}
            >
              {key.note}
            </div>
          )
        })}
      </div>
    </StyledGridKeys>
  )
}

function mapStateToProps(state: any) {
  return { notes: state.notes, view: state.view }
}

export default connect(mapStateToProps)(GridKeys)
