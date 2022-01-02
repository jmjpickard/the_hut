import BackgroundSlider from "react-background-slider";
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import image4 from "../images/image4.jpg";
import image5 from "../images/image5.jpg";
import image6 from "../images/image6.jpg";
import image7 from "../images/image7.jpg";
import image8 from "../images/image8.jpg";

import { ViewProps } from "../App";

const fullShow = {
  images: [image1, image2, image3, image4, image5, image6, image7, image8],
  duration: 5,
  transition: 2,
};

const calendarView = {
  images: [image2],
  duration: 100000,
  transition: 2,
};

export const HomePage = ({ view }: ViewProps) => {
  const pictures = view === "calendar" ? fullShow : calendarView;
  return (
    <BackgroundSlider
      images={pictures.images}
      duration={pictures.duration}
      transition={pictures.transition}
    />
  );
};
