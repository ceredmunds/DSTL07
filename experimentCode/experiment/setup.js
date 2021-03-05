/* participant based variables */
var displayCondition = 'separated' // integrated or separated
var socialCondition = 'operator' // operator or superior

/* category learning variables */
var maxNumberCategoryLearningTrials = 20// 200
var nUniqueStimuli = 5 // 20
var nDimensions = 5
var allLabels = ['Craft', 'Type', 'Status', 'Speed', 'Direction']
const dimensionOrder = jsPsych.randomization.sampleWithoutReplacement([1, 2, 3, 4, 5], nDimensions) // needs to match dimension names
var predIndex = dimensionOrder.indexOf(1)
var predictiveDimension = allLabels[predIndex]
console.log(predictiveDimension)

const displayOrder = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3, 4], nDimensions)

const categoryOrder = jsPsych.randomization.sampleWithoutReplacement([0, 1], 2)
const choices = ['Friendly', 'Hostile']
const categoryLabels = categoryOrder.map(i => choices[i])
// const fIndex = categoryLabels.indexOf('f')
// const hIndex = categoryLabels.indexOf('h')

var feedbackDuration = 1000 // in ms
var ITI = 500 // in ms
var learningCriterion = 0.8 // number between 0 and 1a

var nRoundsTestTrial = 1

/* get start time */
var startTime = new Date()
var failedLearningCriterion = false
var completedExperiment = false

/* get participant information */
var prolific_id = jsPsych.data.getURLVariable('PROLIFIC_PID')
var study_id = jsPsych.data.getURLVariable('STUDY_ID')
var session_id = jsPsych.data.getURLVariable('SESSION_ID')

if (prolific_id == undefined) {
  prolific_id = jsPsych.randomization.randomID()
  study_id = "Not on prolific"
  session_id = "Not on prolific"
}

jsPsych.data.addProperties({
  displayCondition: displayCondition,
  socialCondition: socialCondition,
  startTime: startTime,
  prolific_id: prolific_id,
  study_id: study_id,
  session_id: session_id,
  dimensionOrder: dimensionOrder.map(i => allLabels[i-1]).toString()
})

function saveData () {
  var xhr = new XMLHttpRequest()
  console.log(xhr)
  xhr.open("POST", "php/write_data.php") // change 'write_data.php' to point to php script.
  console.log(xhr)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = function () {
    if (xhr.status == 200) {
      console.log("status 200")
      // console.log(xhr.response)
      var response = JSON.parse(xhr.responseText)
      console.log(response.success)
    }
  }
  xhr.send(jsPsych.data.get().json())
}

/* create timelines */
var timeline = []
var reminder = []

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
  data: {
    test_part: "welcome"
  },
  on_finish: saveData()
}
timeline.push(welcome)

timeline.push({
  type: 'fullscreen',
  fullscreen_mode: true
})
