// import { useState } from "react";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import { BookingForm } from "./BookingForm";

type Props = DialogProps & {
  title: string;
};

// ✔️ create the dialog you want to use
export const CreateBooking: React.FC<Props> = ({ title, ...props }) => (
  <Dialog {...props}>
    <BookingForm message={title} />
  </Dialog>
);
