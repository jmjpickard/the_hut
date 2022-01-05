import { useModal } from "mui-modal-provider";
import { CreateBooking } from "./CreateBooking";
import "../App.css";

export const BottomBar = () => {
  const { showModal } = useModal();

  return (
    <div
      className="bottom-bar"
      onClick={() => {
        showModal(CreateBooking, { title: "Make memories at The Hut" });
      }}
    >
      {" "}
      Make a new booking
    </div>
  );
};
