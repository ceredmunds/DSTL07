
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
  data: { test_part: "category_test_instructions" }
}
timeline2.push(category_test_instructions)

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
  data: {
    test_part: "category_test_instructions",
    testN: 0
  }
}
timeline2.push(category_test_instructions1)
