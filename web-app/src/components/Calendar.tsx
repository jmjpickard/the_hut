import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { CalendarEvent } from "../App";
import { Event } from "./Event";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";

const localizer = momentLocalizer(moment);

const barColor = {
  Jack: {
    background: "#8BBBCC",
    border: "thin solid #8BBBCC",
    text: "#FFFFFF",
  },
  Charlie: {
    background: "#DBCE6D",
    border: "thin solid #DBCE6D",
    text: "#FFFFFF",
  },
  Lily: {
    background: "#FE0BB4",
    border: "thin solid #FE0BB4",
    text: "#FFFFFF",
  },
  "M & D": {
    background: "#FE7D7D",
    border: "thin solid #FE7D7D",
    text: "#FFFFFF",
  },
  Other: {
    background: "blue",
    border: "thin solid red",
    text: "#FFFFFF",
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
        marginTop: "0vh",
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
          components={{
            event: Event,
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
