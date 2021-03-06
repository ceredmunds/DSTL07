/* define instructions trial */
var category_learning_instructions1 = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Instructions</b></p>" +
  "<p>In this experiment, you will fill the role of a junior seaman who must decide whether craft are friendly or hostile. " +
  " The experiment has three phases:</p>" +
  "<p><b>Phase 1. </b>where you learn the features of friendly and hostile craft.</p>" +
  "<p><b>Phase 2 and 3. </b>where you apply what you have learned in two real exercises.</p>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "learningInstructions" }
}
timeline.push(category_learning_instructions1)

var remember_instruction = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Rememeber...</b></p>" +
  "<p>There were two <i>craft</i>, in two <i>roles</i>, with two <i>statuses</i>, going in two <i>directions</i>, at two <i>speeds</i>. </p>" +
  "<p>The following few pages will remind you of what the symbols mean.</p>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "learningInstructions" }
}
reminder.push(remember_instruction)

var craft_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<p><b>Craft:</b> There are two types of craft.</p>" +
  "<div style='width: 550px;'>"+
    "<div class='stimulus' style='float: left;'><img src='img/stimuli/air.png'></img>" +
    "<p class='small'><strong>Airplanes</strong></p></div>" +
    "<div class='stimulus' style='float: right;'><img src='img/stimuli/submarine.png'></img>" +
    "<p class='small'><strong>Submarines</strong></p></div>" +
  "</div>"+
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "learningInstructions" }
}
timeline.push(craft_instructions)
reminder.push(craft_instructions)

var role_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:550px'>" +
  "<p><b>Role:</b> The craft can be either autonomous or a decoy as indicated by the following symbols.</p>" +
  "<div style='width: 550px;'>"+
  "<div class='stimulus' style='float: left;'><img src='img/stimuli/autonomous.png'></img>" +
  "<p class='small'><strong>Autonomous</strong></p></div>" +
  "<div class='stimulus' style='float: right;'><img src='img/stimuli/decoy.png'></img>" +
  "<p class='small'><strong>Decoy</strong></p></div>" +
  "</div>"+ "</div>"+
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "learningInstructions" }
}
timeline.push(role_instructions)
reminder.push(role_instructions)

var status_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:550px'>" +
  "<p><b>Status:</b> The craft can be either undamaged or damaged as indicated by the following symbols.</p>" +
  "<div style='width:550px;'>"+
    "<div class='stimulus' style='float: left;'><img src='img/stimuli/unharmed.png'></img>" +
    "<p class='small'><strong>Undamaged</strong></p></div>" +
    "<div class='stimulus' style='float: right;'><img src='img/stimuli/damaged.png'></img>" +
    "<p class='small'><strong>Damaged</strong></p></div>" +
  "</div>" + "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "learningInstructions" }
}
timeline.push(status_instructions)
reminder.push(status_instructions)

var direction_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:550px'>" +
  "<p><b>Direction:</b> The craft can either travel towards the left or the right.</p>" +
  "<div style='width: 550px;'>"+
    "<div class='stimulus' style='float: left;'><img src='img/stimuli/left.png'></img>" +
    "<p class='small'><strong>Left</strong></p></div>" +
    "<div class='stimulus' style='float: right;'><img src='img/stimuli/right.png'></img>" +
    "<p class='small'><strong>Right</strong></p></div>" +
  "</div>" + "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "learningInstructions" }
}
timeline.push(direction_instructions)
reminder.push(direction_instructions)

var speed_instructions = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:550px'>" +
  "<p><b>Speed:</b> The craft can either travel fast or slow.</p>" +
  "<div style='width: 550px;'>"+
    "<div class='stimulus' style='float: left;'><img src='img/stimuli/fast_number.png'></img>" +
    "<p class='small'><strong>Fast</strong></p></div>" +
    "<div class='stimulus' style='float: right;'><img src='img/stimuli/slow_number.png'></img>" +
    "<p class='small'><strong>Slow</strong></p></div>" +
  "</div>" + "</div>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard to continue.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "learningInstructions" }
}
timeline.push(speed_instructions)
reminder.push(speed_instructions)

var category_learning_instructions2 = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Phase 1</b></p>" +
  "<p>In phase 1, you will learn the features of friendly and hostile craft. " +
  " At the beginning of this phase you will have to guess, but using the feedback you should be able to work out the friendliness of each craft.</p>" +
  "<p>If you think the craft is <b>friendly</b>, please click on the friendly button.</p>" +
  "<p>If you think the craft is <b>hostile</b>, please click on the hostile button.</p>" +
  "<p>Please note that if you do not reach sufficient accuracy by the end of this phase, you will not be allowed to continue to the second phase of the experiment.</p>" +
  "<div style='height:80px;width:100%;position:absolute;bottom:80px;left:0px;'><p>Please press the <b>space key</b> on your keyboard when you are ready to begin the experiment.</p></div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "learningInstructions" },
  post_trial_gap: 500
}
timeline.push(category_learning_instructions2)
