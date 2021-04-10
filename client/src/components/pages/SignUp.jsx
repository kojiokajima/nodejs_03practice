import React from "react";
import { TextInput, Button } from "react-materialize";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  axios.defaults.withCredentials = true;
  //   const [email, setEmail] = useState("yoo")
  //   const [password, setPassword] = useState("PASS")

  return (
    <div>
      {/* <form action="http://localhost:3001/signup" method="POST"> */}
      <form action="/signup" method="POST">
        <label htmlFor="">First Name</label>
        <TextInput id="firstName" label="First Name" name="firstName" />
        <label htmlFor="">Last Name</label>
        <TextInput id="lastName" label="Last Name" name="lastName" />
        <label htmlFor="">Email</label>
        <TextInput id="email" label="email" name="email" email={true} />
        <label htmlFor="">Password</label>
        <TextInput
          id="password"
          label="password"
          name="password"
          password={true}
        />
        <br />
        <Button node="button" style={{ marginRight: "5px" }} waves="light">
          Register
        </Button>
        <br />
        <br />
        <Link to="/">
          <Button node="button" style={{ marginRight: "5px" }} waves="light">
            Go Back
          </Button>
        </Link>
      </form>
    </div>
  );
};

export default SignUp;
