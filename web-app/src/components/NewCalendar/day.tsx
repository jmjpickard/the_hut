import { daysProps } from "./newCalendar";
import styles from "./newCalendar.module.scss";

interface DayArgs {
  day: daysProps;
  topRow: boolean;
}

export const Day: React.FC<DayArgs> = ({ day, topRow }: DayArgs) => {
  return (
    <div key={day.date} className={topRow ? styles.topRow : styles.day}>
      <div className={styles.dayNumber}>{day.day}</div>
      {day.booked && <div className={styles.bookedDay}></div>}
    </div>
  );
};