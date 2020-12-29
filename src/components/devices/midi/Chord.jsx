import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import vars from "variables"
import { format } from "d3-format"

import { NumericInput, Item, Text, Popover, Icon, TextInput } from "components"

import refreshIcon from "images/icon/refresh.svg"

import { chords, groupedChords } from "data/chords"

const isSameArray = (a, b) => {
  return (
    a.every((item, index) => a[index] === b[index]) &&
    b.every((item, index) => b[index] === a[index])
  )
}

const StyledChordDevice = styled.div`
  .top {
    display: flex;
  }

  .chord-pads {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: calc(100% - 80px);
    margin: 0 0 8px 0;
    gap: 8px;
    .pad {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      text-overflow: ellipsis;
      height: 32px;
      text-align: center;
      border-radius: var(--radius);
      cursor: pointer;
      background: var(--bg);
      box-shadow: var(--shadow-raised);
      &.active {
        background-color: var(--accent);
        color: var(--grey-0);
      }
      &.open-index {
        box-shadow: 0 0 0 1px var(--white) inset;
      }
    }
    .swap-button {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 13px;
      height: 13px;
      background: var(--bg-recessed);
      box-shadow: 0 0 0 1px var(--backrgound-deep);
      color: var(--fg-2);
      border-radius: 50%;
    }
    .swap-icon {
      display: block;
      position: absolute;
      top: 3px;
      left: 3px;
    }
  }

  .chord-inversion-props {
    padding-left: 16px;
    width: 80px;
  }

  .popover .popover-container {
    width: 100%;
  }
  .popover .arrow {
    fill: var(--grey-6);
  }
  .chord-list {
    height: 192px;
    overflow-y: auto;
    padding: 12px 16px;
    background-color: var(--grey-6);
    color: var(--grey-0);
  }

  .chord-group-title {
    margin: 16px 0 4px;
    &:first-child {
      margin-top: 0;
    }
  }

  .chord-set {
    color: var(--grey-4);
  }

  .flex-container {
    .numeric-input {
      width: calc(100% / 8);
    }
  }
`

class Chord extends Component {
  constructor(props) {
    super(props)

    this.state = {
      favorites: [
        "Major",
        "Major 7th",
        "Major 7th sharp 11th",
        "Major 6th",

        "Minor",
        "Minor 7th",
        "Minor 9th",
        "Minor 6th",

        "Suspended 2nd",
        "Suspended 4th",
        "9th suspended 2nd",
        "9th suspended 4th",

        "Augmented major 7th",
        "Augmented 7th",
        "9th augmented 5th",
        "Augmented 6th",
      ],

      isPickerOpen: false,
      openIndex: null,
      filterText: null,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isPickerOpen === true && this.state.isPickerOpen === false) {
      this.setState({
        filterText: null,
        openIndex: null,
      })
    }
    if (prevState.isPickerOpen === false && this.state.isPickerOpen === true) {
      this.filterInputElement.current.inputElement.current.focus()
    }
  }

  render() {
    const favorites = this.state.favorites.map((fave) =>
      chords.find((chord) => fave === chord.name)
    )

    const currentChord = favorites.find((favorite) => {
      return favorite && isSameArray(favorite.naturalSet, this.props.data.value)
    })

    const filterText =
      this.state.filterText && this.state.filterText.toLowerCase()

    const filteredGroupedChords = this.state.filterText
      ? Object.keys(groupedChords).reduce((acc, key) => {
          const matches = groupedChords[key].filter(
            (el) =>
              (el.name && el.name.toLowerCase().includes(filterText)) ||
              (el.abbr && el.abbr.toLowerCase().includes(filterText))
          )

          if (matches.length) acc[key] = matches

          return acc
        }, {})
      : groupedChords

    return (
      <Item type="midi" index={this.props.index} item={this.props.data}>
        <StyledChordDevice>
          <div className="top">
            <div className="chord-pads">
              {favorites.map((chord, i) =>
                chord ? (
                  <div
                    key={i}
                    className={`
                        pad
                        ${
                          currentChord && currentChord.name === chord.name
                            ? "active"
                            : ""
                        }
                        ${this.state.openIndex === i ? "open-index" : ""}
                      `}
                    onClick={() => {
                      this.props.dispatch({
                        type: "UPDATE_DEVICE",
                        id: this.props.data.id,
                        property: "value",
                        value: chord.naturalSet || [0, 0, 0, 0],
                      })
                    }}
                  >
                    <div
                      className="swap-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        this.setState({
                          isPickerOpen: true,
                          openIndex: i,
                        })
                      }}
                    >
                      <Icon className="swap-icon" src={refreshIcon} />
                    </div>

                    <Text>
                      <span>{chord.abbr || chord.name}</span>
                    </Text>
                  </div>
                ) : (
                  <div
                    key={i}
                    className={`
                        pad
                        ${this.state.openIndex === i ? "open-index" : ""}
                      `}
                    onClick={() => {
                      this.setState({
                        isPickerOpen: true,
                        openIndex: i,
                      })
                    }}
                  >
                    <Text>
                      <span>-</span>
                    </Text>
                  </div>
                )
              )}

              <Popover
                isOpen={this.state.isPickerOpen}
                onClickOutside={() => {
                  this.setState({ isPickerOpen: false })
                }}
                viewport={document.querySelector(".settings-inner-container")}
                className="chord-list-popover"
              >
                <div className="chord-list">
                  <TextInput
                    type="text"
                    ref={(e) => (this.filterInputElement = e)}
                    placeholder="Search chords..."
                    onKeyUp={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onInput={(e) => {
                      this.setState({
                        filterText: e.target.value,
                      })
                    }}
                    value={this.state.filterText}
                  />

                  {Object.keys(filteredGroupedChords).map((group) => [
                    <Text className="chord-group-title" type="h3">
                      {group}
                    </Text>,

                    filteredGroupedChords[group].map((chord) => (
                      <Text
                        onClick={() => {
                          if (this.state.openIndex) {
                            this.setState({
                              isPickerOpen: false,
                              openIndex: null,
                              favorites: Object.assign(
                                [],
                                this.state.favorites,
                                { [this.state.openIndex]: chord.name }
                              ),
                            })
                          }
                        }}
                      >
                        <span>{chord.name}</span>
                        &nbsp;
                        <span className="chord-set">
                          ({chord.naturalSet.join(", ")})
                        </span>
                      </Text>
                    )),
                  ])}
                </div>
              </Popover>
            </div>

            <div className="chord-inversion-props">
              <h3 className="h3" title="Random Inversions">
                Rand Inv
              </h3>

              <NumericInput
                label="Chance"
                className="numeric-input small"
                viz="bar"
                min={0}
                max={100}
                displayValue={format(".0%")(
                  this.props.data.inversionChance / 100
                )}
                value={this.props.data.inversionChance}
                onInput={(event) => {
                  this.props.dispatch({
                    type: "UPDATE_DEVICE",
                    id: this.props.data.id,
                    property: "inversionChance",
                    value: event,
                  })
                }}
              />

              <NumericInput
                label="Range"
                className="numeric-input small"
                viz="bar"
                min={0}
                max={4}
                unit=" oct"
                value={this.props.data.inversionRange}
                onInput={(event) => {
                  this.props.dispatch({
                    type: "UPDATE_DEVICE",
                    id: this.props.data.id,
                    property: "inversionRange",
                    value: event,
                  })
                }}
              />
            </div>
          </div>

          <div className="flex-container">
            {this.props.data.value.map((el, i) => (
              <NumericInput
                key={i}
                label={`Note #${i + 1}`}
                showLabel={false}
                className="numeric-input small"
                id={`pan-${this.props.data.id}-${i + 1}`}
                min={-24}
                max={24}
                steps={{
                  shiftKey: 12,
                  default: 1,
                }}
                unit="st"
                displayValue={format("+")(this.props.data.value[i])}
                value={this.props.data.value[i]}
                onInput={(event) => {
                  this.props.dispatch({
                    type: "UPDATE_DEVICE_ARRAY",
                    id: this.props.data.id,
                    property: "value",
                    index: i,
                    value: event,
                  })
                }}
              />
            ))}
          </div>
        </StyledChordDevice>
      </Item>
    )
  }
}

export default connect()(Chord)
