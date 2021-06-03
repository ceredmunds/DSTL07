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
data <- data[ppts$prolific_id]

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

# Get abstract category and abstract responses for all participants --------------------------------
data[experiment_phase!="learning", abstract_category:= ifelse(abstract_category==0, 1, 0)] # Switch abstract category

subset <- data[stimulusID=="1", .SD[1], by=.(participant_id)]
subset[, flip:= ifelse(correct_response=="Friendly", 0, 1)] # Abstract category 0=friendly, 1=unfriendly
subset <- subset[, .(participant_id, flip)]

data <- merge(data, subset, by="participant_id")
data[, abstract_category_label:= ifelse(abstract_category==0, "Friendly", "Hostile")]

data[, abstract_response_label:= response]
data[flip==1, abstract_response_label:= ifelse(response=="Friendly", "Hostile", "Friendly")]
data[correct=="NULL", abstract_response_label:= NA]

data[, correct:= ifelse(abstract_category_label==abstract_response_label, "true", "false")]
data[is.na(abstract_response_label), correct:= NA]

data[, accuracy:= ifelse(correct=="true", 1, 0)]
data[is.na(abstract_response_label), accuracy:= NA]

# Get additional strategies ------------------------------------------------------------------------
dataRank <- data[experiment_phase %in% 
                   c("verbal_report_ranking_phase2", "verbal_report_ranking_phase3"),]
dataRank[, woDim1:=as.numeric(NA)]
dataRank[, wDim1:=as.numeric(NA)]

categoryInfo <- fread("../data/category_test_stimuli.csv")
categoryInfo$stimulusID <- as.numeric(categoryInfo$stimulusID)
data$stimulusID <- as.numeric(data$stimulusID)

data <- merge(data, categoryInfo[, .(stimulusID, woDim1, wDim1)], by="stimulusID")
data <- rbind(data, dataRank)

# Finish -------------------------------------------------------------------------------------------
# Get number of people in each condition
table(ppts$displayCondition, ppts$socialCondition) # Table of participants in each condition

# Check whether participants data is there
data[prolific_id=="5fe1f5f751f3a9ceb57d935a",]

# Order data to save
data <- data[, .(participant_id, displayCondition, socialCondition, dimensionOrder, displayOrder,
                 startTime, finishTime, trial_index, experiment_phase, trial_type, time_elapsed, rt, 
                 stimulusID, dimension1, dimension2, dimension3, dimension4, dimension5, woDim1, wDim1,
                 abstract_category, abstract_category_label, correct_response, abstract_response_label,
                 response, button_pressed, correct, responses, accuracy, flip)]

# Save data
fwrite(data, "../data/DSTL07longData.csv")

# Double checking data

sData <- data[participant_id==1 & stimulusID==32, ]


# Extracting needed verbal report data. Might also need "flipped" in the future --------------------
vtData <- data[experiment_phase %in% c("verbal_report_textbox_phase2",
                                       "verbal_report_textbox_phase3"),
               .(participant_id, displayCondition, socialCondition, dimensionOrder, displayOrder,
                 experiment_phase, responses)]

tidyStr <- function(str) {
  # Function to remove excess from text box responses
  strVector <- strsplit(str, "")[[1]]
  strVector <- strVector[-(1:28)]
  len <- length(strVector)
  strVector <- strVector[-((len-2):len)]
  return(paste(strVector, collapse=""))
}

vtData[, response:= tidyStr(responses), by=.(participant_id, experiment_phase)]
vtData[, responses:=NULL]

# Get ranks 
vrData <- data[experiment_phase %in% c("verbal_report_ranking_phase2",
                                       "verbal_report_ranking_phase3"),
               .(participant_id, displayCondition, socialCondition, dimensionOrder, displayOrder,
                 experiment_phase, responses)]

extractRank <- function(str, rank) {
  strVector <- strsplit(str, ",")[[1]]
  
  strRank <- strVector[rank]
  strRank <- strsplit(strRank, "")[[1]]
  response <- sum(as.numeric(strRank), na.rm=T)
  
  response <- ifelse(response==0, NA, response)
  return(response)
}

vrData[, Craft:=extractRank(responses, 1), by=.(participant_id, experiment_phase)]
vrData[, Role:=extractRank(responses, 2), by=.(participant_id, experiment_phase)]
vrData[, Status:=extractRank(responses, 3), by=.(participant_id, experiment_phase)]
vrData[, Speed:=extractRank(responses, 4), by=.(participant_id, experiment_phase)]
vrData[, Direction:=extractRank(responses, 5), by=.(participant_id, experiment_phase)]

vrData[, rankOrder:="NA"]
vrData[, orderedRanks:="NA"]

for (i in 1:nrow(vrData)) {
  x <- sort(vrData[i, .(Craft, Role, Status, Speed, Direction)])
  vrData[i, rankOrder:= paste(colnames(x), collapse=",")]
  vrData[i, orderedRanks:= paste((x[1,]), collapse=",")]
  
}
vtData <- cbind(vtData, vrData[, .(rankOrder, orderedRanks)])

fwrite(vtData, "../data/DSTL07verbalReports.csv")
