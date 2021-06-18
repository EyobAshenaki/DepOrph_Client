import moment from "moment";

function capitalize(string) {
  return `${String(string)
    .charAt(0)
    .toUpperCase()}${String(string).substring(1)}`;
}

function calculateAge(dateOfBirth) {
  const ageInYears = moment().diff(dateOfBirth, `years`);
  if (ageInYears > 0) return ageInYears;
  return `Less than a year`;
}

export { capitalize, calculateAge };
