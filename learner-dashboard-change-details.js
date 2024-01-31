//@ts-check

import React, { useEffect, useState } from "react";
import Button from "../Common/button";
import axios from "axios";

function validate() {
  "use strict";

  let forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
}

// TODO: Replace the hardcoded colors
const LearnerDashboardChangeDetails = ({ details }) => {
  const [state, setState] = useState(details);
  const [profilePic, setProfilePic] = useState(state.profile_picture_url);

  useEffect(() => {
    console.log("state : ", state);
    setState(details);
    setProfilePic(details.profile_picture_url);
  }, [details]);

  const handleChange = (e) => {
    const name = e.target.id;
    const value = e.target.value;
    setState({ ...state, [name]: value });
  };

  const handleClick = async () => {
    if (state.name === "") {
      alert("Please enter a name");
      return;
    }
    validate();
    // update DB
    await axios
      .post(`/api/learner/update/id/${details._id}`, state, {
        headers: { Authorization: `Bearer ${details.curuser}` },
      })
      .catch((e) => console.log(e));

    alert("Changes saved");
  };

  return (
    <div className='learner-dashboard-change-details'>
      <div className='card px-4 py-5 mt-3 mx-md-0 mx-auto' style={{ borderRadius: "20px", borderColor: "#FF0000" }}>
        <div className='d-flex justify-content-center'>
          <div className='rounded-circle mb-3'>
            <img className='img-fluid rounded-circle' style={{ width: "70px", height: "70px" }} src={profilePic} />
          </div>
        </div>

        <label
          for='pic'
          className='d-flex justify-content-center mb-3'
          style={{
            color: "#FF0000",
            border: "1px solid #FF0000",
            cursor: "pointer",
          }}
        >
          Change picture
        </label>
        <input
          style={{ visibility: "hidden" }}
          type='file'
          id='pic'
          name='img'
          accept='image/*'
          onChange={(e) => {
            let reader = new FileReader();
            reader.onload = function (ev) {
              setProfilePic(ev.target.result);
              setState({ ...state, ["profile_picture_url"]: ev.target.result });
            };
            reader.readAsDataURL(e.target.files[0]);
          }}
        />

        <form className='needs-validation' noValidate>
          <label htmlFor='name' className='form-label'>
            <strong>Name</strong>
          </label>
          <div class='input-group mb-3'>
            <input
              id='name'
              type='text'
              class='form-control'
              value={state.name}
              onChange={handleChange}
              placeholder='First Last'
              required
            />
            <div className='valid-feedback'>Looks good!</div>
            <div className='invalid-feedback'>Please enter your name</div>
          </div>

          <label htmlFor='phone' className='form-label'>
            <strong>Phone</strong>
          </label>
          <div class='input-group mb-3'>
            <input id='phone' type='text' class='form-control' value={state.phone} placeholder='9876543210' required readOnly />
            <div className='valid-feedback'>Looks good!</div>
            <div className='invalid-feedback'>Please enter your phone number</div>
          </div>

          <label htmlFor='email' className='form-label'>
            <strong>Email</strong>
          </label>
          <div class='input-group mb-3'>
            <input
              id='email'
              type='email'
              class='form-control'
              value={state.email}
              onChange={handleChange}
              placeholder='someone@example.com'
            />
          </div>

          <div className='d-flex justify-content-center'>
            <Button click={handleClick} text='SAVE' />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LearnerDashboardChangeDetails;
