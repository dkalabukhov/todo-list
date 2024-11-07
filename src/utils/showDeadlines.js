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
  dayjs.extend(isToday);
  const today = dayjs();
  const todayDayOfWeek = today.get('day');
  if (todayDayOfWeek === 0) {
    return dayjs(deadline).isToday();
  }
  const endOfTheWeekDay = 7 - todayDayOfWeek;
  const endOfTheWeek = dayjs().add(endOfTheWeekDay, 'day');
  return dayjs(deadline).isBetween(today, endOfTheWeek, 'day', '[]');
};

export { showAllDeadlines, isTodayDeadline, isTomorrowDeadline, isThisWeekDeadline };

