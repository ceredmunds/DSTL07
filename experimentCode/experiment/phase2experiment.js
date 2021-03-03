var categorisation_test_trial = {
  type: 'category-button-response',
  displayCondition: displayCondition,
  dimension1: jsPsych.timelineVariable('dimension1'),
  dimension2: jsPsych.timelineVariable('dimension2'),
  dimension3: jsPsych.timelineVariable('dimension3'),
  dimension4: jsPsych.timelineVariable('dimension4'),
  dimension5: jsPsych.timelineVariable('dimension5'),
  dimOrder: dimensionOrder,
  displayOrder : displayOrder,
  removePredictiveDimension: false,
  choices: ['Friendly', 'Hostile'],
  response_ends_trial: true,
  data: {
    test_part: 'test',
    stimulusID: jsPsych.timelineVariable('stimulusID'),
    dimension1: jsPsych.timelineVariable('dimension1'),
    dimension2: jsPsych.timelineVariable('dimension2'),
    dimension3: jsPsych.timelineVariable('dimension3'),
    dimension4: jsPsych.timelineVariable('dimension4'),
    dimension5: jsPsych.timelineVariable('dimension5'),
    abstract_category: jsPsych.timelineVariable('category')
  },
  on_finish: function (data) {
    // Get response in terms of labels
    data.response = ['Friendly', 'Hostile'][data.button_pressed]
    // Get correct, randomised, answer ['Friendly', 'Hostile']
    data.correct_response = categoryLabels[data.abstract_category]
    // determine if response correct
    if (data.response == data.correct_response) {
      data.correct = "true"
    } else {
      data.correct = "false"
    }
  }
}

var confidence_rating = {
  type: 'html-slider-response',
  stimulus: '<p style="font-size:20px;">How confident are you in your classification?</p>',
  labels: ['<p style="font-size:18px;">No idea</p>', '<p style="font-size:18px;">Certain</p>'],
  require_movement: true,
  slider_width: 600,
  data: {
    test_part: 'confidence_rating_test',
    stimulusID: jsPsych.timelineVariable('stimulusID'),
    dimension1: jsPsych.timelineVariable('dimension1'),
    dimension2: jsPsych.timelineVariable('dimension2'),
    dimension3: jsPsych.timelineVariable('dimension3'),
    dimension4: jsPsych.timelineVariable('dimension4'),
    dimension5: jsPsych.timelineVariable('dimension5'),
    abstract_category: jsPsych.timelineVariable('category')
  }
}

var category_test_procedure = {
  timeline: [categorisation_test_trial, confidence_rating],
  timeline_variables: category_test_stimuli,
  repetitions: nRoundsTestTrial,
  randomize_order: true
}
timeline2.push(category_test_procedure)
