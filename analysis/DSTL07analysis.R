# Preprocessing of DSTL07 experiment data
# C. E. R. Edmunds, Queen Mary, University of London. 
# 18-3-2021

# Setup --------------------------------------------------------------------------------------------
rm(list=ls())

require(data.table); require(ggplot2); require(viridis); require(emmeans); require(BayesFactor); 

data <- fread('../data/DSTL07longData.csv')

# Learning -----------------------------------------------------------------------------------------
lData <- data[experiment_phase=="learning",]
lData[, Accuracy:= ifelse(correct, 1, 0)]

# Getting summary statistics of category learning
lSummary <- lData[, list(trialsToCriterion=.N, 
                         meanAccuracy=mean(Accuracy),
                         meanRT=mean(rt)), 
                         by=.(participant_id, displayCondition, socialCondition)]

lGraphData <- lSummary[, list(meanTrials=mean(trialsToCriterion),
                              sdTrials=sd(trialsToCriterion),
                              meanAccuracy=mean(meanAccuracy),
                              sdAccuracy=sd(meanAccuracy),
                              meanRT=mean(meanRT), 
                              sdRT=sd(meanRT), 
                              N=.N),
                       by=.(displayCondition, socialCondition)]

ggplot(lGraphData, aes(x=displayCondition, y=meanTrials, fill=socialCondition)) + 
  geom_bar(position="dodge", stat="identity") +
  geom_errorbar(aes(ymin=meanTrials-sdTrials, ymax=meanTrials+sdTrials), width=.1,
                position=position_dodge(.9)) +
  scale_fill_viridis(discrete = T) +
  theme_bw()

# NHST on learning
ntrials.aov <- aov(trialsToCriterion ~ displayCondition*socialCondition, data=lSummary)
summary(ntrials.aov)

emmeans(ntrials.aov, ~displayCondition*socialCondition)

# Bayes factors on learning
lSummary[, displayCondition:= as.factor(displayCondition)]
lSummary[, socialCondition:= as.factor(socialCondition)]
ntrials.bf <- anovaBF(trialsToCriterion ~ displayCondition*socialCondition, data=lSummary)
summary(ntrials.bf)
