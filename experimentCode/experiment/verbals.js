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
