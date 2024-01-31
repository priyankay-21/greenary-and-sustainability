//@ts-check

import React, { useState, useEffect } from "react";
import LearnerNavbar from "../Navbar/learner-navbar";
import MentorNavbar from "../Navbar/mentor-navbar";
import TextField from "@mui/material/TextField";
import "./feedback.css";
import feedbackcomp from "../../assets/feedback-comp.svg";
import { styled } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import firebase from "../../firebase";
import "@lottiefiles/lottie-player";

// custom styles for materialui textfields
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
const Feedback = () => {
  const [issueType, setIssueType] = useState(1);
  const [issue, setIssue] = useState(null);
  const [subject, setSubject] = useState(null);
  const [body, setBody] = useState(null);
  const [curuser, setCuruser] = useState(null);
  const [phone, setPhone] = useState(null);
  const [name, setName] = useState(null);
  const [userType, setUserType] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    verify();
  }, []);

  // verify if a user is already logged in and set approprite navbar, name and phone number
  const verify = async () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setCuruser(user.uid);
        setPhone(user.phoneNumber);

        // obtaining the middleware token to protect routes
        var tk;
        user.getIdToken(true).then(async (idToken) => {
          tk = idToken;
          // setting the user instance
          await axios
            .get("/api/learner/login/submitlearner", { headers: { Authorization: `Bearer ${tk}` } })
            .then((e) => {
              e.data.map((data) => {
                if (data.phone === user.phoneNumber) {
                  setName(data.name);
                  setUserType("learner");
                }
              });
            })
            .catch((err) => {
              console.log(err.message);
            });
          await axios
            .get("/api/mentor/login/submitmentor", { headers: { Authorization: `Bearer ${tk}` } })
            .then((e) => {
              e.data.map((data) => {
                if (data.phone === user.phoneNumber) {
                  setName(data.name);
                  setUserType("mentor");
                }
              });
            })
            .catch((err) => {
              console.log(err.message);
            });
        });
      } else {
        window.location = "/init-signin";
      }
    });
  };

  // frontend component of the page
  return (
    <div>
      {userType === null ? null : userType === "learner" ? ( // setting the navbar appropriately
        <LearnerNavbar />
      ) : (
        <MentorNavbar />
      )}
      <div style={{ height: "35px", backgroundColor: "#720d5d" }}></div>
      <div className='feedback-content'>
        <div className='feedback-content-left'>
          <img src={feedbackcomp} className='feedback-img'></img>
        </div>
        {/* displaying all three fields */}
        <div className='feedback-content-right'>
          <CssTextField
            id='subject-input'
            label='Subject'
            variant='outlined'
            fullWidth
            size='small'
            color='error'
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          />
          <br></br>
          <br></br>
          <Select
            id='issue-type'
            value={issueType}
            label='Issue Type'
            onChange={(e) => {
              // function to set an issue type
              setIssueType(e.target.value);
              if (e.target.value == 10) {
                setIssue("Report Abuse");
              } else if (e.target.value == 20) {
                setIssue("Platform Issue");
              } else if (e.target.value == 30) {
                setIssue("Question");
              } else if (e.target.value == 40) {
                setIssue("Other");
              } else {
                setIssue(null);
              }
            }}
            fullWidth
            size='small'
          >
            <MenuItem value={1} style={{ color: "gray" }}>
              <span style={{ color: "gray" }}>Type of Issue</span>
            </MenuItem>
            <MenuItem value={10}>Report Abuse</MenuItem>
            <MenuItem value={20}>Platform Issue</MenuItem>
            <MenuItem value={30}>Question</MenuItem>
            <MenuItem value={40}>Other</MenuItem>
          </Select>
          <br></br>
          <br></br>
          <CssTextField
            id='issue-body'
            label='Body of the issue'
            variant='outlined'
            fullWidth
            size='small'
            color='error'
            multiline
            rows={12}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          <div className='feedback-height'></div>
          {!show ? (
            <button
              className='feedback-button'
              onClick={() => {
                // function to submit the feedback
                var err = 0;
                if (subject == null || issue == null || body == null) {
                  err = 1;
                  alert("Please fill all the entries");
                }
                var feedback = {
                  phone: phone,
                  issueSubject: subject,
                  issueType: issue,
                  issueBody: body,
                  username: name,
                  assignedTo: "none",
                  status: 0, // 0 means not resolved yet, 1 means resolved
                  timestamp: new Date().toString(),
                };
                // uploading the feedback to the database
                if (!err) {
                  setShow(true);
                  axios
                    .post("/api/feedback/api/submitfeedback", feedback)
                    .then((res) => {
                      setShow(false);
                      alert("Feedback submitted successfully");
                      if (userType === "learner") window.location = "/my-mentors";
                      else window.location = "/my-students";
                    })
                    .catch((err) => {
                      setShow(false);
                      console.error(err);
                      alert("Feedback submission failed. Check console for further details");
                    });
                }
              }}
            >
              SUBMIT
            </button>
          ) : (
            <div className='feedback-button' style={{ backgroundColor: "white" }}>
              <lottie-player
                src='https://assets3.lottiefiles.com/packages/lf20_aenqe9xz.json'
                background='transparent'
                speed='1'
                style={{
                  width: "35px",
                  textAlign: `center`,
                  zIndex: "12",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "20px",
                }}
                loop
                autoplay
              ></lottie-player>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
