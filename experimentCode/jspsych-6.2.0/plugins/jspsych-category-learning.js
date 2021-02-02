/** **/

jsPsych.plugins["category-learning"] = (function() {

  var plugin = {}

  plugin.info = {
    name: 'category-learning',
    description: '',
    parameters: {
      condition: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Condition',
        default: null,
        description: 'Condition: either separable or integral.'
      },
      nBoats: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'NBoats',
        default: null,
        description: 'Number of boats.'
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
      labels: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: 'Labels',
        default: jsPsych.ALL_KEYS,
        description: 'Name of the labels for each dimension in order.'
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
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // Get generic boats
    var html_boats = ''
    for (var i = 0; i < trial.nBoats; i++) {
      var pos_top = Math.round(Math.random() * 475 + 5)
      var pos_left = Math.round(Math.random() * 475 + 5)
      html_boats += "<img width='20px' src='img/background/boat.png' style='position:absolute;top:" + pos_top + "px;left:" + pos_left + "px;'></img>"
    }

    // Add highlighted boat
    var pos_top = Math.round(Math.random() * 250 + 125)
    var pos_left = Math.round(Math.random() * 250 + 125)
    html_boats += "<img width='30px' src='img/background/highlighted_boat.png' style='position:absolute;top:" + pos_top + "px;left:" + pos_left + "px;'></img>"

    var image_html = "<div style='float:left; margin-right:200px; position: relative;'>" +
    "<img src='img/background/radar.png' width='500' style='position:relative;'></img>" +
    html_boats +
    "</div>"

    if (trial.condition == 'separable') {
      var table_html = '<div style="float:left;">' +
      '<table width=150 style="margin-top: 100;">' +
      '<tr><td>' + '</td><td>' + '</td></tr>' +
      '<tr><td>' + trial.labels[0] + ': </td><td>' + trial.dimension1 + '</td></tr>' +
      '<tr><td>' + trial.labels[1] + ': </td><td>' + trial.dimension2 + '</td></tr>' +
      '<tr><td>' + trial.labels[2] + ': </td><td>' + trial.dimension3 + '</td></tr>' +
      '<tr><td>' + trial.labels[3] + ': </td><td>' + trial.dimension4 + '</td></tr>' +
      '<tr><td>' + trial.labels[4] + ': </td><td>' + trial.dimension5 + '</td></tr>' +
      '</table>' + '</div>'
      var new_html = '<div id="jspsych-category-learning-stimulus">' +
      image_html + table_html + '</div>'
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
        "image": trial.imageURL,
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
        display_element.querySelector('#jspsych-html-keyboard-response-stimulus').style.visibility = 'hidden';
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
})()
