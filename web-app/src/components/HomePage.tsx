import { useEffect, useState } from "react";
import image2 from "../images/image2.jpg";
import image4 from "../images/image4.jpg";
import image5 from "../images/image5.jpg";
import image6 from "../images/image6.jpg";
import image8 from "../images/image8.jpg";

import styles from "./styles.module.scss";

import { ViewProps } from "../pages/MainPage";

const images = [image5, image4, image2, image8, image6];
// const calendarImage = [image8];

export const HomePage = ({ view }: ViewProps) => {
  const [screenImg, setScreenImg] = useState<string>(image2);
  useEffect(() => {
    setInterval(() => {
      const index = Math.floor(Math.random() * (images.length + 1));
      setScreenImg(images[index]);
    }, 5000);
  });
  console.log({ view });
  // const pictures = view === "home" ? fullShow : calendarView;
  return (
    <div className={styles.homePage}>
      <img src={screenImg} alt="homePageImage" />
    </div>
  );
};
