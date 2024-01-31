//@ts-check

import React, { useEffect } from "react";
import main_logo from "../../assets/main-logo.svg";
import left from "../../assets/initiate-signin-left.svg";
import right from "../../assets/initiate-signin-right.svg";
import "./initiate-signin.css";
import { useSpring, animated } from "react-spring";
import { Link } from "react-router-dom";

// main page component
const InitiateSignin = () => {
  // react spring animations
  const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
  const trans1 = (x, y) => `translate3d(${-x / 16}px,${-y / 16}px,0)`;
  const trans2 = (x, y) => `translate3d(${x / 8}px,${y / 8}px,0)`;
  const [props, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
  }));

  // checking if the user is already signed in
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

  // frontend component of the page
  return (
    <div className='init-signin-body'>
      <div className='init-signin-content1' onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
        <Link to='/admin-auth' className='init-signin-admin'>
          Sign in as an admin
        </Link>
        <div className='init-signin-left'>
          <animated.div style={{ transform: props.xy.to(trans1) }}>
            <img src={left} width='80%'></img>
          </animated.div>
          <div className='init-signin-left-content'>
            <button
              className='init-signin-button'
              onClick={() => {
                // learner singin
                window.location = "/authentication:learner";
              }}
            >
              SIGN IN AS A LEARNER
            </button>
            <div className='init-signin-text1'>
              When you sign up as a Learner, you are connected with real mentors for each subject that you want to learn. Your mentors
              can reach you via your contact number or email address. Sign up and take the first step towards education and success!
            </div>
          </div>
          <div className='init-signin-logo'>
            <img src={main_logo} className='init-phone-logo'></img>
          </div>
        </div>
        <div className='init-signin-right'>
          <div className='init-signin-left-content'>
            <div className='init-signin-text2'>
              When you sign up as a Mentor, you are connected with real learners who you can guide through their senior secondary
              education. Sign up and take the first step towards making an invaluable contribution in someone’s life!
            </div>
            <button
              className='init-signin-button'
              onClick={() => {
                // mentor signin
                window.location = "/authentication:mentor";
              }}
            >
              SIGN IN AS A MENTOR
            </button>
          </div>
          <animated.div style={{ transform: props.xy.to(trans2) }}>
            <img src={right} width='90%'></img>
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default InitiateSignin;
