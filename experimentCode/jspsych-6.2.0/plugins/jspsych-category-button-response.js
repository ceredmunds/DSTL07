/**
 * jspsych-category-button-response
 * Adapted by C. E. R. Edmunds from code by Josh de Leeuw
 *
 * plugin for displaying a naval stimulus and getting a button response
 *
 **/

jsPsych.plugins['category-button-response'] = (function () {
  var plugin = {}

  plugin.info = {
    name: 'html-category-button-response',
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
      removePredictiveDimension: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: false,
        description: 'If true, then trial will end when user responds.'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
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
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    if (trial.removePredictiveDimension) {
      var predIndex = trial.dimOrder.indexOf(1)
    }

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
    role = eval("trial.dimension" + trial.dimOrder[1])
    if (role == 0) {
      roleHtml = '<img src="img/stimuli/autonomous.png"></img>'
    } else if (role == 1) {
      roleHtml = '<img src="img/stimuli/decoy.png"></img>'
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
    if (speed == 0) {
      speedHtml = '<img src="img/stimuli/slow_number.png"></img>'
    } else if (speed == 1) {
      speedHtml = '<img src="img/stimuli/fast_number.png"></img>'
    }
    // Get direction
    direction = eval("trial.dimension" + trial.dimOrder[4])

    if (trial.displayCondition == 'separated') {
      // Get direction html
      if (direction == 0) {
        directionHtml = '<img src="img/stimuli/left.png"></img>'
      } else if (direction == 1) {
        directionHtml = '<img src="img/stimuli/right.png"></img>'
      }
      // get all html together
      var stimulusHtml = [craftHtml, roleHtml, statusHtml, speedHtml, directionHtml]
      if (trial.removePredictiveDimension) {
        stimulusHtml[predIndex] = '<img src="img/stimuli/NA.png"></img>'
      }

      // Randomise order of presentation (per participant)
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

      var html = '<div id="jspsych-html-button-response-stimulus">' + stimulus + '</div>'
    } else if (trial.displayCondition == 'integrated') {
      // Get direction html
      if (direction == 0) {
        directionHtml = '<img src="img/stimuli/fast_left.png"></img>'
      } else if (direction == 1) {
        directionHtml = '<img src="img/stimuli/fast_right.png"></img>'
      }

      var displayHtml = [craftHtml, roleHtml, statusHtml, speedHtml, directionHtml] // don't need to randomise order in this condition
      if (trial.removePredictiveDimension) {
        displayHtml[predIndex] = ""
      }
      stimulus = '<div class="background">' +
      '<div class="layer">' + displayHtml[4] + '</div>' +
      '<div class="layer">' + displayHtml[0] + '</div>' +
      '<div class="layer">' + displayHtml[2] + '</div>' +
      '<div class="layer" style="top:' + yPos + ';">' + displayHtml[1] + '</div>' + // edit to shift decoy to correct place
      '<div class="layer">' + displayHtml[3] + '</div>' +
      '</div>'
      var html = '<div id="jspsych-html-button-response-stimulus" style="margin-left:145px;">' + stimulus + '</div>'
    } else {
      stimulus = 'WARNING: UNDEFINED CONDITION'
      // Display stimulus
      var html = '<div id="jspsych-html-button-response-stimulus">' + 'WARNING: UNDEFINED CONDITION' + '</div>'
    }

    // display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in html-button-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    html += '<div id="jspsych-html-button-response-btngroup">';
    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html += '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    html += '</div>'

    // function to handle responses by the subject
    function after_response(choice) {
      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = parseInt(choice);
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial () {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      }

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }
    display_element.innerHTML = html;

    // start time
    var start_time = performance.now();

    setTimeout(() => {
    // add event listeners to buttons
      for (var i = 0; i < trial.choices.length; i++) {
        display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e) {
          var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
          after_response(choice);
        })
      }
    }, 500) // Add 1000ms delay

    // store response
    var response = {
      rt: null,
      button: null
    };

    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        display_element.querySelector('#jspsych-html-button-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }
  };

  return plugin;
})();
