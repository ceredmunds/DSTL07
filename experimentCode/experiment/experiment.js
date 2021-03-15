/* start the experiment */
jsPsych.init({
  timeline: timeline,
  on_finish: function () {
    var finishTime = new Date()
    console.log(finishTime)
    jsPsych.data.addProperties({
      finishTime: finishTime
    })

    saveData()

    if (failedLearningCriterion) {
      window.location = "https://app.prolific.co/submissions/complete?cc=12341234"
    }

    window.location = "https://app.prolific.co/submissions/complete?cc=23DABDAA"
    // jsPsych.data.displayData()
  }
})

// TO do
// integrated doesn't work on 3rd phase, all five showing
// only first data saves
