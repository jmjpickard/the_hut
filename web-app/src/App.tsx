import { useState, useEffect } from "react";
import "./App.css";
import { MainPage } from "./pages/MainPage";
import { BookingPage } from "./pages/BookingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModalProvider from "mui-modal-provider";

export interface CalendarEvent {
  allDay?: boolean | undefined;
  title?: React.ReactNode | undefined;
  start?: Date | undefined;
  end?: Date | undefined;
  resource?: any;
  owner: "Jack" | "Charlie" | "Lily" | "M & D" | "Other";
  description: string;
  approved: boolean;
}

function App() {
  // const [events, setEvents] = useState<CalendarEvent[] | undefined>(undefined);

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("token");

  //   fetch(`${process.env.REACT_APP_API_URL!}/readBookings`, {
  //     headers: {
  //       authorization: accessToken ? `bearer ${accessToken}` : "na",
  //     },
  //   })
  //     .then((res) => {
  //       console.log("hello there");
  //       if (res.status === 401) {
  //         localStorage.removeItem("token");
  //         window.location.reload();
  //       }
  //       console.log("hello");
  //       return res.json();
  //     })
  //     .then((data: ApiCalendarEvent[]) => {
  //       const events = convertToCalendarEvents(data);
  //       setEvents(events);
  //     });
  // }, []);

  return (
    <BrowserRouter>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/bookings" element={<BookingPage />} />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
