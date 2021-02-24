/* participant based variables */
var displayCondition = 'separated' // integrated or separated
var socialCondition = 'operator' // operator or superior

/* category learning variables */
var maxNumberCategoryLearningTrials = 2
var nUniqueStimuli = 4
var nDimensions = 5
var allLabels = ['Craft', 'Speed', 'Direction', 'Type', 'Status']
const dimensionOrder = jsPsych.randomization.sampleWithoutReplacement([1, 2, 3, 4, 5], nDimensions) // needs to match dimension names
// const dimensionLabels = labelOrder.map(i => allLabels[i])

const displayOrder = jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3, 4], nDimensions)

const categoryOrder = jsPsych.randomization.sampleWithoutReplacement([0, 1], 2)
const choices = ['f', 'h']
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

/* define instructions trial */
var category_learning_instructions1 = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Instructions</b></p>" +
  "<p>In this experiment, you will fill the role of a junior seaman who must decide whether craft are friendly or hostile. " +
  " The experiment has two phases:</p>" +
  "<p><b>Phase 1. </b>where you learn the features of friendly and hostile craft.</p>" +
  "<p><b>Phase 2. </b>where you apply what you have learned in real exercises.</p>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "category learning instructions" }
}
// timeline.push(category_learning_instructions1)

var craft_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<p><b>Stimuli</b></p>" +
  "<p>There are two types of craft:</p>" +
  "<div style='width: 550px;'>"+
    "<div class='stimulus' style='float: left;'><img src='img/stimuli/air.png'></img>" +
    "<p class='small'><strong>Airplanes</strong></p></div>" +
    "<div class='stimulus' style='float: right;'><img src='img/stimuli/submarine.png'></img>" +
    "<p class='small'><strong>Submarines</strong></p></div>" +
  "</div>"+
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "category learning instructions" }
}
// timeline.push(craft_instructions)

var type_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:550px'>" +
  "<p><b>Stimuli</b></p>" +
  "<p>The craft can be either autonomous or a decoy as indicated by the following symbols:</p>" +
  "<div style='width: 550px;'>"+
  "<div class='stimulus' style='float: left;'><img src='img/stimuli/autonomous.png'></img>" +
  "<p class='small'><strong>Autonomous</strong></p></div>" +
  "<div class='stimulus' style='float: right;'><img src='img/stimuli/decoy.png'></img>" +
  "<p class='small'><strong>Decoy</strong></p></div>" +
  "</div>"+ "</div>"+
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "category learning instructions" }
}
// timeline.push(type_instructions)

var status_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:550px'>" +
  "<p><b>Stimuli</b></p>" +
  "<p>The craft can be either undamaged or damaged as indicated by the following symbols:</p>" +
  "<div style='width:550px;'>"+
    "<div class='stimulus' style='float: left;'><img src='img/stimuli/unharmed.png'></img>" +
    "<p class='small'><strong>Undamaged</strong></p></div>" +
    "<div class='stimulus' style='float: right;'><img src='img/stimuli/damaged.png'></img>" +
    "<p class='small'><strong>Damaged</strong></p></div>" +
  "</div>" + "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "category learning instructions" }
}
// timeline.push(status_instructions)

if (displayCondition == "integrated") {
  var direction_instructions = {
    type: "html-keyboard-response",
    stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
    "<div style='width:550px'>" +
    "<p><b>Stimuli</b></p>" +
    "<p>The craft can either travel towards the left or the right.</p>" +
    "<p>Additionally, the craft can travel either fast or slow.</p>" +
    "<p>Speed and direction information are shown as lines.</p>" +
    "<div style='width: 550px;'>" +
      "<div class='stimulus' style='float: left;'><img src='img/stimuli/fast_left.png'></img>" +
      "<p class='small'><strong>Symbol for left and fast</strong></p></div>" +
      "<div class='stimulus' style='float: right;'><img src='img/stimuli/slow_right.png'></img>" +
      "<p class='small'><strong>Symbol for right and slow</strong></p></div>" +
    "</div>" + "</div>" +
    "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
    "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
    choices: ['space'],
    data: { test_part: "category learning instructions" }
  }
  // timeline.push(direction_instructions)
} else if (displayCondition == "separated") {
  var direction_instructions = {
    type: "html-keyboard-response",
    stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
    "<div style='width:550px'>" +
    "<p><b>Stimuli</b></p>" +
    "<p>The craft can either travel towards the left or the right:</p>" +
    "<div style='width: 550px;'>"+
      "<div class='stimulus' style='float: left;'><img src='img/stimuli/left.png'></img>" +
      "<p class='small'><strong>Left</strong></p></div>" +
      "<div class='stimulus' style='float: right;'><img src='img/stimuli/right.png'></img>" +
      "<p class='small'><strong>Right</strong></p></div>" +
    "</div>" + "</div>" +
    "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
    "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
    choices: ['space'],
    data: { test_part: "category learning instructions" }
  }
  // timeline.push(direction_instructions)

  var direction_instructions1 = {
    type: "html-keyboard-response",
    stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
    "<div style='width:550px'>" +
    "<p><b>Stimuli</b></p>" +
    "<p>The craft can either travel fast or slow:</p>" +
    "<div style='width: 550px;'>"+
      "<div class='stimulus' style='float: left;'><img src='img/stimuli/fast.png'></img>" +
      "<p class='small'><strong>Fast</strong></p></div>" +
      "<div class='stimulus' style='float: right;'><img src='img/stimuli/slow.png'></img>" +
      "<p class='small'><strong>Slow</strong></p></div>" +
    "</div>" + "</div>" +
    "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
    "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
    choices: ['space'],
    data: { test_part: "category learning instructions" }
  }
  // timeline.push(direction_instructions1)
}

var category_learning_instructions2 = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Phase 1</b></p>" +
  "<p>In phase 1, you will learn the features of friendly and hostile craft. " +
  " At the beginning of this phase you will have to guess, but using the feedback you should be able to work out the friendliness of each craft.</p>" +
  "<p>If you think the craft is <b>friendly</b>, please press the <b>F</b> key.</p>" +
  "<p>If you think the craft is <b>hostile</b>, please press the <b>H</b> key.</p>" +
  "<p>Please note that if you do not reach sufficient accuracy by the end of this phase, you will not be allowed to continue to the second phase of the experiment.</p>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard when you are ready to begin the experiment.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "category learning instructions" }
}
// timeline.push(category_learning_instructions2)

/* category learning phase */
var categorisation_trial = {
  type: 'category-button-response',
  displayCondition: displayCondition,
  dimension1: jsPsych.timelineVariable('dimension1'),
  dimension2: jsPsych.timelineVariable('dimension2'),
  dimension3: jsPsych.timelineVariable('dimension3'),
  dimension4: jsPsych.timelineVariable('dimension4'),
  dimension5: jsPsych.timelineVariable('dimension5'),
  dimOrder: dimensionOrder,
  displayOrder : displayOrder,
  choices: ['Friendly', 'Hostile'],
  response_ends_trial: true,
  data: {
    test_part: 'learning',
    abstract_category: jsPsych.timelineVariable('category')
  },
  on_finish: function (data) {
    data.correct_response = categoryLabels[data.abstract_category]

    if (data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response)) {
      data.correct = "true"
    } else {
      data.correct = "false"
    }
  }
}

var feedback = {
  type: 'html-keyboard-response',
  stimulus: function () {
    var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct
    if (last_trial_correct == "true") {
      return "<p>Correct!</p>"
    } else {
      return "<p>Wrong.</p>"
    }
  },
  choices: jsPsych.NO_KEYS,
  data: { test_part: 'feedback' },
  trial_duration: feedbackDuration,
  post_trial_gap: ITI
}

var category_learning_procedure = {
  timeline: [categorisation_trial, feedback],
  timeline_variables: category_learning_stimuli,
  randomize_order: true,
  loop_function: function () {
    // break loop if over trial limit
    var nTrials = jsPsych.data.get().filter({ test_part: "learning" }).count()
    if (nTrials >= maxNumberCategoryLearningTrials) {
      // data.switch = "maxNoTrials"
      return false
    }

    var last_n_trials = jsPsych.data.get().last(nUniqueStimuli)
    var last_n_correct_trials = last_n_trials.filter({ correct: "true" })
    var accuracy = Math.round(last_n_correct_trials.count() / last_n_trials.count())
    if (accuracy < learningCriterion) {
      // data.switch = "continue"
      return true // True to keep loop going
    } else {
      // data.switch = "greaterThanLC"
      return false
    }
  }
}
timeline.push(category_learning_procedure)

/* category test trials */
var category_test_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Phase 1 Complete</b></p>" +
  "<p>Congratulations, you've finished the first phase!</p>" +
  "<p></p>" +
  "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "category test instructions" }
}
timeline.push(category_test_instructions)

var conditionInstruction = ""
if (socialCondition == 'operator') {
  conditionInstruction = "<p>The confidence ratings are important, so your fellow operators know which craft to double check.</p>"
} else if (socialCondition == 'superior') {
  conditionInstruction = "<p>The confidence ratings are important, so your senior officer knows how to appropriately use the information.</p>"
}

var category_test_instructions1 = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Phase 2</b></p>" +
  "<p>Here, you get to use the knowledge you've gained in an actual exercise.</p>" +
  "<p>On each trial, you'll again have to categorise a craft as friendly or hostile.</p>" +
  "<p>In addition, you'll be asked to rate your confidence in your categorisation with a slider.</p>" +
  conditionInstruction +
  "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard when you are ready to start.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "category test instructions" }
}
timeline.push(category_test_instructions1)

var confidence_rating = {
  type: 'html-slider-response',
  stimulus: 'How confident are you in your classification?',
  labels: ['No idea', 'Certain'],
  require_movement: true
}

var category_test_procedure = {
  timeline: [categorisation_trial, confidence_rating],
  timeline_variables: category_test_stimuli,
  repetitions: 1,
  randomize_order: true
}
timeline.push(category_test_procedure)

/* Verbal report */
var verbal_report_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Verbal report</b></p>" +
  "<p>In the following, we will ask you some questions about how you completed this experiment.</p>" +
  "<p>Don't worry: there are absolutely no wrong answers!</p>" +
  "<p>Also, your answers to these questions WILL NOT influence whether you are paid.</p>" +
  "<p>Just try your best to explain as clearly and in as much detail as possible the answer.</p>" +
  "<p>Press any key to begin.</p>" +
  "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to begin.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "verbal report instructions" },
  on_start: function () {
    document.getElementsByClassName("jspsych-content-wrapper")[0].style.color = "black"
    document.getElementsByClassName("jspsych-content-wrapper")[0].style.backgroundColor = "white"
  }
}
timeline.push(verbal_report_instructions)

var survey_trial = {
  type: 'survey-text',
  questions: [
    { prompt: "Please describe which stimulus dimension you thought was most important:", rows: 30, columns: 60, name: 'stimDimensionQ'}
  ],
  data: { test_part: "verbal report_trial" }
}
timeline.push(survey_trial)

/* define debrief */
// var debrief_block = {
//   type: "html-keyboard-response",
//   stimulus: function() {
//
//     var trials = jsPsych.data.get().filter({test_part: 'test'});
//     var correct_trials = trials.filter({correct: "true"});
//     var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
//     var rt = Math.round(correct_trials.select('rt').mean());
//
//     return "<p>You responded correctly on "+accuracy+"% of the trials.</p>"+
//     "<p>Your average response time was "+rt+"ms.</p>"+
//     "<p>Press any key to complete the experiment. Thank you!</p>";
//
//   },
//   data: {test_part: "debrief"}
// }
// timeline.push(debrief_block)

var goodbye = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Thank you for taking part!</b></p>" +
  "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> to return to Prolific Academic.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "goodbye" }
}
timeline.push(goodbye)

function saveData() {
  var xhr = new XMLHttpRequest()
  xhr.open("POST", "php/write_data.php") // change 'write_data.php' to point to php script.
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = function() {
    if(xhr.status == 200){
      console.log(xhr.response)
      // var response = JSON.parse(xhr.responseText);
      // console.log(response.success);
    }
  }
  xhr.send(jsPsych.data.get().json())
}

/* start the experiment */
jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    saveData()
    jsPsych.data.displayData()
  }
})
