/* create timeline */
var timeline = []
var images = ["img/blue.png", "img/orange.png"]

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
  stimulus: jsPsych.timelineVariable('dimension1'),
  data: { test_part: "category_learning_trial" }
}
// "<table><tr><td>Size: </td><td>"+jsPsych.timelineVariable('dimension1')+"</td></tr>" +
// "<tr><td>Color: </td><td>"+jsPsych.timelineVariable('dimension2')+"</td></tr></table>",
var category_learning_procedure = {
  timeline: [category_learning_trial],
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
  preload_images: images,
  on_finish: function () {
    saveData()
    jsPsych.data.displayData()
  }
})
