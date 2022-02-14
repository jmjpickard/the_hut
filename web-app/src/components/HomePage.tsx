import BackgroundSlider from "react-background-slider";
import image2 from "../images/image2.jpg";
import image4 from "../images/image4.jpg";
import image5 from "../images/image5.jpg";
import image6 from "../images/image6.jpg";
import image8 from "../images/image8.jpg";

import { ViewProps } from "../App";

const fullShow = {
  images: [image5, image4, image2, image8, image6],
  duration: 5,
  transition: 2,
};

const calendarView = {
  images: [image5],
  duration: 100000,
  transition: 2,
};

export const HomePage = ({ view }: ViewProps) => {
  const pictures = view === "home" ? fullShow : calendarView;
  return (
    <BackgroundSlider
      images={pictures.images}
      duration={pictures.duration}
      transition={pictures.transition}
    />
  );
};
