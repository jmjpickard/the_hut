// import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { HomePage } from "../components/HomePage";
import { CalendarCard } from "../components/Calendar";
import { BottomBar } from "../components/BottomBar";
import { CalendarEvent } from "../App";
import { useWindowSize } from "../hooks/window";

export interface ViewProps {
  view: string;
  width: number;
}

interface MainProps {
  events: CalendarEvent[] | undefined;
}

export const MainPage = ({ events }: MainProps) => {
  const token = localStorage.getItem("token");
  const view = token ? "calendar" : "home";
  const [width] = useWindowSize();

  return (
    <>
      <NavBar view={view} width={width} />
      <HomePage view={view} width={width} />
      {token && (
        <>
          <CalendarCard events={events} width={width} />
          <BottomBar />
        </>
      )}
    </>
  );
};
