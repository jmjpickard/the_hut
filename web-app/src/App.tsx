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
