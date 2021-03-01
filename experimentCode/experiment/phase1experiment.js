/* category learning phase */
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
  removePredictiveDimension: false,
  choices: ['Friendly', 'Hostile'],
  response_ends_trial: true,
  data: {
    displayCondition: displayCondition,
    socialCondition: socialCondition,
    test_part: 'learning',
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

var feedback = {
  type: 'html-keyboard-response',
  stimulus: function () {
    var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct
    if (last_trial_correct == "true") {
      return "<p>Correct!</p>"
    } else {
      return "<p>Wrong.</p>"
    }
  },
  choices: jsPsych.NO_KEYS,
  data: { test_part: 'learning_feedback' },
  trial_duration: feedbackDuration,
  post_trial_gap: ITI
}

var category_learning_procedure = {
  timeline: [categorisation_trial, feedback],
  timeline_variables: category_learning_stimuli,
  randomize_order: true,
  loop_function: function () {
    // break loop if over trial limit
    var nTrials = jsPsych.data.get().filter({ test_part: "learning" }).count()
    if (nTrials >= maxNumberCategoryLearningTrials) {
      // data.switch = "maxNoTrials"
      return false
    }

    var last_n_trials = jsPsych.data.get().last(nUniqueStimuli)
    var last_n_correct_trials = last_n_trials.filter({ correct: "true" })
    var accuracy = Math.round(last_n_correct_trials.count() / last_n_trials.count())
    if (accuracy < learningCriterion) {
      // data.switch = "continue"
      return true // True to keep loop going
    } else {
      // data.switch = "greaterThanLC"
      return false
    }
  }
}
timeline.push(category_learning_procedure)
