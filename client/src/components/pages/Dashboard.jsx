import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Row, Textarea } from "react-materialize";

const Dashboard = () => {
  // const [firstName, setFirstName] = useState(localStorage.getItem("firstName"));
  const [firstName, setFirstName] = useState("");
  console.log("RENDERED!!!!: ", firstName);

  const logout = () => {
    axios.post("/logout").then((response) => {
      console.log(response);
    });
    localStorage.clear();
  };

  useEffect(() => {
    axios.get("/login").then((response) => {
      console.log("RESPONSE: ", response);
      if (response.data.loggedIn) {
        // setLoginStatus(true)
        // setFirstName(response.data.firstName)
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("lastName: ", response.data.lastName);
        localStorage.setItem("email: ", response.data.email);
        localStorage.setItem("token", response.data.token);
        // setFirstName(localStorage.getItem("firstName"));
        setFirstName(response.data.firstName);
      }
    });
    // setFirstName(localStorage.getItem("firstName"));
  }, []);

  return (
    <div>
      <h2>Welcome back, {firstName}!</h2>
      <br />
      <br />
      <Row>
        <Textarea id="Textarea-12" l={12} m={12} s={12} xl={12} />
      </Row>
      <br />
      <br />
      <Link to="/signin">
        <Button
          node="button"
          style={{ marginRight: "5px" }}
          waves="light"
          onClick={logout}
        >
          Logout
        </Button>
      </Link>
    </div>
  );
};

export default Dashboard;
