import * as React from "react";
import { useEffect } from "react";
import WebFont from "webfontloader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useModal } from "mui-modal-provider";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { SignInModal } from "./SignIn";
import { ViewProps } from "../App";

const styles = {
  buttonColor: {
    color: "#6AAEB2",
    border: "thin solid #6AAEB2",
    borderRadius: "10px 10px 10px",
    padding: "8px",
    // marginTop: "25px",
    // marginRight: "auto",
    position: "absolute" as "absolute",
    top: 25,
    right: 35,
    fontFamily: "Gill Sans",
    cursor: "pointer",
    fontSize: 20,
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
          variant="outlined"
          endIcon={<ArrowForwardIosIcon />}
          style={styles.buttonColor}
          onClick={() => {
            const token = localStorage.getItem("token");
            if (token) {
              localStorage.removeItem("token");
              localStorage.removeItem("idToken");
              window.location.reload();
            } else {
              showModal(SignInModal, { title: "Login" });
            }
          }}
        >
          {localStorage.getItem("token") ? "Sign out" : "Sign in"}
        </Button>
      ) : (
        <div></div>
      )}
    </Box>
  );
};
