import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Box from "@mui/material/Box";
// Shape of form values
interface FormValues {
  start_date: Date;
  end_date: Date;
  title: string;
  description: string;
  owner: string;
  approved: boolean;
}

interface OtherProps {
  message: string;
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column" as "column",
    padding: "25px",
    gap: "25px",
  },
  error: {
    fontSize: 14,
    color: "red",
  },
  button: {
    backgroundColor: "#6AAEB2",
    color: "white",
    fontWeight: "bold" as "bold",
    height: "40px",
  },
  input: {
    backgroundColor: "#A5E9F2",
  },
  header: {
    textAlign: "center" as "center",
    color: "#6AAEB2",
  },
  bottomRow: {
    display: "flex",
    flexDirection: "row" as "row",
    justifyContent: "space-between",
  },
  link: {
    color: "#ADADAD",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: OtherProps) => {
  // const userName = localStorage.getItem("userName") ?? "Jack";
  const formik = useFormik({
    initialValues: {
      start_date: new Date("2022-03-01"),
      end_date: new Date("2022-03-30"),
      title: "",
      description: "",
      owner: "Jack",
      approved: false,
    },
    validationSchema: BookingValidation,

    onSubmit: (values: FormValues) => {
      console.log("submit");
      return fetch(`${process.env.REACT_APP_API_URL!}/createBooking`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
          // window.location.reload();
        });
    },
  });

  const { message } = props;

  return (
    <form onSubmit={formik.handleSubmit} style={styles.form}>
      <h1 style={styles.header}>{message}</h1>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 5 }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            id="start_date"
            name="start_date"
            label="Start Date"
            inputVariant="outlined"
            format="dd MMM yyyy"
            clearable
            value={formik.values.start_date}
            onChange={(val) => {
              const valDate = new Date(String(val)).toISOString();
              formik.setFieldValue("start_date", valDate);
            }}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            error={
              formik.touched.start_date && Boolean(formik.errors.start_date)
            }
            helperText={formik.touched.start_date && formik.errors.start_date}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            id="end_date"
            name="end_date"
            label="End Date"
            inputVariant="outlined"
            format="dd MMM yyyy"
            clearable
            value={formik.values.end_date}
            onChange={(val) => {
              const valDate = new Date(String(val)).toISOString();
              console.log(valDate);
              formik.setFieldValue("end_date", valDate);
            }}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            error={formik.touched.end_date && Boolean(formik.errors.end_date)}
            helperText={formik.touched.end_date && formik.errors.end_date}
          />
        </MuiPickersUtilsProvider>
      </Box>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Title"
          type="text"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          type="text"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />
      </Box>
      <Button style={styles.button} variant="contained" fullWidth type="submit">
        Submit
      </Button>
    </form>
  );
};

const BookingValidation = Yup.object().shape({
  start_date: Yup.date().nullable().required(),
  end_date: Yup.date()
    .nullable()
    .required()
    .when(
      "start_date",
      (start_date, yup) =>
        start_date &&
        yup.min(start_date, "End time cannot be before start time")
    ),
  title: Yup.string().required(),
  description: Yup.string().required(),
});

// Wrap our form with the withFormik HoC
export const BookingForm = InnerForm;
