var categorisation_test_trial_partial = {
  type: 'category-button-response',
  displayCondition: displayCondition,
  dimension1: jsPsych.timelineVariable('dimension1'),
  dimension2: jsPsych.timelineVariable('dimension2'),
  dimension3: jsPsych.timelineVariable('dimension3'),
  dimension4: jsPsych.timelineVariable('dimension4'),
  dimension5: jsPsych.timelineVariable('dimension5'),
  dimOrder: dimensionOrder,
  displayOrder : displayOrder,
  removePredictiveDimension: true,
  choices: ['Friendly', 'Hostile'],
  response_ends_trial: true,
  data: {
    test_part: 'test_partial',
    stimulusID: jsPsych.timelineVariable('stimulusID'),
    dimension1: jsPsych.timelineVariable('dimension1'),
    dimension2: jsPsych.timelineVariable('dimension2'),
    dimension3: jsPsych.timelineVariable('dimension3'),
    dimension4: jsPsych.timelineVariable('dimension4'),
    dimension5: jsPsych.timelineVariable('dimension5'),
    abstract_category: jsPsych.timelineVariable('category'),
    testN: function () {
      return jsPsych.data.get().last(1).values()[0].testN + 1
    }
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
    test_part: 'confidence_rating_partial',
    dimension1: jsPsych.timelineVariable('dimension1'),
    dimension2: jsPsych.timelineVariable('dimension2'),
    dimension3: jsPsych.timelineVariable('dimension3'),
    dimension4: jsPsych.timelineVariable('dimension4'),
    dimension5: jsPsych.timelineVariable('dimension5'),
    abstract_category: jsPsych.timelineVariable('category'),
    testN: 1
  }
}

var if_confidence_rating = {
  timeline: [confidence_rating],
  conditional_function: function () {
    if (jsPsych.data.get().last(1).values()[0].testN % 5 - 1 === 0) {
      return true // show confidence rating
    } else {
      return false // don't show confidence rating
    }
  }
}

var category_test_procedure = {
  timeline: [categorisation_test_trial_partial, if_confidence_rating],
  timeline_variables: category_test_stimuli,
  repetitions: nRoundsTestTrial,
  randomize_order: true,
  post_trial_gap: 500
}
timeline2.push(category_test_procedure)
