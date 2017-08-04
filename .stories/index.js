import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { text, boolean, color, number } from '@storybook/addon-knobs'

import { Button, Welcome } from '@storybook/react/demo';

import NumericInput from '../src/components/NumericInput'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

storiesOf('NumericInput', module)
  .add('solo', () => {
    const min = number('Min', 30)
    const max = number('Max', 12000)
    const freqSlider = number('Frequency', 400, {
      range: true,
      min: min,
      max: max,
      step: 1,
    })
    return (
      <div>
        {freqSlider}
        <NumericInput
          label='tune'
          className='small'
          min={min}
          max={max}
          step='1'
          unit=' ct'
          displayValue={freqSlider}
          value={freqSlider}
          action={{
            type: 'UPDATE_OSC',
            property: 'detune'
          }}
          update={(v) => { action('updated value', v) }}
        />
      </div>

    )
  });

storiesOf('Input', module)
  .add('ine', () => {
    let textValue = text('singular', 'hi')
    return (
      <input type='text' value={textValue} onChange={(e) => {textValue = text('singular', e.target.value)}} />
    )
  })
