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

# Get and format data
tData <-  data[experiment_phase=="test",]
tData[, binary_response:= ifelse(abstract_category_label=="Friendly", 1, 0)]

tData <- tData[participant_id!=3,] # Odd participant with double the amount of test trials, Maybe they did it twice?

# Set up output
tOutput <- tData[, .SD[1], by=.(participant_id)][,.(participant_id, displayCondition, socialCondition)]
ppts <- unique(tOutput$participant_id)

x <- data.table(matrix(nrow=length(ppts), ncol=15))
colnames(x) <- c("m1_intercept", "m1_coef", "m1_aic",
                 "m2_intercept", "m2_coef", "m2_aic",
                 "m3_intercept", "m3_coef", "m3_aic",
                 "m4_intercept", "m4_coef", "m4_aic",
                 "m5_intercept", "m5_coef", "m5_aic")
x <- x[,lapply(.SD, as.numeric)]

tOutput <- cbind(tOutput, x)
rm(x)

# Start participant loop
for (i in 1:length(ppts)) {
  ppt <- ppts[i]
  pptData <- tData[participant_id==ppt, ]
  pptData[, block:= rep(1:5, each=32)]
  
  m1 <- glm(binary_response ~ dimension1, data=pptData, family="binomial")
  m2 <- glm(binary_response ~ dimension2, data=pptData, family="binomial")
  m3 <- glm(binary_response ~ dimension3, data=pptData, family="binomial")
  m4 <- glm(binary_response ~ dimension4, data=pptData, family="binomial")
  m5 <- glm(binary_response ~ dimension5, data=pptData, family="binomial")
  
  tOutput[participant_id==ppt, c("m1_intercept"):=m1$coefficients[1]]
  
  tOutput[participant_id==ppt, 
          c("m1_intercept", "m1_coef", "m1_aic",
            "m2_intercept", "m2_coef", "m2_aic",
            "m3_intercept", "m3_coef", "m3_aic",
            "m4_intercept", "m4_coef", "m4_aic",
            "m5_intercept", "m5_coef", "m5_aic") := 
          list(m1$coefficients[1], m1$coefficients[2], m1$aic,
               m2$coefficients[1], m2$coefficients[2], m2$aic,
               m3$coefficients[1], m3$coefficients[2], m3$aic,
               m4$coefficients[1], m4$coefficients[2], m4$aic,
               m5$coefficients[1], m5$coefficients[2], m5$aic)]
}

# Get and format data
pData <-  data[experiment_phase=="test_partial",]
pData[, binary_response:= ifelse(abstract_category_label=="Friendly", 1, 0)]

pData <- pData[participant_id!=3,] # Odd participant with double the amount of test trials, Maybe they did it twice?

# Set up output
pOutput <- pData[, .SD[1], by=.(participant_id)][,.(participant_id, displayCondition, socialCondition)]
ppts <- unique(pOutput$participant_id)

x <- data.table(matrix(nrow=length(ppts), ncol=15))
colnames(x) <- c("m1_intercept", "m1_coef", "m1_aic",
                 "m2_intercept", "m2_coef", "m2_aic",
                 "m3_intercept", "m3_coef", "m3_aic",
                 "m4_intercept", "m4_coef", "m4_aic",
                 "m5_intercept", "m5_coef", "m5_aic")
x <- x[,lapply(.SD, as.numeric)]

pOutput <- cbind(pOutput, x)
rm(x)

# Start participant loop
for (i in 1:length(ppts)) {
  ppt <- ppts[i]
  pptData <- pData[participant_id==ppt, ]
  pptData[, block:= rep(1:5, each=32)]
  
  m1 <- glm(binary_response ~ dimension1, data=pptData, family="binomial")
  m2 <- glm(binary_response ~ dimension2, data=pptData, family="binomial")
  m3 <- glm(binary_response ~ dimension3, data=pptData, family="binomial")
  m4 <- glm(binary_response ~ dimension4, data=pptData, family="binomial")
  m5 <- glm(binary_response ~ dimension5, data=pptData, family="binomial")
  
  pOutput[participant_id==ppt, 
          c("m1_intercept", "m1_coef", "m1_aic",
            "m2_intercept", "m2_coef", "m2_aic",
            "m3_intercept", "m3_coef", "m3_aic",
            "m4_intercept", "m4_coef", "m4_aic",
            "m5_intercept", "m5_coef", "m5_aic") := 
            list(m1$coefficients[1], m1$coefficients[2], m1$aic,
                 m2$coefficients[1], m2$coefficients[2], m2$aic,
                 m3$coefficients[1], m3$coefficients[2], m3$aic,
                 m4$coefficients[1], m4$coefficients[2], m4$aic,
                 m5$coefficients[1], m5$coefficients[2], m5$aic)]
}

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



# What the fuck is happening? ----------------------------------------------------------------------
tData <-  data[experiment_phase=="test",]
tData[, correct:= ifelse(abstract_category_label==abstract_response_label, 1, 0)]

tSummary <- tData[, list(meanAccuracyTest=mean(correct), 
                         meanRTtest=mean(rt)),
                  by=.(participant_id, displayCondition, socialCondition)]


pData <- data[experiment_phase=="test_partial",]
pData[, correct:= ifelse(abstract_category_label==abstract_response_label, 1, 0)]

pSummary <- pData[, list(meanAccuracyPartial=mean(correct), 
                         meanRTpartial=mean(rt)), 
                  by=.(participant_id, displayCondition, socialCondition)]

tSummary <- merge(tSummary, pSummary)
tSummary[, rtDiff:= meanRTtest - meanRTpartial]
tSummary[, meanDiff:= meanAccuracyTest - meanAccuracyPartial]

ggplot(tSummary, aes(fill=displayCondition, y=rtDiff, x=socialCondition)) + 
  geom_violin(position="dodge", alpha=0.5) +
  scale_fill_viridis(discrete=T, name="") +
  theme_bw()  +
  xlab("") +
  ylab("Difference in reaction time") 

ggplot(tSummary, aes(fill=displayCondition, y=meanDiff, x=socialCondition)) + 
  geom_violin(position="dodge", alpha=0.5) +
  scale_fill_viridis(discrete=T, name="") +
  theme_bw()  +
  xlab("") +
  ylab("Difference in accuracy") 

pptData <- data[participant_id==1, ]
