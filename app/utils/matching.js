import _ from 'lodash';

const isCompetence = (type) => type === 'KOMPETENS';
const isExperience = (type) => type === 'YRKE';
const isDriversLicense = (type) => type === 'KORKORT';
const isKnownCompetence = (id, knownComp, callback) => {
  if (knownComp.includes(id)) callback(true);
  else callback(false);
};
const isKnownExperience = (exp, knownExp, callback) => {
  let isMatch = false;
  knownExp.forEach((item) => {
    if (item.id === exp.varde) {
      if ((item.years + 1) >= parseInt(exp.niva.varde)) isMatch = true;
    }
  });
  callback(isMatch);
};
const isKnownDriversLicense = (id, knownDL, callback) => {
  if (knownDL.includes(id)) callback(true);
  else callback(false);
};
const getMatchProcentage = (matchningLen, job) => {
  return matchningLen / _.filter(job.matchningsresultat.efterfragat, (j) => {
    return isCompetence(j.typ) || isExperience(j.typ);
  }).length;
};

export default function findMatchningJobs(jobs, knownCompetences, knownExperiences, knownDriversLicenses) {
  const allJobs = [];
  const matchingJobs = [];
  const nonMatchingJobs = [];

  if (jobs) {
    jobs.forEach((job) => {
      const jobCopy = JSON.parse(JSON.stringify(job));
      const matchingCriteria = [];
      const notMatchingCriteria = [];
      let isMatch = false;
      const onMatch = (req) => {
        matchingCriteria.push(req);
        isMatch = true;
        req.isKnown = true;
      };
      const onNotMatch = (req) => {
        notMatchingCriteria.push(req);
        req.isKnown = false;
      };

      jobCopy.matchningsresultat.efterfragat.forEach((req) => {
        if (isCompetence(req.typ)) {
          isKnownCompetence(req.varde, knownCompetences, (isKnown) => {
            if (isKnown) onMatch(req);
            else onNotMatch(req);
          });
        } else if (isExperience(req.typ)) {
          isKnownExperience(req, knownExperiences, (isKnown) => {
            if (isKnown) onMatch(req);
            else onNotMatch(req);
          });
        } else if (isDriversLicense(req.typ)) {
          isKnownDriversLicense(req.varde, knownDriversLicenses, (isKnown) => {
            if (isKnown) onMatch(req);
            else onNotMatch(req);
          });
        }
      });

      if (isMatch) {
        jobCopy.isMatch = true;
        jobCopy.matchingCriteria = matchingCriteria;
        jobCopy.notMatchingCriteria = notMatchingCriteria;
        jobCopy.matchProcent = getMatchProcentage(matchingCriteria.length, jobCopy);
        matchingJobs.push(jobCopy);
      } else {
        jobCopy.isMatch = false;
        jobCopy.matchingCriteria = [];
        jobCopy.notMatchingCriteria = notMatchingCriteria;
        jobCopy.matchProcent = 0;
        nonMatchingJobs.push(jobCopy);
      }
      allJobs.push(jobCopy);
    });
  }

  const sortedMatchingJobs = _.orderBy(matchingJobs,
    ['matchProcent', 'matchingCriteria', 'notMatchingCriteria'], ['desc', 'desc', 'asc']);

  return [allJobs, sortedMatchingJobs, nonMatchingJobs];
}