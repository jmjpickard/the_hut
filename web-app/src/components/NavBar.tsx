import * as React from "react";
import { useEffect } from "react";
import WebFont from "webfontloader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useModal } from "mui-modal-provider";

import { SignInModal } from "./SignIn";
import { ViewProps } from "../App";

const styles = {
  buttonColor: {
    color: "#6AAEB2",
    // marginTop: "25px",
    // marginRight: "auto",
    position: "absolute" as "absolute",
    top: 25,
    right: 35,
    fontFamily: "Gill Sans",
    cursor: "pointer",
    fontSize: 25,
  },
  navText: {
    color: "#6AAEB2",
    fontSize: 100,
    fontFamily: "Gill Sans",
    letterSpacing: 45,
  },
};

export const NavBar = ({ view }: ViewProps) => {
  const { showModal } = useModal();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Indie Flower"],
      },
    });
  }, []);

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <span style={styles.navText}>THE HUT</span>
      {view === "home" ? (
        <Button
          style={styles.buttonColor}
          onClick={() => {
            console.log("clicked");
            showModal(SignInModal, { title: "Simple Dialog" });
          }}
        >
          Login
        </Button>
      ) : (
        <div></div>
      )}
    </Box>
  );
};
