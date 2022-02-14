import { useState } from "react";
import { CalendarEvent } from "../App";
import { OverlayTrigger } from "react-bootstrap";
import { Popover } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
// import { ApiCalendarEvent } from "../App";

interface eventProps {
  event: CalendarEvent;
}

const convertToApiInput = (event: CalendarEvent) => {
  return {
    start_date: event.start,
    end_date: event.end,
    title: event.title,
    description: event.description,
    owner: event.owner,
    approved: event.approved,
  };
};

const dateFormat = (date: Date | undefined) => {
  if (date) {
    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }
  return "Not known";
};

export const Event = ({ event }: eventProps) => {
  const [view, setView] = useState("info");
  const startDate = dateFormat(event.start);
  const endDate = dateFormat(event.end);

  let popoverClickRootClose = (
    <Popover
      id="popover-trigger-click-root-close"
      style={{
        zIndex: 10000,
        padding: 10,
        width: "400px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <strong style={{ marginTop: 8 }}>{event.title}</strong>

        <IconButton
          color="inherit"
          aria-label="delete"
          onClick={(e) => setView("confirmDelete")}
          edge="start"
          style={{ marginRight: "10px" }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
      <span>
        {startDate} - {endDate}{" "}
      </span>
      <br></br>
      <span>{event.description}</span>
    </Popover>
  );

  let confirmDelete = (
    <Popover
      id="popover-trigger-click-root-close"
      style={{ zIndex: 10000, padding: 10, width: "400px" }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <strong style={{ marginTop: 10 }}>Are you sure?</strong>
        <div style={{ marginLeft: "auto" }}>
          <IconButton
            aria-label="yes"
            onClick={() => {
              const apiEvent = convertToApiInput(event);
              return fetch(`${process.env.REACT_APP_API_URL!}/deleteBooking`, {
                method: "DELETE",
                body: JSON.stringify(apiEvent),
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  window.location.reload();
                });
            }}
            edge="start"
            style={{ marginRight: "10px", color: "green" }}
          >
            <DoneIcon />
          </IconButton>
          <IconButton
            aria-label="no"
            onClick={(e) => setView("info")}
            edge="start"
            style={{ marginRight: "10px", color: "red" }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </Popover>
  );

  return (
    <div>
      <div>
        <OverlayTrigger
          //   id="help"
          trigger="click"
          rootClose
          container={this}
          placement="top"
          onExited={() => setView("info")}
          overlay={view === "info" ? popoverClickRootClose : confirmDelete}
        >
          <div>{event.title}</div>
        </OverlayTrigger>
      </div>
    </div>
  );
};
