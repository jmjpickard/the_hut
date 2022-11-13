import styles from "./upcomingEvents.module.scss";
import { CalendarEvent } from "../../App";

interface Props {
  events?: CalendarEvent[];
}

interface EventProps {
  title: string;
}

const Event: React.FC<EventProps> = ({ title }) => {
  return (
    <div className={styles.event}>
      <div>{title}</div>
    </div>
  );
};

export const UpcomingEvents: React.FC<Props> = ({ events }) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Upcoming bookings</div>
      <div className={styles.bookingsContent}>
        {events ? (
          events.map((event) => <Event title={event.owner} />)
        ) : (
          <div className={styles.nonEvent}>Nothing booked at the moment</div>
        )}
      </div>
    </div>
  );
};
