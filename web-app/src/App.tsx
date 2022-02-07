// import { useState } from "react";
import { NavBar } from "./components/NavBar";
import { HomePage } from "./components/HomePage";
import { CalendarCard } from "./components/Calendar";
import { BottomBar } from "./components/BottomBar";
import ModalProvider from "mui-modal-provider";

export interface ViewProps {
  view: string;
}

export interface CalendarEvent {
  allDay?: boolean | undefined;
  title?: React.ReactNode | undefined;
  start?: Date | undefined;
  end?: Date | undefined;
  resource?: any;
  owner: "Jack" | "Charlie" | "Lily" | "M & D" | "Other";
}

const getEvents = () => {
  return fetch(`${process.env.REACT_APP_API_URL!}/readBookings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
};

function App() {
  const token = localStorage.getItem("token");
  const view = token ? "home" : "calendar";
  console.log(getEvents());
  return (
    <>
      <ModalProvider>
        <NavBar view={"home"} />
        <HomePage view={view} />
        {token && (
          <>
            <CalendarCard />
            <BottomBar />
          </>
        )}
      </ModalProvider>
    </>
  );
}

export default App;
