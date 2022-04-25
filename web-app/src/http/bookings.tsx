export const getBookings = () => {
  const accessToken = localStorage.getItem("token");

  return fetch(`${process.env.REACT_APP_API_URL!}/readBookings`, {
    headers: {
      authorization: accessToken ? `bearer ${accessToken}` : "na",
    },
  }).then((res) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }

    return res.json();
  });
};
