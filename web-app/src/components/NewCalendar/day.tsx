import { daysProps } from "./newCalendar";
import styles from "./newCalendar.module.scss";
import clx from "classnames";

interface DayArgs {
  day: daysProps;
  topRow: boolean;
  onClick: (day: daysProps) => void;
}

export const Day: React.FC<DayArgs> = ({ day, topRow, onClick }: DayArgs) => {
  return (
    <div
      key={day.date}
      className={clx(styles.day, {
        [styles.topRow]: topRow,
        [styles.selected]: day.selected,
      })}
      onClick={() => onClick(day)}
    >
      <div className={styles.dayNumber}>{day.day}</div>
      {day.booked && <div className={styles.bookedDay}></div>}
    </div>
  );
};
