//@ts-check

import React, { useState, useEffect } from "react";
import auth_background from "../../assets/auth-background-comp.svg";
import wavefront from "../../assets/wavefront.svg";
import waveback from "../../assets/waveback.svg";
import humans from "../../assets/auth-human-comp.svg";
import telephone from "../../assets/telephone.svg";
import otp_img from "../../assets/otp.svg";
import "./authentication.css";
import { useSpring, animated } from "react-spring";
import TextField from "@mui/material/TextField";
import firebase from "../../firebase";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import axios from "axios";
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

//we need to know which button was clicked, learner or mentor, to redirect appropriately after authentication
// main page component
const Authentication = () => {
  let user = useParams();
  let userType = user.id.slice(1);
  console.log(userType); //:student or :mentor
  const [toggle, setToggle] = useState(true);
  const [curuser, setCuruser] = useState("No user is logged in");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const slides = [
    "The average time that students spend on social networks has risen to an all-time high",
    "In developing, low-income countries, every additional year of education can increase a person’s future income by an average of 10%",
    "In the sub-Saharan, 11.07 million children leave school before completing their primary education. In South and West Asia, that number reaches 13.54 million.",
  ];
  const [time, setTime] = useState(0);
  const interval = setInterval(() => {
    // interval for dynamic fact update
    setTime(time + 1);
    clearInterval(interval);
  }, 4000);
  const [valid_mentor, setValidMentor] = useState(false);
  const [valid_learner, setValidLearner] = useState(false);
  const [valid_user, setValidUser] = useState(false);
  const [customUserType, setCusomUserType] = useState(userType);
  const [show, setShow] = useState(false);

  // checking the type of the user
  useEffect(() => {
    if (
      localStorage.getItem("userType") !== null &&
      localStorage.getItem("userType") !== undefined &&
      localStorage.getItem("userType") === "mentor"
    ) {
      window.location = "/my-students";
    } else if (
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
  }, []);

  // verify if a user is already logged in
  useEffect(() => {
    verify();
  }, []);

  // function to verify the user session
  const verify = async () => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        setCuruser(user.uid);
        setPhone(user.phoneNumber);
        await axios.get("/api/user/login/getUser").then((e) => {
          e.data.map((data) => {
            if (user.phoneNumber === data.phone) {
              if (data.user_type === "learner") {
                window.location = "/my-mentors";
              } else {
                window.location = "/my-students";
              }
            }
          });
        });
      } else {
        setCuruser("No user found");
      }
    });
  };

  // invisibly checks if user is human
  const setupCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("auth-signin-button", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved
        verifyPhone();
      },
      defaultCountry: "IN",
    });
  };

  // function that sends otp
  const verifyPhone = async (e) => {
    //query the mongodb users database -
    // 1. if number does not exist - continue with sign up process
    // 2. if number exists but sign up is not successful - continue with sign up
    // 3. successful sign up number exists - route accordingly to homepage
    //set variables - mentor or learner, valid signup or not and use them for routing

    await axios.get("/api/user/login/getUser").then((e) => {
      console.log(e);
      // appending '+91'
      if (phone[0] != "+") setPhone("+91" + phone);

      e.data.map((user) => {
        let p = phone;
        if (p[0] != "+") p = "+91" + p;

        if (user.phone === p) {
          console.log("Valid phone number matched: ", p);
          setValidUser(true);
          // checking if the user is banned
          if (user.is_banned) {
            alert("You have been banned from logging in. Please contact an administrator.");
            window.location = "/";
          }
          if (user.user_type == "mentor") {
            userType = "mentor";
            setCusomUserType("mentor");
            if (user.valid_signup) {
              console.log("Set to valid mentor");
              setValidMentor(true);
              setValidLearner(false);
            }
          } else if (user.user_type == "learner") {
            userType = "learner";
            setCusomUserType("learner");
            if (user.valid_signup) {
              console.log("Set to valid learner");
              setValidLearner(true);
              setValidMentor(false);
            }
          }
        }
      });
    });

    setupCaptcha();
    let phoneNumber = phone;
    if (phone[0] != "+") phoneNumber = "+91" + phoneNumber;
    setPhone(phoneNumber);
    const appVerifier = window.recaptchaVerifier;

    // sending the OTP
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(function (confirmationResult) {
        // SMS sent
        window.confirmationResult = confirmationResult;
        console.log("OTP is sent");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // function signs in the user
  const verifyOtp = (e) => {
    setShow(true);
    e.preventDefault();
    let otpInput = otp;
    let otpConfirm = window.confirmationResult;
    otpConfirm
      .confirm(otpInput)
      .then(async function (result) {
        // User signed in successfully.
        console.log("Successful log in");
        const user = {
          phone: phone,
          user_type: userType,
          valid_signup: false,
        };

        // checks if the user is a first time user and routes appropriately
        if (!valid_user) {
          await axios.post(`/api/user/signup/createUser`, user).then((res) => console.log("Pushing user Sign up data"));
        }

        // signin successful
        if (customUserType == "mentor") {
          localStorage.setItem("userType", "mentor");
          if (valid_mentor) window.location = "/my-students";
          else window.location = "/mentor-signup";
        } else if (customUserType == "learner") {
          localStorage.setItem("userType", "learner");
          if (valid_learner) window.location = "/my-mentors";
          else window.location = "/learner-signup";
        }
      })
      .catch(function (error) {
        console.log(error);
        alert("Incorrect OTP");
      });
    verify();
  };

  // for react spring animations
  const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
  const trans1 = (x, y) => `translate3d(${x / 16}px,${y / 16}px,0)`;
  const trans2 = (x, y) => `translate3d(${x / 7.5}px,${y / 7.5}px,0)`;
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));

  // frontend component of the page
  return (
    <div className='auth-body'>
      <div className='auth-heading'>Verify your phone number</div>
      <div className='auth-content' onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
        <div className='auth-phone-svg'>
          <img src={auth_background} className='auth-background-img' />
          <animated.div style={{ transform: props.xy.to(trans1) }}>
            <img src={humans} className='auth-humans' />
            <img src={waveback} className='auth-wave-back' />
          </animated.div>
          <animated.div style={{ transform: props.xy.to(trans2) }}>
            <img src={wavefront} className='auth-wave-front' />
          </animated.div>
        </div>
        {toggle ? ( // switch between phone and OTP pages
          <div className='auth-content-body'>
            <div className='auth-91'>
              <span className='auth-num'>+91 </span>
              <span>
                <img src={telephone} className='auth-svg'></img>
              </span>
            </div>
            <br></br>
            <br></br>
            <div className='auth-text'>
              <CssTextField
                fullWidth
                onChange={(e) => {
                  // allow only numbers
                  const re = /^[0-9\b]+$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setPhone(e.target.value);
                  }
                }}
                label='Phone Number'
                id='auth-textfield'
                defaultValue=''
                size='small'
                placeholder=''
                color='error'
                value={phone}
              />
            </div>
            <br></br>
            <br></br>
            <div className=''>
              <button
                id='auth-signin-button'
                className='auth-button'
                onClick={(e) => {
                  // function to sign in the user
                  if (phone != undefined && phone != null && phone != "" && (phone.length == 10 || phone.length == 12)) {
                    setToggle(false);
                    verifyPhone(e); // verify if all fields are filled
                    setPhone("");
                  } else {
                    setPhone("");
                    alert("Please enter a valid phone number");
                  }
                }}
              >
                GET OTP
              </button>
            </div>
          </div>
        ) : (
          // OTP page
          <div className='auth-content-body'>
            <div className='auth-91'>
              <span>
                <img src={otp_img} className='auth-svg'></img>
              </span>
            </div>
            <br></br>
            <br></br>
            <div className='auth-text'>
              <CssTextField
                type='password'
                fullWidth
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
                label='OTP'
                id='auth-textfield'
                defaultValue=''
                size='small'
                placeholder=''
                color='error'
                value={otp}
              />
            </div>
            <br></br>
            <br></br>
            <div className=''>
              {!show ? (
                <button
                  id='auth-signin-button'
                  className='auth-button'
                  onClick={(e) => {
                    // function to sign in the user
                    if (otp != null && otp != undefined && otp != "" && otp.length === 6) {
                      verifyOtp(e); // verify if all fields are filled
                    } else {
                      alert("Please enter a valid OTP");
                    }
                  }}
                >
                  SUBMIT
                </button>
              ) : (
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
                  }}
                  loop
                  autoplay
                ></lottie-player>
              )}
            </div>
          </div>
        )}
        <img src={humans} className='auth-humans-phone' />
        <img src={auth_background} className='auth-background-img-phone' />
        <div className='bottom-fact'>{slides[time % slides.length]}</div>
      </div>
    </div>
  );
};

export default Authentication;
