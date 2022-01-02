// import { useState } from "react";
import { NavBar } from "./components/NavBar";
import { HomePage } from "./components/HomePage";
import { CalendarCard } from "./components/Calendar";
import { BottomBar } from "./components/BottomBar";
import ModalProvider from "mui-modal-provider";

export interface ViewProps {
  view: string;
}

function App() {
  // const [pictures, setPictures] = useState(fullShow);
  return (
    <>
      <ModalProvider>
        <NavBar view={"home"} />
        <HomePage view={"home"} />
        <CalendarCard />
        <BottomBar />
      </ModalProvider>
    </>
  );
}

export default App;
