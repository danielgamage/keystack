import React, { Component } from 'react'
import 'whatwg-fetch'

import styled from 'styled-components'
import vars from 'variables.js'

export const StyledIcon = styled.div`
  display: inline-block;
  fill: currentColor;
  width: ${props => props.scale
    ? props.scale * props.viewbox.width
    : props.viewbox.width}px;
  height: ${props => props.scale
    ? props.scale * props.viewbox.height
    : props.viewbox.height}px;

  .loading-image {
    width: auto;
    height: auto;
  }

  svg {
    width: 100%;
    height: 100%;
    stroke-linecap: round;
    transition: 0.2s ease;
  }

  ${vars.selectors.svg_elements} {
    fill: inherit;
    stroke: inherit;
  }
`

class Icon extends Component {
  constructor (props) {
    super(props)
    this.getViewbox = this.getViewbox.bind(this)

    const loadingImage = `<svg class='loading-image' viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="10"></circle>
    </svg>`

    this.state = {
      image: loadingImage,
    }

    this.state.viewbox = this.getViewbox(loadingImage)
  }

  componentWillMount () {
    this.fetchImage(this.props.src)
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.image !== nextProps.image) {
      this.fetchImage(nextProps.image)
    }
  }

  fetchImage (image) {
    fetch(image).then(data => {
      return data.text()
    }).then(data => {
      data = data.replace('<svg', '<svg class="icon"')

      this.setState({
        image: data,
        viewbox: this.getViewbox(data),
      })
    })
  }

  getViewbox (image) {
    const viewboxMatches = image
      .match(/viewBox=['"]([\d\s]*)['"]/)[0]
      .match(/\b(\d+)\b/g)

    return  {
      x: viewboxMatches[0],
      y: viewboxMatches[1],
      width: viewboxMatches[2],
      height: viewboxMatches[3],
    }
  }

  render () {
    return (
      <StyledIcon
        {...this.props}
        viewbox={this.state.viewbox}
        dangerouslySetInnerHTML={{__html: this.state.image}}
      />
    )
  }
}

export default Icon
