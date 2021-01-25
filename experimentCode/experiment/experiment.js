/* create timeline */
var timeline = []

/* category learning variables */
var nDimensions = 2
var allLabels = ['Size', 'Color']
var dimensionLabels = jsPsych.randomization.sampleWithoutReplacement(allLabels, nDimensions)
var feedbackDuration = 1000 // in ms
var ITI = 500 // in ms

/* define welcome message trial */
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin.",
  data: {test_part: "welcome"}
}
timeline.push(welcome)

/* define instructions trial */
var instructions = {
  type: "html-keyboard-response",
  stimulus: "<p>In this experiment, a circle will appear in the center " +
      "of the screen.</p><p>If the circle is <strong>blue</strong>, " +
      "press the letter F on the keyboard as fast as you can.</p>" +
      "<p>If the circle is <strong>orange</strong>, press the letter J " +
      "as fast as you can.</p>" +
      "<div style='width: 700px;'>"+
      "<div style='float: left;'><img src='img/blue.png'></img>" +
      "<p class='small'><strong>Press the F key</strong></p></div>" +
      "<div class='float: right;'><img src='img/orange.png'></img>" +
      "<p class='small'><strong>Press the J key</strong></p></div>" +
      "</div>"+
      "<p>Press any key to begin.</p>",
  post_trial_gap: 200,
  data: { test_part: "instructions" }
}
timeline.push(instructions)

/* category learning trial */
var category_learning_trial = {
  type: "category-learning",
  imageURL: "img/radar.jpg",
  dimension1: jsPsych.timelineVariable('dimension1'),
  dimension2: jsPsych.timelineVariable('dimension2'),
  labels: dimensionLabels,
  choices: ['f', 'j'],
  data: {
    test_part: "category_learning_trial",
    dimLabels: dimensionLabels,
    correct_response: jsPsych.timelineVariable('category')
  },
  on_finish: function (data) {
    if (data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response)) {
      data.correct = "true"
    } else {
      data.correct = "false"
    }
  }
}

var category_learning_feedback = {
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
  trial_duration: feedbackDuration,
  post_trial_gap: ITI
}

var category_learning_procedure = {
  timeline: [category_learning_trial, category_learning_feedback],
  timeline_variables: category_learning_stimuli,
  repetitions: 1,
  randomize_order: true
}
timeline.push(category_learning_procedure)

// var test = {
//   type: "image-keyboard-response",
//   stimulus: jsPsych.timelineVariable('stimulus'),
//   choices: ['f', 'j'],
//   data: jsPsych.timelineVariable('data'),
//   on_finish: function(data){
//     if (data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response)) {
//       data.correct = "true"
//     } else {
//       data.correct = "false"
//     }
//   }
// }
//


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
  stimulus: "<p>Thank you for taking part!</p>",
  data: {test_part: "goodbye"}
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
