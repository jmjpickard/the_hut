// import { useState } from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

type Props = DialogProps & {
  title: string;
};

// ✔️ create the dialog you want to use
export const SignInModal: React.FC<Props> = ({ title, ...props }) => (
  <Dialog {...props}>
    <DialogTitle>{title}</DialogTitle>
  </Dialog>
);
