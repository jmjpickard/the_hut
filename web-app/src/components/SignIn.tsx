// import { useState } from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { Login } from "./Login";

type Props = DialogProps & {
  title: string;
};

// ✔️ create the dialog you want to use
export const SignInModal: React.FC<Props> = ({ title, ...props }) => (
  <Dialog {...props} fullWidth maxWidth="sm">
    <Login message={title} />
  </Dialog>
);
