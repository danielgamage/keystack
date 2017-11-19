import React, { Component } from 'react'
import styled, { css } from 'styled-components'

import vars from '@/variables'

import {
  Text,
  SwitchWithOptions,
} from '@/components'

const Container = styled.div`
  color: ${vars.grey_1};

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

  background-color: ${props => props.lightness === 'dark'
    ? vars.grey_0
    : vars.grey_7
  };
  box-shadow: 0 0 0 1px ${props => props.lightness === 'dark'
    ? vars.grey_1
    : vars.grey_6
  } inset;
  color: ${props => props.lightness === 'dark'
    ? vars.grey_7
    : vars.grey_1
  };
  border-radius: 7px;
`

const Swatch = styled.div`
  display: block;
  width: 1rem;
  height: 1rem;
  margin-right: 8px;
  border-radius: 1rem;
  transition: border 0.2s ease, background 0.2s ease;

  ${props => props.selected
    ? css`border: 4px solid ${props => props.color};`
    : css`background-color: ${props => props.color};`
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

const lightnessOptions = [{
  value: 'dark',
  strong: true,
}, {
  value: 'light',
  strong: false,
}]

class ThemeSettings extends Component {
  constructor (props) {
    super(props)
    this.updateAccent = this.updateAccent.bind(this)
    this.updateLightness = this.updateLightness.bind(this)
  }

  updateAccent (value) {
    this.props.onInput({
      ...this.props.prefs,
      accent: value
    })
  }

  updateLightness (value) {
    this.props.onInput({
      ...this.props.prefs,
      lightness: value
    })
  }

  render () {
    const currentColors = colorOptions.map((el, i) => ({
      ...el,
      hex: this.props.prefs.lightness === 'dark'
        ? el.light
        : el.dark
    }))

    return (
      <Container>
        <Text type='h2'>Theme</Text>

        <Palette lightness={this.props.prefs.lightness}>
          {currentColors.map((color, i) => (
            <Swatch
              color={color.hex}
              title={color.key}
              selected={color.key === this.props.prefs.accent}
              index={i}
              onClick={() => {this.updateAccent(color.key)}}
            />
          ))}
        </Palette>

        <SwitchWithOptions
          className='switch'
          value={this.props.prefs.lightness}
          options={lightnessOptions}
          orientation='row'
          onInput={this.updateLightness}
        />
      </Container>
    )
  }
}

export default ThemeSettings
