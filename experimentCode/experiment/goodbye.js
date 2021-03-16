// exit fullscreen mode
// timeline2.push({
//   type: 'fullscreen',
//   fullscreen_mode: false
// })

var goodbye = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Thank you for taking part!</b></p>" +
  "<p>If you're curious, one possible strategy that would have scored you 90% (when all the data was available) would have been to focus on the " + predictiveDimension + " dimension.</p>" +
  "<p><a href='https://app.prolific.co/submissions/complete?cc=23DABDAA'>Click here to return to Prolific and complete the study</a>.</p>" +
  "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> to return to Prolific Academic.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "goodbye" },
  on_start: function () {
    var finishTime = new Date()
    console.log(finishTime)
    jsPsych.data.addProperties({
      finishTime: finishTime
    })
    saveData()
  }
}
timeline2.push(goodbye)
