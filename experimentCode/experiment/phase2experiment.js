var confidence_rating = {
  type: 'html-slider-response',
  stimulus: 'How confident are you in your classification?',
  labels: ['No idea', 'Certain'],
  require_movement: true
}

var category_test_procedure = {
  timeline: [categorisation_trial, confidence_rating],
  timeline_variables: category_test_stimuli,
  repetitions: 1,
  randomize_order: true
}
timeline.push(category_test_procedure)
