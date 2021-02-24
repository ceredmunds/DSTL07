var confidence_rating = {
  type: 'html-slider-response',
  stimulus: '<p style="font-size:20px;">How confident are you in your classification?</p>',
  labels: ['<p style="font-size:18px;">No idea</p>', '<p style="font-size:18px;">Certain</p>'],
  require_movement: true,
  slider_width: 600
}

var category_test_procedure = {
  timeline: [categorisation_trial, confidence_rating],
  timeline_variables: category_test_stimuli,
  repetitions: 1,
  randomize_order: true
}
timeline.push(category_test_procedure)
