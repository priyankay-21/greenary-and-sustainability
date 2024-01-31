//@ts-check

import React, { useEffect, useState } from "react";
import MentorNavbar from "../Navbar/mentor-navbar";
import { Link } from "react-router-dom";
import "./mentor-subject-details.css";
import data from "../../data";
import { verify } from "../../verifyUser";

const defaultClassCode = "SCI10";

// Used as child component of the main component "MentorSubjectDetails"
const Chapters = ({ handleClickChapter, classCode }) => {
  const chapters = [];
  (data[classCode] || data[defaultClassCode]).forEach((ch) => {
    chapters.push(ch.name);
  });

  const [ch, setCh] = useState(0);
  const [curuser, setCuruser] = useState("No user is logged in");
  const [phone, setPhone] = useState("");

  // reroute if a different user is logged in
  useEffect(() => {
    if (
      localStorage.getItem("userType") !== null &&
      localStorage.getItem("userType") !== undefined &&
      localStorage.getItem("userType") === "learner"
    ) {
      window.location = "/my-mentors";
    } else if (
      localStorage.getItem("isloggedin") !== null &&
      localStorage.getItem("isloggedin") !== undefined &&
      localStorage.getItem("isloggedin") === "true"
    ) {
      window.location = "/admin-home";
    }
    verify(setCuruser, setPhone);
  }, []);

  useEffect(() => {
    handleClickChapter(ch);
  }, [ch]);

  return (
    <div className="mentor-subject-details-chapters">
      <div
        style={{
          color: "white",
          fontSize: "30px",
          borderBottom: "solid 1px white",
          width: "90%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        Chapters
      </div>
      {chapters.map((chName, i) => (
        <div
          className="mentor-chapter-element"
          onClick={() => {
            setCh(i);
          }}
          style={i == ch ? { border: "1px solid white" } : {}}
        >
          {chName}
        </div>
      ))}
    </div>
  );
};

// Used as child component of the main component "MentorSubjectDetails"
const SubTopics = ({ curChapter, classCode }) => {
  const subTopics = (data[classCode] || data[defaultClassCode])[curChapter]
    .subtopics;

  return (
    <div className="mentor-subject-details-subtopics">
      <div
        style={{
          color: "white",
          fontSize: "30px",
          borderBottom: "solid 1px white",
          width: "90%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        SubTopics
      </div>
      {/* TODO : put a SAVE button so that the mentor can change the status of a subtopic*/}
      {subTopics.map((t) => (
        <div
          className="mentor-chapter-element"
          style={{ background: "#f0cce2", color: "#5D1049" }}
        >
          <input type="checkbox" checked={t[1]} />
          {t[0].length < 20 ? t[0] : t[0].substring(0, 20) + "....."}
        </div>
      ))}
    </div>
  );
};

// Used as child component of the main component "MentorSubjectDetails"
const PendingTests = ({ pendingTests }) => {
  const handleLaunchTest = (topic) => {
    alert(`Test has been launched on \"${topic}\". Please note that this functionality is representative which means that no real test is being conducted for the students.`);
  };
  return (
    <div className="mentor-tests-tab-inner">
      {pendingTests.map((topic) => (
        <div className="mentor-subtopic-test-element">
          <div
            style={{ marginLeft: "10px", marginTop: "-10px", width: "10vw" }}
          >
            {topic.length < 20 ? topic : topic.substring(0, 20) + "....."}
          </div>
          <div
            className="mentor-launch-test-button"
            onClick={(e) => {
              handleLaunchTest(topic);
            }}
          >
            LAUNCH TEST
          </div>
        </div>
      ))}
    </div>
  );
};

// Used as child component of the main component "MentorSubjectDetails"
const CompletedTests = ({ completedTests }) => {
  const handleTestDetails = (topic) => {
    alert(`Test details of topic: \"${topic}\"are available here. Please note that this functionality is representative hence there is no real data of tests results and details avaiable.`);
  };
  return (
    <div className="mentor-tests-tab-inner">
      {completedTests.map((topic) => (
        <div className="mentor-subtopic-test-element">
          <div
            style={{ marginLeft: "10px", marginTop: "-10px", width: "10vw" }}
          >
            {topic.length < 20 ? topic : topic.substring(0, 20) + "....."}
          </div>
          <div className="mentor-launch-test-button" onClick={(e) => {handleTestDetails(topic);}}>VIEW DETAILS</div>
        </div>
      ))}
    </div>
  );
};

// Used as child component of the main component "MentorSubjectDetails"
const Tests = ({ pendingTests, completedTests }) => {
  const [tab, setTab] = React.useState(0);

  return (
    <div className="mentor-subject-details-tests">
      <div style={{ display: "flex", padding: "10px" }}>
        <div
          className="mentor-test-tab-button"
          style={tab == 0 ? { border: "solid 3px red", opacity: 1 } : {}}
          name="pending"
          onClick={() => {
            setTab(0);
          }}
        >
          PENDING TESTS
        </div>
        <div
          className="mentor-test-tab-button"
          style={tab == 1 ? { border: "solid 3px red", opacity: 1 } : {}}
          name="completed"
          onClick={() => {
            setTab(1);
          }}
        >
          COMPLETED
        </div>
      </div>
      {tab == 0 && <PendingTests pendingTests={pendingTests} />}
      {tab == 1 && <CompletedTests completedTests={completedTests} />}
    </div>
  );
};

// main component
class MentorSubjectDetails extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      subjectName: props.subDetails["subject"] || "Subject Name",
      classCode:
        data.codes[props.subDetails["subject"].split()[0]] +
        props.subDetails["Class"],
      curChapter: 0,
    };

    this.handleClickChapter = this.handleClickChapter.bind(this);
  }

  // reroute if a different user is logged in
  componentDidMount() {
    if (
      localStorage.getItem("userType") !== null &&
      localStorage.getItem("userType") !== undefined &&
      localStorage.getItem("userType") === "learner"
    ) {
      window.location = "/my-mentors";
    } else if (
      localStorage.getItem("isloggedin") !== null &&
      localStorage.getItem("isloggedin") !== undefined &&
      localStorage.getItem("isloggedin") === "true"
    ) {
      window.location = "/admin-home";
    }
  }

  handleClickChapter(ch) {
    console.log(ch);
    this.setState({ curChapter: ch });
  }

  render() {
    return (
      <div>
        <MentorNavbar />
        <div className="mentor-subject-details-main">
          <div
            style={{ width: "30%", display: "flex", flexDirection: "column" }}
          >
            <div
              className="mentor-subject-details-back"
              onClick={() => {
                this.props.setPageDetails({ pageName: "home" });
              }}
            >
              BACK
            </div>
            <div className="mentor-subject-details-subjectname-mobile">
              {this.state.subjectName}
            </div>
            <Chapters
              handleClickChapter={this.handleClickChapter}
              classCode={this.state.classCode}
            />
          </div>
          <SubTopics
            curChapter={this.state.curChapter}
            classCode={this.state.classCode}
          />

          <div className="mentor-subject-details-col3">
            <div className="mentor-subject-details-subjectname">
              {this.state.subjectName}
            </div>

            {/* temporarily pending and completed tests are stored in data.js , these need to be queried from DB */}

            <Tests
              pendingTests={
                //data.chapters.Science[this.state.curChapter].pendingTests
                (data[this.state.classCode] || data[defaultClassCode])[
                  this.state.curChapter
                ].pendingTests
              }
              completedTests={
                //data.chapters.Science[this.state.curChapter].completedTests
                (data[this.state.classCode] || data[defaultClassCode])[
                  this.state.curChapter
                ].completedTests
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MentorSubjectDetails;
