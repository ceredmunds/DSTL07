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
  data: { test_part: "verbal_report_instructions_phase3" },
  on_start: function () {
    document.getElementsByClassName("jspsych-content-wrapper")[0].style.color = "black"
    document.getElementsByClassName("jspsych-content-wrapper")[0].style.backgroundColor = "white"
  }
}
timeline.push(verbal_report_instructions)

var survey_trial_partial = {
  type: 'survey-text',
  questions: [
    { prompt: "Craft", name: 'craft', columns:3 },
    { prompt: "Speed", name: 'speed', columns:3 },
    { prompt: "Direction", name: 'direction', columns:3 },
    { prompt: "Type", name: 'type', columns:3 },
    { prompt: "Status", name: 'status', columns:3 }
  ],
  preamble: "<div style='width:700px'>" +
  "<p>First, we would like you to rate the features in terms of how important they were for classifying a craft as friendly or hostile. " +
  "Please put the numbers 1 to 5 in the boxes below, with 1 meaning most important and 5 meaning least important. </p>" +
  "</div>",
  randomize_question_order: true,
  autocomplete: false,
  data: { test_part: "verbal_report_ranking_phase3"}
}
timeline.push(survey_trial_partial)

var survey_trial_partial = {
  type: 'survey-text',
  questions: [
    { prompt: "Please describe how exactly you decided whether a craft was friendly or hostile in the previous task.", rows: 20, columns: 60, name: 'stimDimensionQphase3'}
  ],
  data: { test_part: "verbal_report_textbox_phase3" }
}
timeline.push(survey_trial_partial)

var survey_trial_partial = {
  type: 'survey-text',
  questions: [
    { prompt: "Finally, please describe how your approach changed once a piece of information was removed.", rows: 20, columns: 60, name: 'changeQphase3'}
  ],
  data: { test_part: "verbal_report_textbox_phase3_change" }
}
timeline.push(survey_trial_partial)
