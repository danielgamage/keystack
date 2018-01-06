export default {
  //
  // colors
  //

  white: `#FDFCFB`,
  grey_7: `#F2F1F0`,
  grey_6: `#E8E9EB`,
  grey_5: `#CDD1D3`,
  grey_4: `#949496`,
  grey_3: `#87878B`,
  grey_2: `#7C7C7F`,
  grey_1: `#5A5A5F`,
  grey_0: `#444649`,
  black: `#3A3B3E`,

  orange: `#ff9800`,
  orange_bright: `#ffa850`,

  accents: {
    orange: [`#F98E00`, `#FFA850`, `#FFD4AE`],
    red: [`#F76D6D`, `#FF7E7B`, `#FFC5C5`],
    magenta: [`#F067AB`, `#FF8DBB`, `#FFCFE6`],
    purple: [`#9B7FF2`, `#BBA5FF`, `#D4CAFF`],
    blue: [`#5B94EF`, `#8DB9FF`, `#B8D5FF`],
    aqua: [`#1CC9BC`, `#6FDDD0`, `#B0F7EE`],
    green: [`#6BC93F`, `#94ED6B`, `#CAF9B2`],
    yellow: [`#FCBD30`, `#FFD149`, `#FFEEA4`]
  },

  //
  // fonts
  //

  sans: `'Source Sans Pro', sans-serif`,
  sc: `'Source Sans Pro', sans-serif`,

  //
  // selectors
  //

  selectors: {
    svg_elements: `line, rect, path, circle, polygon, polyline`
  },

  //
  // mixins
  //

  mixins: {
    sc: `
        font-family: 'Source Sans Pro', sans-serif;
        text-transform: uppercase;
        font-weight: 600;
        font-size: 0.8rem;
        letter-spacing: 0.2em;
        word-spacing: 0.1em;
        line-height: 1rem;
      `,

    button_reset: `
        line-height: 1;
        padding: 0;
        appearance: none;
        border: 0;
        cursor: pointer;
        background: none;
      `,

    button: `
        @extend %button-reset;
        padding: 0.2rem 0.4rem 0.25rem;
        background: $grey-1;
        color: $grey-6;
        border-radius: $radius;
        @extend %sc;
        &:hover,
        &:focus {
          background: $grey-2;
        }
      `,

    hidden_but_focusable: `
        position: absolute;
        width: 0;
        height: 0;
        overflow: hidden;
        display: block;
        opacity: 0;
      `
  },

  sc_mixin: `
      font-family: 'Source Sans Pro', sans-serif;
      text-transform: uppercase;
      font-weight: 600;
      font-size: 0.8rem;
      letter-spacing: 0.2em;
      word-spacing: 0.1em;
      line-height: 1rem;
    `,

  // appearance
  radius: `3px`,

  // media queries
  "vw-med": "min-width: 36rem"
};
