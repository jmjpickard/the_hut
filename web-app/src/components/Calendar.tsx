import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CalendarEvent } from "../App";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";

const localizer = momentLocalizer(moment);

const barColor = {
  Jack: {
    background: "#8BBBCC",
    border: "thin solid #1A7B9F",
    text: "#1A7B9F",
  },
  Charlie: {
    background: "#DBCE6D",
    border: "thin solid #836B00",
    text: "#836B00",
  },
  Lily: {
    background: "#FE0BB4",
    border: "thin solid #FFA6E4",
    text: "#FFA6E4",
  },
  "M & D": {
    background: "#FE7D7D",
    border: "thin solid #FE0B0B",
    text: "#FE0B0B",
  },
  Other: {
    background: "blue",
    border: "thin solid red",
    text: "#3082A0",
  },
};

interface eventsProps {
  events: CalendarEvent[] | undefined;
}

export const CalendarCard = ({ events }: eventsProps) => {
  console.log(events);
  return (
    <Box
      sx={{
        width: "70vw",
        margin: "auto",
        opacity: 0.92,
        marginTop: "5vh",
      }}
    >
      <Card>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          style={{
            height: 500,
            width: "70vw",
            padding: "25px",
            margin: "auto",
          }}
          eventPropGetter={(event) => {
            let newStyle = {
              backgroundColor: "lightgrey",
              border: "thin solid grey",
              color: "white",
              fontFamily: "Gill Sans",
            };
            newStyle.backgroundColor = barColor[event.owner].background;
            newStyle.border = barColor[event.owner].border;
            newStyle.color = barColor[event.owner].text;
            return {
              className: "",
              style: newStyle,
            };
          }}
        />
      </Card>
    </Box>
  );
};
