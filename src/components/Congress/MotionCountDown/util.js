import { intervalToDuration } from 'date-fns';

export const getRemainingTimeString = ({
  now,
  untilEnd,
}) => {
  const {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  } = intervalToDuration(
    {
      start: now,
      end: untilEnd,
    },
  );
  const parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
  if (weeks > 0) parts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(' ') : 'less than 1 minute';
};
