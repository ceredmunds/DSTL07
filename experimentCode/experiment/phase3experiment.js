var categorisation_trial = {
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
    test_part: 'learning',
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

var category_test_procedure = {
  timeline: [categorisation_trial, confidence_rating],
  timeline_variables: category_test_stimuli,
  repetitions: 1,
  randomize_order: true
}
timeline.push(category_test_procedure)
