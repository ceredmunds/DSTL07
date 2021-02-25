/* participant based variables */
var displayCondition = 'separated' // integrated or separated
var socialCondition = 'operator' // operator or superior

/* category learning variables */
var maxNumberCategoryLearningTrials = 2
var nUniqueStimuli = 4
var nDimensions = 5
var allLabels = ['Craft', 'Speed', 'Direction', 'Type', 'Status']
const dimensionOrder = jsPsych.randomization.sampleWithoutReplacement([1, 2, 3, 4, 5], nDimensions) // needs to match dimension names

const displayOrder = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3, 4], nDimensions)

const categoryOrder = jsPsych.randomization.sampleWithoutReplacement([0, 1], 2)
const choices = ['Friendly', 'Hostile']
const categoryLabels = categoryOrder.map(i => choices[i])
// const fIndex = categoryLabels.indexOf('f')
// const hIndex = categoryLabels.indexOf('h')

var feedbackDuration = 1000 // in ms
var ITI = 500 // in ms
var learningCriterion = 0.5 // number between 0 and 1a

/* create timeline */
var timeline = []

/* define welcome message trial */
var welcome = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p style='font-size:26px'><b>Welcome to the experiment and thank you for taking part.</b></p>" +
  "<p>Note that this experiment is designed for resolutions of 1200<i>px</i> by 800<i>px</i>. If your screen has a lower resolution than this, please return this experiment.</p>" +
  "<p>If you have any questions or concerns, remember that you can always contact us via the Prolific message system.</p>" +
  "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to begin.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "welcome" }
}
timeline.push(welcome)
