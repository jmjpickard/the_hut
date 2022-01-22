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
  startDate: Date;
  endDate: Date;
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
  const formik = useFormik({
    initialValues: {
      startDate: new Date("2022-03-01"),
      endDate: new Date("2022-03-30"),
      title: "",
      description: "",
      owner: "",
      approved: false,
    },
    validationSchema: BookingValidation,

    onSubmit: (values: FormValues) => {
      console.log(values);
      // return fetch(`${process.env.REACT_APP_API_URL!}/login`, {
      //   method: "POST",
      //   body: JSON.stringify(values),
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     localStorage.setItem("token", data.accessToken);
      //     localStorage.setItem("idToken", data.idToken);
      //     window.location.reload();
      //   });
    },
  });

  const { message } = props;

  return (
    <form onSubmit={formik.handleSubmit} style={styles.form}>
      <h1 style={styles.header}>{message}</h1>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 5 }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            id="startDate"
            name="startDate"
            label="Start Date"
            inputVariant="outlined"
            format="dd MMM yyyy"
            clearable
            value={formik.values.startDate}
            onChange={(val) => formik.setFieldValue("startDate", val)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            id="endDate"
            name="endDate"
            label="End Date"
            inputVariant="outlined"
            format="dd MMM yyyy"
            clearable
            value={formik.values.endDate}
            onChange={(val) => formik.setFieldValue("endDate", val)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
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
  startDate: Yup.date().nullable().required(),
  endDate: Yup.date()
    .nullable()
    .required()
    .when(
      "startDate",
      (startDate, yup) =>
        startDate && yup.min(startDate, "End time cannot be before start time")
    ),
  title: Yup.string().required(),
  description: Yup.string().required(),
});

// Wrap our form with the withFormik HoC
export const BookingForm = InnerForm;
