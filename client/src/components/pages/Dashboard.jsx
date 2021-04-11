import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Row, Textarea } from "react-materialize";

const Dashboard = () => {
  const [firstName, setFirstName] = useState();

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
      }
    });
    setFirstName(localStorage.getItem("firstName"));
  }, []);

  return (
    <div>
      <h2>Welcome back, {firstName}!</h2>
      <br />
      <br />
      <form action="/post" method="post">
        <Row>
          <Textarea id="post" label="post" name="post" l={12} m={12} s={12} xl={12} />
          <Button
            node="button"
            style={{ marginRight: "-55px" }}
            waves="light"
            onClick={logout}
          >
            post
          </Button>
        </Row>
      </form>
      <br />
      <br />
      <Button
        node="button"
        style={{ marginRight: "5px" }}
        waves="light"
        onClick={logout}
      >
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
