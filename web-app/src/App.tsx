import "./App.css";
import { MainPage } from "./pages/MainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModalProvider from "mui-modal-provider";

export interface CalendarEvent {
  allDay?: boolean;
  title?: React.ReactNode;
  start?: Date;
  end?: Date;
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
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
