import { CalendarEvent } from "../App";
import { OverlayTrigger } from "react-bootstrap";
import { Popover } from "react-bootstrap";

interface eventProps {
  event: CalendarEvent;
}

export const Event = ({ event }: eventProps) => {
  let popoverClickRootClose = (
    <Popover
      id="popover-trigger-click-root-close"
      style={{ zIndex: 10000, padding: 10, width: "400px" }}
    >
      <strong>{event.title}</strong>
      <span>{event.description}</span>
      <span>From: {event.start}</span>
      <span>To: {event.end}</span>
    </Popover>
  );

  console.log(event);
  return (
    <div>
      <div>
        <OverlayTrigger
          //   id="help"
          trigger="click"
          rootClose
          container={this}
          placement="top"
          overlay={popoverClickRootClose}
        >
          <div>{event.title}</div>
        </OverlayTrigger>
      </div>
    </div>
  );
};
