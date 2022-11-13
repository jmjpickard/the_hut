import moment from "moment";
import { useState } from "react";
import { CalendarEvent } from "../../App";
import { Day } from "./day";
import styles from "./newCalendar.module.scss";

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export interface daysProps {
  day: string;
  date: string;
  booked: boolean;
  bookedBy: string;
  selected: boolean;
}

interface Props {
  events?: CalendarEvent[];
}

const buildDays = (dayDiff: number, firstMondayWeekOfMonth: moment.Moment) => {
  let days: daysProps[] = [];
  for (let x = 0; x <= dayDiff; x++) {
    const currentDate = moment(firstMondayWeekOfMonth).add(x, "days");
    days = [
      ...days,
      {
        day: currentDate.format("DD"),
        date: currentDate.format("YYYY-MM-DD hh:mm"),
        booked: false,
        bookedBy: "",
        selected: false,
      },
    ];
  }
  return days;
};

export const NewCalendar: React.FC<Props> = ({ events }) => {
  const today = moment();
  const [date, setDate] = useState(today);

  const [firstDayOfMonth, setFirstDayOfMonth] = useState(
    moment().startOf("month")
  );
  const [firstMondayWeekOfMonth, setFirstMondayWeekOfMonth] = useState(
    moment().startOf("month").day(1)
  );
  const [lastDayOfMonth, setLastDayOfMonth] = useState(today.endOf("month"));
  const [lastSundayWeekOfMonth, setLastSundayWeekOfMonth] = useState(
    moment(lastDayOfMonth).day(6)
  );
  const [dayDiff, setDayDiff] = useState(
    lastSundayWeekOfMonth.diff(firstMondayWeekOfMonth, "days") + 1
  );
  const [days, setDays] = useState<daysProps[]>(
    buildDays(dayDiff, firstMondayWeekOfMonth)
  );

  const [onStart, setOnStart] = useState(true);

  const handleArrowClick = (isForward: boolean) => {
    const newDate = isForward
      ? date.add(1, "month")
      : date.subtract(1, "month");
    const firstOfMonth = moment(newDate).startOf("month");
    const firstMonday = moment(firstOfMonth).day(1);
    const lastDay = moment(newDate).endOf("month");
    const lastSunday = moment(lastDay).day(6);
    const diff = moment(lastSunday).diff(moment(firstMonday), "days") + 1;

    setDate(newDate);
    setFirstDayOfMonth(firstOfMonth);
    setFirstMondayWeekOfMonth(firstMonday);
    setLastDayOfMonth(lastDay);
    setLastSundayWeekOfMonth(lastSunday);
    setDayDiff(diff);
    setDays(buildDays(diff, firstMonday));
  };

  const handleDayClick = (day: daysProps) => {
    if (onStart) {
      setDays(
        days.map((d) => {
          if (d.date === day.date) {
            return { ...d, selected: true };
          }
          return { ...d, selected: false };
        })
      );
    } else {
      const startDate = days.find((d) => d.selected);
      setDays(
        days.map((d) => {
          const dDate = new Date(d.date);
          const dayDate = new Date(day.date);
          if (!startDate) {
            return { ...d, selected: false };
          }
          if (dDate <= dayDate && dDate >= new Date(startDate.date)) {
            return { ...d, selected: true };
          }
          return { ...d, selected: false };
        })
      );
    }
    setOnStart(!onStart);
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.topDisplay}>
        <div>{firstDayOfMonth.format("MMM YYYY")}</div>
        <div className={styles.arrowContainer}>
          <div
            onClick={() => {
              handleArrowClick(false);
            }}
            className={styles.arrow}
          >
            &#x2190;
          </div>
          <div
            onClick={() => {
              handleArrowClick(true);
            }}
            className={styles.arrow}
          >
            &#x2192;
          </div>
        </div>
      </div>
      <div className={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <div key={day} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.dayContainer}>
        {days.map((day, idx) => {
          return <Day day={day} topRow={idx < 7} onClick={handleDayClick} />;
        })}
      </div>
    </div>
  );
};
