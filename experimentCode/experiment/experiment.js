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

    window.location = "https://app.prolific.co/submissions/complete?cc=XXXXXXXX"
    // jsPsych.data.displayData()
  }
})
