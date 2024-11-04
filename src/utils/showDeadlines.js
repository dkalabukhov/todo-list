import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isBetween from 'dayjs/plugin/isBetween';

const showAllDeadlines = () => true;

const isTodayDeadline = (deadline) => {
  dayjs.extend(isToday);
  return dayjs(deadline).isToday();
};

const isTomorrowDeadline = (deadline) => {
  dayjs.extend(isTomorrow);
  return dayjs(deadline).isTomorrow();
};

const isThisWeekDeadline = (deadline) => {
  dayjs.extend(isBetween);
  const today = dayjs();
  const thisWeek = today.add(6, 'day');
  return dayjs(deadline).isBetween(today, thisWeek, 'day', '[]');
};

export { showAllDeadlines, isTodayDeadline, isTomorrowDeadline, isThisWeekDeadline };

