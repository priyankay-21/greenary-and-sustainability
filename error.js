//@ts-check

import React, { useState, useEffect } from "react";
import LearnerNavbar from "../Navbar/learner-navbar";
import MentorNavbar from "../Navbar/mentor-navbar";
import TextField from "@mui/material/TextField";
import "./error.css";
import errorcomp from "../../assets/error.svg";
import { styled } from "@mui/material/styles";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import firebase from "../../firebase";

// custom css for materialui textfields
const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#4e0d3a",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#4e0d3a",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
      border: "none",
      borderBottom: "2px solid #4e0d3a",
      borderRadius: "0px",
    },
    "&:hover fieldset": {
      borderColor: "gray",
    },
    "&.Mui-focused fieldset": {
      border: "none",
      borderBottom: "2px solid #4e0d3a",
      borderRadius: "0px",
    },
  },
});

// main page component
const Error = () => {
  const [curuser, setCuruser] = useState(null);
  var phone = null;
  var tempuserType = "unknown";
  const [userType, setUserType] = useState("unknown");

  // verify if a user is already logged in
  useEffect(() => {
    verify();
  }, []);

  useEffect(() => {
    console.log(tempuserType);
    setUserType(tempuserType);
  }, [tempuserType, phone]);

  // verify if a user is already logged in and set appropriate navbar
  const verify = async () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setCuruser(user.uid);
        phone = user.phoneNumber;

        await axios.get("/api/user/login/getUser").then((e) => {
          console.log(phone);

          e.data.map((userData) => {
            let p = userData.phone;
            // appending '+91'
            if (p[0] != "+") p = "+91" + p;

            if (phone === p) {
              console.log("Valid phone number matched: ", p);
              if (userData.user_type === "mentor") {
                console.log("mentor found");
                setUserType("mentor");
                tempuserType = "mentor";
              } else if (userData.user_type === "learner") {
                setUserType("learner");
                tempuserType = "learner";
                console.log("learner found");
              }
              console.log("Phone number found ", p, userType);
            } else {
            }
          });
        });
        setUserType(tempuserType);
      }
    });
  };

  // for react spring animations
  const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
  const trans1 = (x, y) => `translate3d(${-x / 16}px,${-y / 16}px,0)`;
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));

  // frontend component of the page
  return (
    <div>
      {userType === "unknown" ? null : userType === "learner" ? ( // setting the correct navbar
        <LearnerNavbar />
      ) : (
        <MentorNavbar />
      )}
      <div style={{ height: "35px", backgroundColor: "#720d5d" }}></div>
      <div className='error-content' onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
        <div className='error-content-left'>
          <animated.div style={{ transform: props.xy.to(trans1) }}>
            <img src={errorcomp} className='error-img'></img>
          </animated.div>
        </div>
        <div className='error-content-right'>
          <div className='error-404-code'>404 Page Not Found</div>
          <div className='error-error'>ERROR</div>
          <br></br>
          <br></br>
          <div className='error-message'>Oops. Looks like we took the wrong turn. Let us guide you back to the right path.</div>
          <div className='error-height'></div>
          <button
            className='error-button'
            onClick={() => {
              // route based on user type
              if (userType == "unknown") window.location = "/init-signin";
              else if (userType == "learner") window.location = "/my-mentors";
              else if (userType == "mentor") window.location = "/my-students";
            }}
          >
            GO BACK HOME
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
