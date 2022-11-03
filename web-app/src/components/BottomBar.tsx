import { useModal } from "mui-modal-provider";
import { CreateBooking } from "./CreateBooking";
import "../App.css";
import styles from "./styles.module.scss";

interface BottomBarProps {
  width: number;
}

export const BottomBar = ({ width }: BottomBarProps) => {
  const { showModal } = useModal();

  return (
    <div
      className={styles.bottomBar}
      onClick={() => {
        showModal(CreateBooking, { title: "Make memories at The Hut" });
      }}
    >
      {" "}
      Make a new booking
    </div>
  );
};
