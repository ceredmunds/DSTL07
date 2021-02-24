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
