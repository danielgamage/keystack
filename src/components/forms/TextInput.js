import React from "react";
import styled from "styled-components";

import vars from "variables";

import { Text } from "components";

import { StyledText } from "components/elements/Text";

export const StyledInput = styled(StyledText)`
  padding: 4px 8px 3px;
  border: 0;

  background: ${vars.grey_7};
  color: ${vars.grey_1};
  border-radius: ${vars.radius};

  appearance: none;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);

  &:focus {
    outline: none;
    background: ${vars.white};
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }
`;
export const StyledInputCorrected = StyledInput.withComponent("input");

class TextInput extends React.Component {
  render() {
    return (
      <StyledInputCorrected
        {...this.props}
        type="h3"
        innerRef={e => (this.inputElement = e)}
        type="text"
      />
    );
  }
}

export default TextInput;
