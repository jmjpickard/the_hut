import * as React from "react";
import { useEffect } from "react";
import WebFont from "webfontloader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useModal } from "mui-modal-provider";
import { UserMenu } from "./UserMenu";
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
    top: "50%",
    right: "50%",
    fontFamily: "Gill Sans",
    cursor: "pointer",
    fontSize: 20,
  },
  navText: {
    color: "#6AAEB2",
    fontSize: 100,
    fontFamily: "Gill Sans",
    letterSpacing: 45,
    cursor: "pointer",
  },
  signInButton: {
    position: "absolute" as "absolute",
    bottom: "37%",
    margin: "auto",
    color: "white",
    fontSize: 25,
    border: "1pt solid #6AAEB2",
    height: "200px",
    width: "200px",
    borderRadius: "100px 100px",
    display: "flex",
    cursor: "pointer",
    backgroundColor: "#6AAEB2",
    textDecoration: "none",
    opacity: 0.9,
    boxShadow: "1px 1px 1px 1px #E1E8ED",
    "&:hover": {
      border: "2pt solid #EF007A",
      boxShadow: "0px 0px 0px 0px #E1E8ED",
    },
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
          style={styles.signInButton}
          onClick={() => {
            const token = localStorage.getItem("token");
            if (token) {
              localStorage.removeItem("token");
              localStorage.removeItem("idToken");
              localStorage.removeItem("userName");
              window.location.reload();
            } else {
              showModal(SignInModal, { title: "Login" });
            }
          }}
        >
          Enter
        </Button>
      ) : (
        <UserMenu />
      )}
    </Box>
  );
};
