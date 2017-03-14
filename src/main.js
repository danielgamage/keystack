import { select, selectAll } from "d3-selection"
import { axisLeft } from "d3-axis"
import { scaleLinear } from "d3-scale"
import { radialLine } from "d3-shape"
import { range } from "d3-array"

import { keys, noteForIndex } from './utils'
import keySteps from './data/keySteps'

import './styles/style.scss'

const body = document.body


//
// Chart
//

var width = 400,
    height = 400,
    num_axes = 12,
    tick_axis = 1,
    start = 0,
    end = 7

// offset from center so there's less curl in the center
var radius = scaleLinear()
  .domain([start, end])
  .range([0, Math.min(width,height) / 2 - 25]);

var angle = scaleLinear()
  .domain([0,num_axes])
  .range([0,360])

var svg = select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
  .append("g")
    .attr("transform", "translate(" + width/2 + "," + (height/2) +")");

svg.selectAll("circle.tick")
    .data(range(end,start,(start-end) / 8))
  .enter().append("circle")
    .attr("class", "tick")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", function(d) { return radius(d); })

svg.selectAll(".axis")
    .data(range(num_axes))
  .enter().append("g")
    .attr("class", "axis")
    .attr("transform", function(d) { return "rotate(" + -angle(d) + ")"; })
  .call(radial_tick)
  .append("text")
    .attr("y", radius(end)+24)
    .text(function(d,i) {
      return noteForIndex(i)
    })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) { return "rotate(" + (180 - (360/12/2)) + ")" })

function radial_tick(selection) {
  selection.each(function(axis_num) {
    axisLeft(radius)
      .ticks(5)
      .tickValues( axis_num == tick_axis ? null : [])

    select(this)
      .selectAll("text")
      .attr("text-anchor", "bottom")
      .attr("transform", "rotate(" + angle(axis_num) + ")")
  });
}

keys.map((el, i) => {
  var index = i/12 + 2
  var newEnd = index + 1/12
  var pieces = range(index, newEnd, (newEnd-index)/(newEnd*12))
  var r = end * 5

  var theta = function(r) {
	  return -2*Math.PI*r
	}

  var radius2 = scaleLinear()
    .domain([start, end])
    .range([0, Math.min(width, height) / 3.5]);

	var spiral = radialLine()
	  .angle(theta)
	  .radius(radius2)

  svg.selectAll(`.spiral.spiral-${i}`)
	    .data([el])
	  .enter().append("path")
	    .attr("class", (d) => `spiral spiral-${i} ${(d.black) ? "black" : "white"}`)
	    .attr("d", (d) => spiral(pieces))
})

//
// Keyboard
//

let octave = 3

window.addEventListener("keydown", (e) => {
  if (e.key === "z") {
    octave = Math.max(--octave, 0)
  } else if (e.key === "x") {
    octave = Math.min(++octave, 5)
  } else {
    const steps = keySteps.filter(key => e.key === key.key)[0].step
    const note = keys[steps + 2 + (octave * 12)]
    startNote(note)
  }
})
window.addEventListener("keyup", (e) => {
  const steps = keySteps.filter(key => e.key === key.key)[0].step
  const note = keys[steps + 2 + (octave * 12)]
  stopNote(note)
})

//
// Audio
//

var audioCtx = new AudioContext(),
    masterVolume = audioCtx.createGain();

masterVolume.gain.value = 0.2;
masterVolume.connect(audioCtx.destination);

var oscillators = {};

const stopNote = (note) => {
  oscillators[note.frequency].oscillators.forEach((oscillator) => {
    oscillator.stop(audioCtx.currentTime + 2);
  });
  document.querySelector(`.spiral-${note.index}`)
    .classList.remove('on')
  oscillators[note.frequency].volume.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 1);
  oscillators[note.frequency] = null;

}
const startNote = (note) => {
  // prevent sticky keys
  if (!oscillators[note.frequency]) {
    document.querySelector(`.spiral-${note.index}`)
      .classList.add('on')

    var osc = audioCtx.createOscillator(),
      osc2 = audioCtx.createOscillator();

    osc.frequency.value = note.frequency;
    osc.type = 'sawtooth';

    osc2.frequency.value = note.frequency;
    osc2.type = 'triangle';

    var noteVolume = audioCtx.createGain();
    noteVolume.gain.value = 0.2;
    noteVolume.connect(audioCtx.destination);

    osc.connect(noteVolume);
    osc2.connect(noteVolume);

    oscillators[note.frequency] = {
      oscillators: [osc, osc2],
      volume: noteVolume
    };

    osc.start(audioCtx.currentTime);
    osc2.start(audioCtx.currentTime);
    noteVolume.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.05);
  }
}

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false // this defaults to 'false' and we won't be covering sysex in this article.
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    console.log("No MIDI support in your browser.");
}

const getNoteIndexForMIDI = (code) => {
  return code - 20
}

//
// MIDI
//

function onMIDIMessage(event) {
    console.log(event.data)
    var data = event.data,
        cmd = data[0] >> 4,
        channel = data[0] & 0xf,
        type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
        note = data[1],
        velocity = data[2];
    // with pressure and tilt off
    // note off: 128, cmd: 8
    // note on: 144, cmd: 9
    // pressure / tilt on
    // pressure: 176, cmd 11:
    // bend: 224, cmd: 14

    var note = getNoteIndexForMIDI(note)

    switch (type) {
        case 144: // noteOn message
            startNote(keys[note])
            break;
        case 128: // noteOff message
            stopNote(keys[note])

            break;
    }
}

function onMIDISuccess(midiAccess) {
    // when we get a succesful response, run this code
    console.log('MIDI Access Object', midiAccess);
    const inputs = midiAccess.inputs.values();
    console.log(inputs)
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // listen for midi messages
        input.value.onmidimessage = onMIDIMessage;
    }
    // listen for connect/disconnect message
    // midiAccess.onstatechange = onStateChange;
}

function onMIDIFailure(e) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}
