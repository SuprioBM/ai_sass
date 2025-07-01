import { Experience } from "@/types/Cv";

export function calculateTotalExperienceInYears(experiences: Experience[]) {
  let totalMonths = 0;

  experiences.forEach((exp) => {
    const start = new Date(exp.startDate);
    const end = new Date(exp.endDate || new Date()); // fallback to now if currently employed

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    totalMonths += Math.max(months, 0); // prevent negative in case of invalid data
  });

  return (totalMonths / 12).toFixed(1); // returns string like "3.3"
}
