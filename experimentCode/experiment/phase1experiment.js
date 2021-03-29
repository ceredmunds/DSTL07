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
      console.log("correct")
      data.correct = "true"
    } else {
      console.log("wrong")
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
  data: {
    test_part: 'learning_feedback'
  },
  trial_duration: feedbackDuration,
  post_trial_gap: ITI,
  on_finish: function () {
    var nTrials = jsPsych.data.get().filter({ test_part: "learning" }).count()
    if (nTrials >= maxNumberCategoryLearningTrials) {
      console.log("Failed learning criterion")
      jsPsych.data.addProperties({
        completedLearning: "false"
      })

      var new_timeline = {
        timeline: [failedLearningCriterionPage]
      }
      jsPsych.addNodeToEndOfTimeline(new_timeline)

      failedLearningCriterion = true
      jsPsych.endCurrentTimeline()
    }

    if (nTrials >= nUniqueStimuli & failedLearningCriterion == false) {
      var last_n_trials = jsPsych.data.get().filter({ test_part: 'learning' }).last(nUniqueStimuli)
      var last_n_correct_trials = last_n_trials.filter({ correct: "true" })
      var accuracy = last_n_correct_trials.count() / last_n_trials.count()
      console.log("Accuracy: " + accuracy)
      if (accuracy >= learningCriterion) {
        jsPsych.data.addProperties({
          completedLearning: "true"
        })
        var new_timeline = {
          timeline: timeline2
        }
        jsPsych.addNodeToEndOfTimeline(new_timeline)
        jsPsych.endCurrentTimeline()
      }
    }
  }
}

var failedLearningCriterionPage = {
  type: "html-keyboard-response",
  stimulus: "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;top:0px;left:0px;'><img src='img/qmul/qm-logo-white.svg' alt='Queen Mary Header' style='width:200px;position:absolute;top:10px;left:10px;'></img></div>" +
  "<div style='width:700px'>" +
  "<p><b>Phase 1 Complete</b></p>" +
  "<p>Thank you for taking part in this experiment.</p>" +
  "<p>Unfortunately, you haven't passed the learning criterion and will not have the oportunity to complete the rest of the experiment.</p>" +
  "<p><a href='https://app.prolific.co/submissions/complete?cc=12341234'>Click here to return to Prolific and complete the study</a>.</p>" +
  "</div>" +
  "<div style='height:80px;width:100%;background-color:#0f3273;position:absolute;bottom:0px;left:0px;'></div>",
  choices: ['space'],
  data: { test_part: "category_test_instructions" },
  on_start: function () {
    var finishTime = new Date()
    console.log(finishTime)
    jsPsych.data.addProperties({
      finishTime: finishTime
    })
    saveData()
  }
}

var category_learning_procedure = {
  timeline: [categorisation_trial, feedback],
  timeline_variables: category_learning_stimuli,
  randomize_order: true,
  repetitions: 10
}
timeline.push(category_learning_procedure)
