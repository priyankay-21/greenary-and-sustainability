// @ts-check

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./learner-home.css";
import Card from "./card";
import ProgressChart from "./progress-chart";
import Navbar from "../Navbar/learner-navbar";
import LearnerSubjectDetails from "../LearnerSubjectDetailsPage/learner-subject-details";
import data from "../../data";
import { verify } from "../../verifyUser";
import firebase from "../../firebase";
import "@lottiefiles/lottie-player";

const borderStyle = { borderColor: "#ff0000", borderRadius: "20px" };

// main page component
const LearnerHome = (props) => {
  const [mentorData, setMentorData] = React.useState([]);
  const [curuser, setCuruser] = useState("No user is logged in");
  const [phone, setPhone] = useState("");
  const [pageDetails, setPageDetails] = useState({ pageName: "home" });
  const [show, setShow] = useState(false);

  // obtaining the user's assigned mentors from the database
  const getData = async (learner_phone) => {
    setShow(true);
    if (curuser === "No user is logged in") return;
    if (!phone) return;
    //console.log(curuser);
    const res = await axios.get(`/api/learner/get-data/phone/${phone}`, {
      headers: { Authorization: `Bearer ${curuser}` },
    });
    const learner_id = res.data._id;
    const subjects = res.data.subjects;

    if (res.data.is_banned) {
      alert("You have been banned. Please contact your administrator.");
      firebase.auth().signOut();
      localStorage.clear();
      window.location = "/init-signin";
    }

    /* 
      this array will contain the data of all the mentors 
      assigned to the student and each mentor's data will be shown
      on a card in the homepage
    */
    let mentor_data = [];

    for (let i = 0; i < subjects.length; i++) {

      const sub = subjects[i];
      // avoid subjects for which the mentor hasnt been assigned
      if (sub.mentor_id === "-1") continue;

      const res = await axios(`/api/mentor/get-data/id/${sub.mentor_id}`, {
        headers: { Authorization: `Bearer ${curuser}` },
      });

      const mentor = res.data;

      // fill temp with the data of each mentor
      // the push to the array
      let temp = {};
      const code = sub.code;

      temp.subject = data.codeToSubName[code.substring(0, code.length - 1)];
      temp.name = mentor.name;
      temp.learner_id = learner_id;
      temp.mentor_id = mentor._id;
      temp.Class = data.getClassNumber(code);
      temp.email = mentor.email;
      temp.phone = mentor.phone;
      temp.hasPendingTests = false;
      temp.hasConsented = true;
      temp.userType = "learner";
      temp.profile_picture_url = mentor.profile_picture_url;
      temp.is_banned = mentor.is_banned;

      mentor_data.push(temp);
    }

    console.log(mentor_data);
    setMentorData(mentor_data);
    setShow(false);
  };

  // verify that no user is currently logged in
  useEffect(() => {
    if (
      localStorage.getItem("userType") !== null &&
      localStorage.getItem("userType") !== undefined &&
      localStorage.getItem("userType") === "mentor"
    ) {
      window.location = "/my-students";
    } else if (
      localStorage.getItem("isloggedin") !== null &&
      localStorage.getItem("isloggedin") !== undefined &&
      localStorage.getItem("isloggedin") === "true"
    ) {
      window.location = "/admin-home";
    }
    verify(setCuruser, setPhone);
    getData();
  }, [phone, curuser]);

  // displaying the data
  return (
    <div>
      {pageDetails.pageName != "home" ? (
        <LearnerSubjectDetails setPageDetails={setPageDetails} subDetails={pageDetails.details} />
      ) : (
        <div className='learner-home learner-bg'>
          <Navbar />
          <div className='learner-curvature'></div>
          <div className='container-fluid p-0 learner-bg'>
            <div className='row m-3' style={borderStyle}>
              <div className='col-md card p-3 me-md-2 mb-3 mb-md-0' style={borderStyle}>
                <h1>
                  <strong>MENTORS</strong>
                </h1>
                {!show ? (
                  <div className='row'>
                    {mentorData.map((mentorDetails, i) => {
                      return (
                        <div key={i} className='col-8 mx-auto col-sm-6 mx-md-0' id='learner-home-mentors'>
                          <Card details={{ ...mentorDetails, userType: "learner" }} setPageDetails={setPageDetails} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <lottie-player
                    src='https://assets3.lottiefiles.com/packages/lf20_aenqe9xz.json'
                    background='transparent'
                    speed='1'
                    style={{
                      width: "60px",
                      textAlign: `center`,
                      zIndex: "12",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                    loop
                    autoplay
                  ></lottie-player>
                )}
              </div>
              <div className='col-md card p-3' style={borderStyle}>
                <h1 className='mb-3'>
                  <strong>YOUR PROGRESS</strong>
                </h1>
                <div className='row mb-3'>
                  <div className='col'>
                    <ProgressChart percent_complete={10} subject={"Mathematics"} />
                  </div>
                  <div className='col'>
                    <ProgressChart percent_complete={20} subject={"Social Studies"} />
                  </div>
                  <div className='col'>
                    <ProgressChart percent_complete={30} subject={"Science"} />
                  </div>
                </div>
                <div className='row'>
                  <div className='col'>
                    <ProgressChart percent_complete={40} subject={"Biology"} />
                  </div>
                  <div className='col'>
                    <ProgressChart percent_complete={50} subject={"Chemistry"} />
                  </div>
                  <div className='col'>
                    <ProgressChart percent_complete={60} subject={"Physics"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerHome;
