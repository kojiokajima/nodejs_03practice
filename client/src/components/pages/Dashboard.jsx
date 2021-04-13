import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Row, Textarea } from "react-materialize";

const Dashboard = () => {
  const [firstName, setFirstName] = useState();
  const [posts, setPosts] = useState([]);
  const dummy = ["a", "b", "c", "d"];

  const logout = () => {
    axios.post("/logout").then((response) => {
      console.log(response);
    });
    localStorage.clear();
  };

  // const userAuthenticated = () => {
  //   axios.get('/isUserAuth', {
  //     headers: {
  //       "x-access-token": localStorage.getItem("token")
  //     }
  //   }).then((response) => {
  //     console.log("isUserAuth: ", response);
  //   })
  // }

  useEffect(() => {
    console.log("USE EFFECT CALLED!!");
    axios.get("/login").then((response) => {
      // console.log("RESPONSE: ", response);
      if (response.data.loggedIn) {
        // setLoginStatus(true)
        // setFirstName(response.data.firstName)
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("lastName", response.data.lastName);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("token", response.data.token);
        // setFirstName(localStorage.getItem("firstName"));
        // setFirstName(response.data.firstName);
      }
      setFirstName(localStorage.getItem("firstName"));
    });

    axios.get("/getpost").then((response) => {
      const data = response.data;
      console.log(response);
      if (data.length > 0) {
        console.log("DATA IS GREATER THAN 0");
        console.log(data);
        setPosts(data);
      }
      console.log("POSTS: ", posts);
    });
  }, []);

  // useEffect(() => {
  //   console.log("USEEFFECT2 CALLED!!");
  //   axios.get("/getpost").then((response) => {
  //     const data = response.data;
  //     console.log(response);
  //     if (data.length > 0) {
  //       console.log("DATA IS GREATER THAN 0");
  //       console.log(data);
  //       setPosts(data);
  //     }
  //     console.log("POSTS: ", posts);
  //   });
  // }, [posts]);

  return (
    <div>
      <h2>Welcome back, {firstName}!</h2>
      <br />
      <br />
      {posts.map((post, index) => (
        <div key={index}>{post.content}</div>
      ))}
      <br />
      <br />
      <form action="/post" method="post">
        <Row>
          <Textarea
            id="post"
            label="post"
            name="content"
            l={12}
            m={12}
            s={12}
            xl={12}
          />
          <Button node="button" style={{ marginRight: "-55px" }} waves="light">
            post
          </Button>
        </Row>
      </form>
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
