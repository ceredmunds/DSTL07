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
