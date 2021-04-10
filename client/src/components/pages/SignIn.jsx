import React, { useEffect, useState } from "react";
import { Button, TextInput } from "react-materialize";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [loginStatus, setLoginStatus] = useState(false);
  const [firstName, setFirstName] = useState("");

  // useEffect(() => {
  //   axios.get("/login").then((response) => {
  //     // axios.post('/login').then((response) => {
  //     // if(response.data.loggedIn) {
  //     // setLoginStatus(response.data.user[0].username)
  //     // }

  //     // if (response.data.loggedIn) {
  //     //   // setLoginStatus(true)
  //     //   // setFirstName(response.data.firstName)
  //     //   localStorage.setItem("id", response.data.id);
  //     //   localStorage.setItem("firstName", response.data.firstName);
  //     //   localStorage.setItem("lastName: ", response.data.lastName);
  //     //   localStorage.setItem("email: ", response.data.email);
  //     // }

  //     console.log("RESPONSE: ", response.data);
  //     console.log("LOGINSTATUS: ", loginStatus);
  //   });
  // }, []);

  return (
    <div>
      <form action="/login" method="POST">
        <label htmlFor="">Email</label>
        <TextInput id="TextInput-4" label="email" name="email" />
        <label htmlFor="">Password</label>
        <TextInput id="TextInput-4" label="password" name="password" />
        <Button node="button" style={{ marginRight: "5px" }} waves="light">
          Sign In
        </Button>
      </form>
      <br />
      <br />
      <Link to="/">
        <Button node="button" style={{ marginRight: "5px" }} waves="light">
          Go Back
        </Button>
      </Link>
      {loginStatus && <h2>Hey, {firstName}!</h2>}
    </div>
  );
};

export default SignIn;
