import React, { Component } from "react"
import { Button, Icon } from "components"
import xIcon from "images/icon/x.svg"

import styled from "styled-components"
import vars from "variables"

const StyledButton = styled(Button)`
  position: relative;
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
  border-radius: var(--radius);
  background: var(--fg-7);
  .icon--x {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    fill: var(--fg-2);
  }
  &:hover,
  &:focus {
    background-color: var(--red);
    .icon--x {
      fill: var(--fg);
    }
  }
`

class RemoveButton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <StyledButton {...this.props}>
        <Icon className="icon--x" src={xIcon} scale={1.5} />
      </StyledButton>
    )
  }
}

export default RemoveButton
