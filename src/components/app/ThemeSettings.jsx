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
  transition: background 0.2s, box-shadow 0.2s;

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

  transition: border 0.2s ease, background 0.2s ease;
  background-color: ${props => props.color};
  cursor: pointer;

  &::before {
    content: '';
    display: block;
    background: ${props => props.lightness === 'dark'
      ? vars.grey_0
      : vars.grey_7
    };
    border-radius: 1rem;
    width: 8px;
    height: 8px;
    transition: opacity 0.2s, transform 0.2s, background 0.2s;
    transform: ${props => props.selected ? 'scale(1)' : 'scale(0.5)'};
    opacity: ${props => props.selected ? 1 : 0}
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
              lightness={this.props.prefs.lightness}
              color={color.hex}
              title={color.key}
              tabIndex='0'
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
