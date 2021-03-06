/* Verbal report */
var verbal_report_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Verbal report</b></p>" +
  "<p>In the following, we will ask you some questions about how you completed this experiment.</p>" +
  "<p>Don't worry: there are no wrong answers!</p>" +
  "<p>Just try your best to explain as clearly and in as much detail as possible the answer.</p>" +
  "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to begin.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "verbal_report_instructions" },
  on_start: function () {
    document.getElementsByClassName("jspsych-content-wrapper")[0].style.color = "black"
    document.getElementsByClassName("jspsych-content-wrapper")[0].style.backgroundColor = "white"
  }
}
timeline2.push(verbal_report_instructions)
timeline2 = timeline2.concat(reminder)

var dimension_options = allLabels
dimension_options.push("I don't know")

var allLabels = ['Craft', 'Speed', 'Direction', 'Type', 'Status']

var survey_trial = {
  type: 'survey-text',
  questions: [
    { prompt: "Craft (Airplane/Submarine)", name: 'craft', columns:3 },
    { prompt: "Role (Autonomous/Decoy)", name: 'role', columns:3 },
    { prompt: "Status (Undamaged/Damaged)", name: 'status', columns:3 },
    { prompt: "Speed (Fast/Slow)", name: 'speed', columns:3 },
    { prompt: "Direction (Left/Right)", name: 'direction', columns:3 }
  ],
  preamble: "<div style='width:700px'>" +
  "<p>First, we would like you to rank the features, from most to least important, based on how important they were for classifying a craft as friendly or hostile. " +
  "Please put the numbers 1 to 5 in the boxes below, with 1 meaning most important and 5 meaning least important. </p>" +
  "</div>",
  randomize_question_order: true,
  autocomplete: false,
  data: { test_part: "verbal_report_ranking_phase2"}
}
timeline2.push(survey_trial)

var survey_trial = {
  type: 'survey-text',
  questions: [
    { prompt: "Please describe how exactly you decided whether a craft was friendly or hostile in the previous task.", rows: 20, columns: 60, name: 'stimDimensionQphase2'}
  ],
  data: { test_part: "verbal_report_textbox_phase2" }
}
timeline2.push(survey_trial)
