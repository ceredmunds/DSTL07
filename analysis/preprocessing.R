# Preprocessing of DSTL07 experiment data
# C. E. R. Edmunds, Queen Mary, University of London. 
# 18-3-2021

# Setup --------------------------------------------------------------------------------------------
rm(list=ls())

require(data.table)

data <- fread('../data/data.csv')
colnames(data) <- c("prolific_id", "study_id", "session_id", "displayCondition", "socialCondition",
                    "dimensionOrder", "displayOrder", "startTime", "finishTime", "trial_index", 
                    "test_part", "trial_type", "stimulus", "time_elapsed", "rt", "key_press", 
                    "correct_response", "correct", "button_pressed", "abstract_category", 
                    "response", "stimulusID", "dimension1", "dimension2", "dimension3", 
                    "dimension4", "dimension5", "responses")

# Changing nulls to NAs ----------------------------------------------------------------------------
data[responses == "NULL", responses:= NA]

# Remove participants that didn't pass the learning condition --------------------------------------
# Get participants that passed the learning condition
ppts <- unique(data[!is.na(responses), .(prolific_id, displayCondition, socialCondition)])

# Remove participants that didn't pass the learning condition
setkey(data, prolific_id)
data <- data[ppts]

# Anonymising data ---------------------------------------------------------------------------------
id <- data.table(prolific_id=unique(data$prolific_id), id=1:length(unique(data$prolific_id)))
data <- merge(data, id, by="prolific_id")

data[, "prolific_id":= id]
setnames(data, "prolific_id", "participant_id")

# Tidying
data[, c("study_id", "session_id", "id"):= NULL]
rm(id)

# Correct data types -------------------------------------------------------------------------------
data[, rt:= as.numeric(rt)] 

# Removing non-essential data ----------------------------------------------------------------------
data <- data[test_part!="welcome",]
data <- data[test_part!="learningInstructions",]
data <- data[test_part!="learning_feedback",]
data <- data[test_part!="category_test_instructions",]
data <- data[test_part!="verbal_report_instructions",]
data <- data[test_part!="category_test_partial_instructions",]
data <- data[test_part!="verbal_report_instructions_phase3",]

data <- data[, stimulus:= NULL]
data <- data[, key_press:= NULL]

setnames(data, "test_part", "experiment_phase")

# Finish -------------------------------------------------------------------------------------------
# Get number of people in each condition
table(ppts$displayCondition, ppts$socialCondition) # Table of participants in each condition

# Check whether participants data is there
data[prolific_id=="5fe1f5f751f3a9ceb57d935a",]

# Save data
fwrite(data, "../data/DSTL07longData.csv")
