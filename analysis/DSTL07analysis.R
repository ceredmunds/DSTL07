# Preprocessing of DSTL07 experiment data
# C. E. R. Edmunds, Queen Mary, University of London. 
# 18-3-2021

# Setup --------------------------------------------------------------------------------------------
rm(list=ls())

require(data.table); require(ggplot2); require(viridis); require(emmeans); require(BayesFactor); 
require(car)

data <- fread('../data/DSTL07longData.csv')

data <- data[participant_id!=193,] # Participant with number of trials to criterion of 200
data <- data[participant_id!=3,] # Participant with double number of test trials

# Learning graphs ----------------------------------------------------------------------------------
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

lGraphData[, `:=`(nTrialsError=sqrt(2)*qnorm(0.975)*sdTrials/sqrt(N), 
                  accuracyError=sqrt(2)*qnorm(0.975)*sdAccuracy/sqrt(N),
                  rtError=sqrt(2)*qnorm(0.975)*sdRT/sqrt(N))]

# Summarising number of trials to criterion
ggplot(lGraphData, aes(x=displayCondition, y=meanTrials, fill=socialCondition)) + 
  geom_bar(position="dodge", stat="identity") +
  geom_errorbar(aes(ymin=meanTrials-nTrialsError, ymax=meanTrials+nTrialsError), width=.1,
                position=position_dodge(.9)) +
  scale_fill_viridis(discrete = T) +
  labs(x="Display condition", fill="Social condition", y="Mean number of trials to criterion") +
  theme_bw()
ggsave("../techReport/images/DSTL07trialsCriterion.pdf", units="in", width=5, height=3)

# Summarising reaction times
ggplot(lGraphData, aes(x=displayCondition, y=meanRT, fill=socialCondition)) + 
  geom_bar(position="dodge", stat="identity") +
  geom_errorbar(aes(ymin=meanRT-rtError, ymax=meanRT+rtError), width=.1,
                position=position_dodge(.9)) +
  scale_fill_viridis(discrete = T) +
  labs(x="Display condition", fill="Social condition", y="Mean reaction time (ms)") +
  theme_bw()
ggsave("../techReport/images/DSTL07learningRT.pdf", units="in", width=5, height=3)

# Learning phase: Trials to criterion --------------------------------------------------------------
# Tag outliers
boxplot <- boxplot(trialsToCriterion~displayCondition*socialCondition, lSummary)
quartiles <- lSummary[, list(LQ = quantile(trialsToCriterion, probs=0.25, na.rm=F),
                             UQ = quantile(trialsToCriterion, probs=0.75, na.rm=F)), 
                      by=.(displayCondition, socialCondition)]
quartiles[, IQR:=UQ-LQ]
quartiles[, `:=`(upperBoundary=UQ+1.5*IQR, 
                 lowerBoundary=LQ-1.5*IQR)]

lSummary <- merge(lSummary, quartiles[, .(displayCondition, socialCondition, upperBoundary)])  # Lower boundary all negative so ignore
lSummary[, nTrialsOutlier:= ifelse(trialsToCriterion>upperBoundary, 1, 0)]
lSummary[nTrialsOutlier==1,]

# NHST: to test assumptions
ntrials.aov <- aov(trialsToCriterion ~ displayCondition*socialCondition, 
                   data=lSummary[nTrialsOutlier==0,])
summary(ntrials.aov)

# Check homogeneity of variance
plot(ntrials.aov, 1)
leveneTest(trialsToCriterion ~ displayCondition*socialCondition, data=lSummary[nTrialsOutlier==0,])
# Significant: homogeneity of variance violated

# Check normality
plot(ntrials.aov, 2)
aov_residuals <- residuals(object=ntrials.aov)
shapiro.test(x=aov_residuals)
# Significant: therefore violations of normality

# NHST: to report
ntrials.aov <- aov(log(trialsToCriterion) ~ displayCondition*socialCondition, 
                   data=lSummary[nTrialsOutlier==0,])
summary(ntrials.aov)

# Get means
emmeans(ntrials.aov, ~socialCondition)
emmeans(ntrials.aov, ~displayCondition*socialCondition)

# Bayesian
lSummary[, displayCondition:= as.factor(displayCondition)]
lSummary[, socialCondition:= as.factor(socialCondition)]
lSummary[, logTrialsToCriterion:= log(trialsToCriterion)]
ntrials.bf <- anovaBF(logTrialsToCriterion ~ displayCondition*socialCondition, data=lSummary[nTrialsOutlier==0,])
summary(ntrials.bf)

ntrials.bf[4]/ntrials.bf[3]

# Learning phase: Reaction times -------------------------------------------------------------------
# Tag outliers
boxplot <- boxplot(meanRT~displayCondition*socialCondition, lSummary)
quartiles <- lSummary[, list(LQ = quantile(meanRT, probs=0.25, na.rm=F),
                             UQ = quantile(meanRT, probs=0.75, na.rm=F)), 
                      by=.(displayCondition, socialCondition)]
quartiles[, IQR:=UQ-LQ]
quartiles[, `:=`(upperBoundaryRT=UQ+1.5*IQR, 
                 lowerBoundaryRT=LQ-1.5*IQR)]

lSummary <- merge(lSummary, quartiles[, .(displayCondition, socialCondition, upperBoundaryRT)])  # Lower boundary all negative so ignore
lSummary[, rtOutlier:= ifelse(meanRT>upperBoundaryRT, 1, 0)]
lSummary[rtOutlier==1,]

# NHST: to test assumptions
rt.aov <- aov(meanRT ~ displayCondition*socialCondition, data=lSummary[rtOutlier==0,])
summary(rt.aov)

# Check homogeneity of variance
plot(rt.aov, 1)
leveneTest(meanRT ~ displayCondition*socialCondition, data=lSummary[rtOutlier==0])
# Significant: violation of homogeneity of variance

# Check normality
plot(rt.aov, 2)
aov_residuals <- residuals(object=rt.aov)
shapiro.test(x=aov_residuals)
# Significant: therefore violations of normality

# NHST: to report
rt.aov <- aov(log(meanRT) ~ displayCondition*socialCondition, data=lSummary[rtOutlier==0,])
summary(rt.aov)

emmeans(rt.aov, ~displayCondition)
emmeans(rt.aov, ~socialCondition)

# Bayesian
lSummary[, logMeanRT:=log(meanRT)]
rt.bf <- anovaBF(logMeanRT ~ displayCondition*socialCondition, lSummary)
summary(rt.bf)

rt.bf[4]/rt.bf[3]

# Test phase with all attributes -------------------------------------------------------------------
require(abd)
# Get and format data
tData <-  data[experiment_phase=="test",]

# Set up output
ppts <- unique(data$participant_id)
tOutput <- data.table(expand.grid(participant_id=ppts, experiment_phase="test1", dimension=c(1:5, "woDim1", "wDim1"), 
                                  statistic=c("Xsquared", "pValue", "oddsRatio"), value=as.numeric(NA)))
tOutput <- merge(tOutput, tData[, .SD[1], by=.(participant_id)][,.(participant_id, displayCondition, socialCondition)])
tOutput[, biased:=0]

for (p in 1:length(ppts)) {
  ppt <- ppts[p]
  pptData <- tData[participant_id==ppt, ]
  
  for (d in 1:5) {
    respTable <- table(pptData[[paste("dimension", d, sep="")]], pptData$abstract_response_label)
    chi <- chisq.test(respTable)
    
    tOutput[participant_id==ppt & dimension==d & statistic=="Xsquared", value:= chi$statistic]
    tOutput[participant_id==ppt & dimension==d & statistic=="pValue", value:= chi$p.value]
    
    if(dim(respTable)[1]==2 & dim(respTable)[2]==2) {
      tOutput[participant_id==ppt & dimension==d & statistic=="oddsRatio", value:= oddsRatio(respTable)]
    } else {
      tOutput[participant_id==ppt & dimension==d & statistic=="oddsRatio", biased:= 1]
    }
  }
  
  respTable <- table(pptData$woDim1, pptData$abstract_response_label)
  chi <- chisq.test(respTable)
  tOutput[participant_id==ppt & dimension=="woDim1" & statistic=="Xsquared", value:= chi$statistic]
  tOutput[participant_id==ppt & dimension=="woDim1" & statistic=="pValue", value:= chi$p.value]
  
  if(dim(respTable)[1]==2 & dim(respTable)[2]==2) {
    tOutput[participant_id==ppt & dimension=="woDim1" & statistic=="oddsRatio", value:= oddsRatio(respTable)]
  } else {
    tOutput[participant_id==ppt & dimension=="woDim1" & statistic=="oddsRatio", biased:= 1]
  }
  
  respTable <- table(pptData$wDim1, pptData$abstract_response_label)
  chi <- chisq.test(respTable)
  tOutput[participant_id==ppt & dimension=="wDim1" & statistic=="Xsquared", value:= chi$statistic]
  tOutput[participant_id==ppt & dimension=="wDim1" & statistic=="pValue", value:= chi$p.value]
  
  if(dim(respTable)[1]==2 & dim(respTable)[2]==2) {
    tOutput[participant_id==ppt & dimension=="wDim1" & statistic=="oddsRatio", value:= oddsRatio(respTable)]
  } else {
    tOutput[participant_id==ppt & dimension=="wDim1" & statistic=="oddsRatio", biased:= 1]
  }
}

# Second test phase
# Get and format data
pData <-  data[experiment_phase=="test_partial",]

# Set up output
ppts <- unique(data$participant_id)
pOutput <- data.table(expand.grid(participant_id=ppts, experiment_phase="test2", dimension=c(1:5, "woDim1", "wDim1"), 
                                  statistic=c("Xsquared", "pValue", "oddsRatio"), value=as.numeric(NA)))
pOutput <- merge(pOutput, pData[, .SD[1], by=.(participant_id)][,.(participant_id, displayCondition, socialCondition)])
pOutput[, biased:=0]

for (p in 1:length(ppts)) {
  ppt <- ppts[p]
  pptData <- pData[participant_id==ppt, ]
  
  for (d in 1:5) {
    respTable <- table(pptData[[paste("dimension", d, sep="")]], pptData$abstract_response_label)
    chi <- chisq.test(respTable)
    
    pOutput[participant_id==ppt & dimension==d & statistic=="Xsquared", value:= chi$statistic]
    pOutput[participant_id==ppt & dimension==d & statistic=="pValue", value:= chi$p.value]
    
    # Work out dimensions
    if(dim(respTable)[1]==2 & dim(respTable)[2]==2) {
      pOutput[participant_id==ppt & dimension==d & statistic=="oddsRatio", value:= oddsRatio(respTable)]
    } else {
      pOutput[participant_id==ppt & dimension==d & statistic=="Xsquared", biased:= 1]
      pOutput[participant_id==ppt & dimension==d & statistic=="pValue", biased:= 1]
      pOutput[participant_id==ppt & dimension==d & statistic=="oddsRatio", biased:= 1]
    }
  }
  
  respTable <- table(pptData$woDim1, pptData$abstract_response_label)
  chi <- chisq.test(respTable)
  pOutput[participant_id==ppt & dimension=="woDim1" & statistic=="Xsquared", value:= chi$statistic]
  pOutput[participant_id==ppt & dimension=="woDim1" & statistic=="pValue", value:= chi$p.value]
  
  if(dim(respTable)[1]==2 & dim(respTable)[2]==2) {
    pOutput[participant_id==ppt & dimension=="woDim1" & statistic=="oddsRatio", value:= oddsRatio(respTable)]
  } else {
    pOutput[participant_id==ppt & dimension=="woDim1" & statistic=="oddsRatio", biased:= 1]
  }
  
  respTable <- table(pptData$wDim1, pptData$abstract_response_label)
  chi <- chisq.test(respTable)
  pOutput[participant_id==ppt & dimension=="wDim1" & statistic=="Xsquared", value:= chi$statistic]
  pOutput[participant_id==ppt & dimension=="wDim1" & statistic=="pValue", value:= chi$p.value]
  
  if(dim(respTable)[1]==2 & dim(respTable)[2]==2) {
    pOutput[participant_id==ppt & dimension=="wDim1" & statistic=="oddsRatio", value:= oddsRatio(respTable)]
  } else {
    pOutput[participant_id==ppt & dimension=="wDim1" & statistic=="oddsRatio", biased:= 1]
  }
}

output <- rbind(tOutput, pOutput)

# Look at number of participants with biased responding
output[biased==1, ] # One participant in each condition
biasedParticipants <- output[participant_id %in% c(50, 87, 131, 172),]
biasedParticipants[experiment_phase=="test1" & statistic=="Xsquared", .SD[which.max(value)],
                   by=.(participant_id, experiment_phase)]
# Looking at their verbal reports
data[participant_id %in% c(50, 87, 131, 172) & experiment_phase == "verbal_report_textbox_phase2", ]
data[participant_id %in% c(50, 87, 131, 172) & experiment_phase == "verbal_report_textbox_phase3", ]

# Remove biased participants
tOutput <- tOutput[biased==0, ] # Remove those participants
pOutput <- pOutput[biased==0, ] # Remove those participants

# Determining winning dimension for every participant in first test
winningDimension <- tOutput[statistic=="Xsquared" & dimension!="woDim1",.SD[which.max(value)], by=.(participant_id, experiment_phase)]
test1N <- winningDimension[, list(N=.N), by=.(dimension, displayCondition, socialCondition)]
test1table <- dcast(test1N, displayCondition + socialCondition ~ dimension, value.var="N")
xtable(test1table)

winningDimension <- pOutput[statistic=="Xsquared" & dimension!="wDim1",.SD[which.max(value)], by=.(participant_id, experiment_phase)]
test2N <- winningDimension[experiment_phase=="test2", list(N=.N), by=.(dimension, displayCondition, socialCondition)]
test2table <- dcast(test2N, displayCondition + socialCondition ~ dimension, value.var="N")
xtable(test2table)

winningDimension <- tOutput[statistic=="Xsquared" & dimension!="woDim1",.SD[which.max(value)], by=.(participant_id, experiment_phase)]
pptsDim2 <- winningDimension[dimension!=2 & experiment_phase=="test1", participant_id]
winningDimension <- pOutput[statistic=="Xsquared" & dimension!="wDim1",.SD[which.max(value)], by=.(participant_id, experiment_phase)]
test2N <- winningDimension[experiment_phase=="test2" & participant_id %in% pptsDim2, 
                           list(N=.N), by=.(dimension, displayCondition, socialCondition)]
test2table <- dcast(test2N, displayCondition + socialCondition ~ dimension, value.var="N")
xtable(test2table)

# Confidence ratings: Graph ------------------------------------------------------------------------
cData <- data[experiment_phase=="confidence_rating_test"|experiment_phase=="confidence_rating_partial",]

# Edit data table
cData[, block:=rep(1:5, each=8, times=424)] # Add blocks
cData[, response:=as.numeric(response)] # Make response numeric

# Get summary data
cSummary <- cData[, list(meanResponse = mean(response, na.rm=T)), 
                  by=.(participant_id, experiment_phase, socialCondition, displayCondition, block)]

# Plot graph
cGraphData <- cSummary[, list(confidenceResponse = mean(meanResponse, na.rm=T),
                              sdConfidence = sd(meanResponse, na.rm=T), 
                              N=.N),
                       by=.(experiment_phase, socialCondition, displayCondition, block)]
cGraphData[, confidenceError:= sqrt(2)*qnorm(0.975)*sdConfidence/sqrt(N)]
cGraphData[, condition:= paste(socialCondition, displayCondition, sep="-")]
cGraphData[, block:=as.factor(block)]

ggplot(cGraphData, aes(x=block, y=confidenceResponse, color=condition)) +
  facet_grid(~experiment_phase) +
  geom_bar(aes(y=confidenceResponse, fill=condition), stat="identity", position="dodge") +
  geom_errorbar(aes(ymin=confidenceResponse-confidenceError, ymax=confidenceResponse+confidenceError), 
                width=0.3, position=position_dodge(0.9)) +
  scale_colour_viridis(discrete = T) +
  scale_fill_viridis(discrete = T) +
  theme_bw()
ggsave("../techReport/images/confidenceRatingGraph.pdf", units="in", width=8, height=4)
# Good start: not quite sure what I want to communicate with this graph. 

# Confidence: Analysis -----------------------------------------------------------------------------
# ANOVA to test assumptions
conf.aov <- aov(meanResponse ~ experiment_phase*socialCondition*displayCondition, data=cSummary)
summary(conf.aov)

# Check homogeneity of variance
plot(conf.aov, 1)
leveneTest(meanResponse ~ experiment_phase*socialCondition*displayCondition, data=cSummary)
# Significant: homogeneity of variance violated

# Check normality
plot(conf.aov, 2)
aov_residuals <- residuals(object=conf.aov)
shapiro.test(x=aov_residuals)
# Significant: therefore violations of normality

hist(aov_residuals)
hist(cSummary$meanResponse)

# NHST: to report
conf.aov <- aov(meanResponse ~ experiment_phase*socialCondition*displayCondition, data=cSummary)
summary(conf.aov)

emmeans(conf.aov, ~experiment_phase)
emmeans(conf.aov, ~displayCondition)
emmeans(conf.aov, ~socialCondition)

# Bayesian
cSummary[, displayCondition:= as.factor(displayCondition)]
cSummary[, socialCondition:= as.factor(socialCondition)]
cSummary[, experiment_phase:= as.factor(experiment_phase)]
conf.bf <- anovaBF(meanResponse ~ experiment_phase*socialCondition*displayCondition, data=cSummary, whichModels="bottom")
summary(conf.bf)



# Graphs of test phase ------------------------------------------------------------------------------
tData <-  data[experiment_phase=="test",]
tSummary <- tData[as.numeric(stimulusID)<=20, list(meanAccuracyTest=mean(accuracy), 
                         meanRTtest=mean(rt)),
                  by=.(participant_id, displayCondition, socialCondition)]


pData <- data[experiment_phase=="test_partial",]
pSummary <- pData[as.numeric(stimulusID)<=20, list(meanAccuracyPartial=mean(accuracy), 
                         meanRTpartial=mean(rt)), 
                  by=.(participant_id, displayCondition, socialCondition)]

# Combine data
summary <- cbind(tSummary, pSummary[, .(meanAccuracyPartial, meanRTpartial)])

summary[, rtDiff:= meanRTtest - meanRTpartial]
summary[, meanDiff:= meanAccuracyTest - meanAccuracyPartial]

test.aov <- aov(meanDiff ~ displayCondition*socialCondition, data=summary)
summary(test.aov)


# Test phase ---------------------------------------------------------------------------------------
tData <-  data[experiment_phase=="test" | experiment_phase=="test_partial",]
tSummary <- tData[as.numeric(stimulusID)<=20, list(meanAccuracy=mean(accuracy), 
                         meanRT=mean(rt)),
                  by=.(participant_id, displayCondition, socialCondition, experiment_phase)]
tGraphData <- tSummary[, list(Accuracy=mean(meanAccuracy), 
                              sdAccuracy=sd(meanAccuracy), 
                              RT=mean(meanRT), 
                              sdRT=sd(meanRT), 
                              N=.N), 
                       by=.(displayCondition, socialCondition, experiment_phase)]

tGraphData[, `:=`(accuracyError=sqrt(2)*qnorm(0.975)*sdAccuracy/sqrt(N), 
                  rtError=sqrt(2)*qnorm(0.975)*sdRT/sqrt(N))]

ggplot(tGraphData, aes(x=displayCondition, y=Accuracy, fill=socialCondition)) +
  geom_bar(position="dodge", stat="identity") +
  geom_errorbar(aes(ymin=Accuracy-accuracyError, ymax=Accuracy+accuracyError), width=0.2, position=position_dodge(0.9)) +
  facet_grid(~experiment_phase) +
  scale_fill_viridis(discrete = T, alpha=0.8) +
  theme_bw()
ggsave("../techReport/images/DSTL07testSummaryAccuracy.pdf", units="in", width=6, height=4)

ggplot(tGraphData, aes(x=displayCondition, y=RT, fill=socialCondition)) +
  geom_bar(position="dodge", stat="identity") +
  geom_errorbar(aes(ymin=RT-rtError, ymax=RT+rtError), width=0.2, position=position_dodge(0.9)) +
  facet_grid(~experiment_phase) +
  scale_fill_viridis(discrete = T, alpha=0.8) +
  theme_bw()
ggsave("../techReport/images/DSTL07testSummaryRT.pdf", units="in", width=6, height=4)

# Accuracy
test.aov <- aov(meanAccuracy ~ displayCondition*socialCondition*experiment_phase + 
                  Error(participant_id/experiment_phase), data=tSummary)
summary(test.aov)

tSummary$experiment_phase <- factor(tSummary$experiment_phase)
tSummary$displayCondition <- factor(tSummary$displayCondition)
tSummary$socialCondition <- factor(tSummary$socialCondition)
tSummary$participant_id <- factor(tSummary$participant_id)

test.bf <- anovaBF(meanAccuracy ~ displayCondition*socialCondition*experiment_phase + participant_id, 
                   data=tSummary, whichModels="bottom", whichRandom="participant_id")
summary(test.bf)

# Reaction time
test.aov.rt <- aov(meanRT ~ displayCondition*socialCondition*experiment_phase + 
                  Error(participant_id/experiment_phase), data=tSummary)
summary(test.aov.rt)

test.bf.rt <- anovaBF(meanRT ~ displayCondition*socialCondition*experiment_phase + participant_id,  
                   data=tSummary, whichModels="bottom", whichRandom="participant_id")
summary(test.bf.rt)

# Verbal reports -----------------------------------------------------------------------------------
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

vrData[, c("dimension1", "dimension2", "dimension3", "dimension4", "dimension5"):=as.numeric(NA)]

for (n in 1:nrow(vrData)) {
  d <- vrData[n,]
  dimOrder <- d$dimensionOrder
  dimensionOrderVector <- strsplit(dimOrder, ",")[[1]]
  
  for (listPlace in 1:5) {
    dimension <- dimensionOrderVector[listPlace]
    vrData[[paste0("dimension", listPlace)]][[n]] <- d[[dimension]] 
  }
}

table(vrData$experiment_phase, vrData$dimension1)

rankData <- melt(vrData[,.(participant_id, displayCondition, socialCondition, experiment_phase,
                           dimension1,dimension2, dimension3, dimension4, dimension5)], 
                 id.vars=c("participant_id", "experiment_phase", "displayCondition", "socialCondition"),
                 measure.vars=c("dimension1", "dimension2", "dimension3", "dimension4", 
                                "dimension5"))
rankData$variable <- as.numeric(rankData$variable)
rankData[,condition:=paste0(displayCondition, socialCondition)]

# Phase 2
cor <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase2",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase2",value], method="spearman",
                exact=FALSE)
cor

cor <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="integratedoperator",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="integratedoperator",value], method="spearman",
                exact=FALSE)
cor

cor <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="integratedsuperior",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="integratedsuperior",value], method="spearman",
                exact=FALSE)
cor

cor <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="separatedoperator",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="separatedoperator",value], method="spearman",
                exact=FALSE)
cor

cor <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="separatedsuperior",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="separatedsuperior",value], method="spearman",
                exact=FALSE)
cor


# Phase 3
cor1 <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase3",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase3",value], method="spearman",
                exact=FALSE)
cor1

cor <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase3" & condition=="integratedoperator",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase3" & condition=="integratedoperator",value], method="spearman",
                exact=FALSE)
cor

cor <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase3" & condition=="integratedsuperior",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase3" & condition=="integratedsuperior",value], method="spearman",
                exact=FALSE)
cor

cor <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase3" & condition=="separatedoperator",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase3" & condition=="separatedoperator",value], method="spearman",
                exact=FALSE)
cor

cor <- cor.test(rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="separatedsuperior",variable], 
                rankData[experiment_phase=="verbal_report_ranking_phase2" & condition=="separatedsuperior",value], method="spearman",
                exact=FALSE)
cor

# Comparing rank data 
