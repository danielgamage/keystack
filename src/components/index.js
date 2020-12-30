// const req = require.context('./', true, /\.vue$|\.jsx/)
//
// let demos = {}
//
// const convertToTitleCase = (string) => {
//   return string[0].toUpperCase() + string.substr(1)
// }
//
// req.keys().map((filename) => {
//   const pathFragments = filename
//     .replace('./', '')
//     .replace('.jsx', '')
//     .split('/')
//
//   const componentName = pathFragments[
//     pathFragments.length - 1
//   ]
//
//   demos[componentName] = filename
// })
//
// console.log(demos)
//
// Object.keys(demos).map((key) => {
//   console.log('——————————')
//   console.log(key, demos[key])
//   console.log(req(demos[key]))
//   demos[key] = req(demos[key])
// })
//
// console.log(demos)
//
// export default demos

export { default as Icon } from "./elements/Icon"
export { default as Text } from "./elements/Text"
export { default as Kbd } from "./elements/Kbd"
export { default as Popover } from "./elements/Popover"
export { default as HiddenInput } from "./elements/HiddenInput"
export { default as Knob } from "./elements/Knob"
export { default as InputBar } from "./elements/InputBar"

export { default as TextInput } from "./forms/TextInput"
export { default as Button } from "./forms/Button"
export { default as AddButton } from "./forms/AddButton"
export { default as RemoveButton } from "./forms/RemoveButton"
export { default as NumericInput } from "./forms/NumericInput"
export { default as Select } from "./forms/Select"
export { default as Switch } from "./forms/Switch"
export { default as SwitchWithOptions } from "./forms/SwitchWithOptions"

export { default as Item } from "./devices/Item"
export { default as Envelope } from "./devices/Envelope"
export { default as PeriodicWaveInput } from "./devices/PeriodicWaveInput"
export { default as Oscillators } from "./devices/Oscillators"

export { default as Compressor } from "./devices/effects/Compressor"
export { default as Delay } from "./devices/effects/Delay"
export { default as Distortion } from "./devices/effects/Distortion"
export { default as Filter } from "./devices/effects/Filter"
export { default as StereoPanner } from "./devices/effects/StereoPanner"

export { default as KeySynth } from "./devices/instruments/KeySynth"
export { default as Sample } from "./devices/instruments/Sample"
export { default as Sampler } from "./devices/instruments/Sampler"

export { default as Chord } from "./devices/midi/Chord"
export { default as DisableNotes } from "./devices/midi/DisableNotes"
export { default as Transpose } from "./devices/midi/Transpose"

export { default as NoteHUD } from "./visualizers/NoteHUD"
export { default as GridKeys } from "./visualizers/GridKeys"
export { default as RadialKeys } from "./visualizers/RadialKeys"
export { default as Echo } from "./visualizers/Echo"
export { default as Waveform } from "./visualizers/Waveform"

export { default as Help } from "./app/Help"
export { default as UserSettings } from "./app/UserSettings"
export { default as ThemeSettings } from "./app/ThemeSettings"
export { default as Midi } from "./app/Midi"
export { default as StatusBar } from "./app/StatusBar"
export { default as TrackSettings } from "./app/TrackSettings"
export { default as Visualizers } from "./app/Visualizers"
export { default as App } from "./app/App"
