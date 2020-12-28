import React, { Component } from "react"
import styled, { css } from "styled-components"

import vars from "variables"

import { Text, SwitchWithOptions } from "components"

const Container = styled.div`
  .switch {
    width: 112px;
  }
`

const Palette = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  width: 112px;

  margin: 16px 0;
  padding: 12px;

  background-color: var(--bg);
  box-shadow: 0 0 0 1px var(--bg-recessed) inset;
  color: var(--fg);
  border-radius: 7px;
`

const Swatch = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  margin-right: 8px;
  border: 0;
  border-radius: 1rem;
  padding: 0;

  background-color: ${(props) => props.color};
  cursor: pointer;

  &::before {
    content: "";
    display: block;
    background: var(--bg);
    border-radius: 1rem;
    width: 8px;
    height: 8px;
    transition: opacity 0.2s, transform 0.2s;
    transform: ${(props) => (props.selected ? "scale(1)" : "scale(0.5)")};
    opacity: ${(props) => (props.selected ? 1 : 0)};
  }

  &:nth-child(4n) {
    margin-right: 0;
  }

  &:nth-child(n + 5) {
    margin-top: 8px;
  }
`

const colorOptions = Object.keys(vars.accents).map((key) => {
  return {
    ...vars.accents[key],
    key: key,
  }
})

const lightnessOptions = [
  {
    value: "dark",
    strong: true,
  },
  {
    value: "light",
    strong: false,
  },
]

class ThemeSettings extends Component {
  constructor(props) {
    super(props)
    this.updateAccent = this.updateAccent.bind(this)
    this.updateLightness = this.updateLightness.bind(this)
  }

  updateAccent(value) {
    this.props.onInput({
      ...this.props.prefs,
      accent: value,
    })
  }

  updateLightness(value) {
    this.props.onInput({
      ...this.props.prefs,
      lightness: value,
    })
  }

  render() {
    const currentColors = colorOptions.map((el, i) => ({
      ...el,
      hex: this.props.prefs.lightness === "dark" ? el[1] : el[0],
    }))

    return (
      <Container>
        <h2 className="h2">Theme</h2>

        <Palette lightness={this.props.prefs.lightness}>
          {currentColors.map((color, i) => (
            <Swatch
              lightness={this.props.prefs.lightness}
              color={color.hex}
              title={color.key}
              tabIndex="0"
              selected={color.key === this.props.prefs.accent}
              index={i}
              onClick={() => {
                this.updateAccent(color.key)
              }}
            />
          ))}
        </Palette>

        <SwitchWithOptions
          className="switch"
          value={this.props.prefs.lightness}
          options={lightnessOptions}
          orientation="row"
          onInput={this.updateLightness}
        />
      </Container>
    )
  }
}

export default ThemeSettings
