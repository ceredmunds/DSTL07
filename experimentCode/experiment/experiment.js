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
