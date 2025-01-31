/**
 * jspsych-html-keyboard-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


jsPsych.plugins["category-learning"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-keyboard-response',
    description: '',
    parameters: {
      displayCondition: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Condition',
        default: null,
        description: 'Condition: either separated or integrated.'
      },
      dimension1: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      dimension2: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      dimension3: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      dimension4: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      dimension5: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      dimOrder: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: 'Labels',
        default: jsPsych.ALL_KEYS,
        description: 'Name of the labels for each dimension in order.'
      },
      displayOrder: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: 'Labels',
        default: jsPsych.ALL_KEYS,
        description: 'Order that dimensions should display in separable condition.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },

    }
  }

  plugin.trial = function(display_element, trial) {
    // Get stimulus to display
    var stimulus = ''
    // Get craft
    var craft = eval("trial.dimension" + trial.dimOrder[0])
    if (craft == 0) {
      craftHtml = '<img src="img/stimuli/air.png"></img>'
      var yPos = "0px"
    } else if (craft == 1) { // submarine
      craftHtml = '<img src="img/stimuli/submarine.png"></img>'
      var yPos = "-30px" // edit to shift decoy to correct place
    }
    // Get type
    type = eval("trial.dimension" + trial.dimOrder[1])
    if (type == 0) {
      typeHtml = '<img src="img/stimuli/autonomous.png"></img>'
    } else if (type == 1) {
      typeHtml = '<img src="img/stimuli/decoy.png"></img>'
    }
    // Get status
    status = eval("trial.dimension" + trial.dimOrder[2])
    if (status == 0) {
      statusHtml = '<img src="img/stimuli/unharmed.png"></img>'
    } else if (status == 1) {
      statusHtml = '<img src="img/stimuli/damaged.png"></img>'
    }
    // Get speed
    speed = eval("trial.dimension" + trial.dimOrder[3])
    // Get direction
    direction = eval("trial.dimension" + trial.dimOrder[4])

    if (trial.displayCondition == 'separated') {
      // Get speed html
      if (speed == 0) {
       speedHtml = '<img src="img/stimuli/slow.png"></img>'
      } else if (speed == 1) {
       speedHtml = '<img src="img/stimuli/fast.png"></img>'
      }
     // Get direction html
     if (direction == 0) {
       directionHtml = '<img src="img/stimuli/left.png"></img>'
     } else if (direction == 1) {
       directionHtml = '<img src="img/stimuli/right.png"></img>'
     }
      // Randomise order of presentation (per participant)
      stimulusHtml = [craftHtml, typeHtml, statusHtml, speedHtml, directionHtml]
      const displayHtml = trial.displayOrder.map(i => stimulusHtml[i])
      stimulus = '<div class="row">' +
      '<div class="column">' + displayHtml[0] + '</div>' +
      '<div class="column">' + displayHtml[1] + '</div>' +
      '<div class="column">' + displayHtml[2] + '</div>' +
      '</div>' +
      '<div class="row">' +
      '<div class="shift">' + displayHtml[3] + '</div>' +
      '<div class="column">' + displayHtml[4] + '</div>' +
      '</div>'

      var new_html = '<div id="jspsych-category-learning-stimulus">' + stimulus + '</div>'
    } else if (trial.displayCondition == 'integrated') {
      var xPos = "0px" // offset for slow submarine to compensate for badly drawn stimulus
      // Get spped and direction html
      if (speed==0 & direction==0) {
        speedDirectionHtml = '<img src="img/stimuli/slow_left.png"></img>'
        if (craft == 1) {
          xPos = "-15px"
        }
      } else if (speed==1 & direction==0) {
        speedDirectionHtml = '<img src="img/stimuli/fast_left.png"></img>'
      } else if (speed==0 & direction==1) {
        speedDirectionHtml = '<img src="img/stimuli/slow_right.png"></img>'
        if (craft == 1) {
          xPos = "15px"
        }
      } else if (speed==1 & direction==1) {
        speedDirectionHtml = '<img src="img/stimuli/fast_right.png"></img>'
      }
      displayHtml = [speedDirectionHtml, craftHtml, typeHtml, statusHtml] // don't need to randomise order in this condition
      stimulus = '<div class="background">' +
      '<div class="layer" style="left:' + xPos + ';">' + displayHtml[0] + '</div>' +
      '<div class="layer">' + displayHtml[1] + '</div>' +
      '<div class="layer" style="top:' + yPos + ';">' + displayHtml[2] + '</div>' + // edit to shift decoy to correct place
      '<div class="layer">' + displayHtml[3] + '</div>' +
      '</div>'
      var new_html = '<div id="jspsych-category-learning-stimulus">' + stimulus + '</div>'
    } else {
      stimulus = 'WARNING: UNDEFINED CONDITION'
      // Display stimulus
      var new_html = '<div id="jspsych-category-learning-stimulus">' + 'WARNING: UNDEFINED CONDITION' + '</div>'
    }

    // add prompt
    if(trial.prompt !== null){
      new_html += trial.prompt;
    }

    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-category-learning-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-category-learning-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
