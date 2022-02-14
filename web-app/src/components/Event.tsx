import { CalendarEvent } from "../App";
import { OverlayTrigger } from "react-bootstrap";
import { Popover } from "react-bootstrap";

interface eventProps {
  event: CalendarEvent;
}

export const Event = ({ event }: eventProps) => {
  let popoverClickRootClose = (
    <Popover id="popover-trigger-click-root-close" style={{ zIndex: 10000 }}>
      <strong>Holy guacamole!</strong> Check this info.
      <strong>{event.title}</strong>
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
          placement="bottom"
          overlay={popoverClickRootClose}
        >
          <div>{event.title}</div>
        </OverlayTrigger>
      </div>
    </div>
  );
};
