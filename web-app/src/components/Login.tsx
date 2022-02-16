import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@material-ui/core/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import Box from "@mui/material/Box";
// Shape of form values
interface FormValues {
  email: "jack.pickard@hotmail.com";
  password: string;
}

interface OtherProps {
  message: string;
  initialEmail?: string;
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

const userLookup = {
  "jack.pickard@hotmail.com": "Jack",
  "lilygpickard@gmail.com": "Lily",
  "cejpickard@gmail.com": "Charlie",
  "pickards26@hotmail.co.uk": "M & D",
  "edpickard2004@yahoo.co.uk": "M & D",
};

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: OtherProps) => {
  const formik = useFormik({
    initialValues: {
      email: "jack.pickard@hotmail.com",
      password: "",
    },
    validationSchema: LoginValidation,

    onSubmit: (values: FormValues) => {
      return fetch(`${process.env.REACT_APP_API_URL!}/login`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const userEmail = values.email;
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("idToken", data.idToken);
          localStorage.setItem("userName", userLookup[userEmail]);
          window.location.reload();
        });
    },
  });

  const { message } = props;

  return (
    <form onSubmit={formik.handleSubmit} style={styles.form}>
      <h1 style={styles.header}>{message}</h1>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <AccountCircle sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          fullWidth
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <VpnKeyIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
      </Box>
      <Button style={styles.button} variant="contained" fullWidth type="submit">
        Submit
      </Button>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <div style={{ fontSize: 12, color: "#6AAEB2" }}>
          If you have forgotten your password, you are a numpty. But ask Jack.
        </div>
      </Box>
    </form>
  );
};

const LoginValidation = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string()
    .required("Please Enter your password")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    ),
});

// Wrap our form with the withFormik HoC
export const Login = InnerForm;
