import image2 from "../images/image2.jpg";
import image4 from "../images/image4.jpg";
import image5 from "../images/image5.jpg";
import image6 from "../images/image6.jpg";
import image8 from "../images/image8.jpg";

import styles from "./styles.module.scss";
// const calendarImage = [image8];

export const HomePage = () => {
  // const pictures = view === "home" ? fullShow : calendarView;
  return (
    <div className={styles.homeImage}>
      <img src={image5} alt="homePageImage" />
    </div>
  );
};
