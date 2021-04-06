# Preprocessing of DSTL07 experiment data
# C. E. R. Edmunds, Queen Mary, University of London. 
# 18-3-2021

# Setup --------------------------------------------------------------------------------------------
rm(list=ls())

require(data.table); require(ggplot2); require(viridis); require(emmeans); require(BayesFactor); 
require(car)

data <- fread('../data/DSTL07longData.csv')

data <- data[participant_id!=193,] # Participant with number of trials to criterion of 200

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

# Bayesian
lSummary[, logMeanRT:=log(meanRT)]
rt.bf <- anovaBF(logMeanRT ~ displayCondition*socialCondition, lSummary)
summary(rt.bf)
