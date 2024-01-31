// @ts-ignore

import React from "react";
import { Link } from "react-router-dom";
import { IoIosCloseCircle as CloseIcon } from "react-icons/io";
import { Nav, NavLogo, NavMenu, Bars, NavLink, NavBtn, NavBtnLink } from "./navbarElements";
import "./navbar.css";
import mainLogo from "../../assets/main-logo.svg";

// main page component
const AdminNavbar = (props) => {
  const [open, setOpen] = React.useState(false);

  // frontend component to display the navbar
  return (
    <div>
      <div
        style={
          open
            ? {
                height: "40vh",
                background: "#5d1049",
                display: "block",
                paddingTop: "5vh",
              }
            : { display: "none" }
        }
      >
        <div
          style={{
            border: "1px solid white",
            height: "5vh",
            width: "60vw",
            margin: "0 0 5vh 20vw",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            textAlign: "center",
          }}
          onClick={() => {
            // mobile view
            setOpen(false);
          }}
        >
          <div style={{ color: "white", marginLeft: "20vw" }}>CLOSE</div>
          <CloseIcon style={{ color: "white", fontSize: "3vh", marginLeft: "5vw" }} />
        </div>
        <Link className='nav-link-mobile' to='/admin-applications'>
          APPLICATIONS
        </Link>
        <Link className='nav-link-mobile' to='/admin-home'>
          ISSUES
        </Link>
        <button
          onClick={() => {
            // logout, update the localStorage
            localStorage.setItem("isloggedin", "false");
            localStorage.removeItem("basicAuth");
            window.location = "/";
          }}
          className='nav-logout-phone'
        >
          LOGOUT
        </button>
      </div>
      <Nav style={open ? { display: "none" } : {}}>
        <div
          onClick={() => {
            // mobile view
            setOpen(true);
          }}
        >
          <Bars />
        </div>
        <NavLogo to='#'>
          <img src={mainLogo} style={{ height: "80px" }} />
        </NavLogo>
        <NavMenu>
          <NavLink to='/admin-applications'>APPLICATIONS</NavLink>
          <NavLink to='/admin-home'>ISSUES</NavLink>
          <button
            onClick={() => {
              // logout
              localStorage.setItem("isloggedin", "false");
              // remove the basicAuth token 
              localStorage.removeItem("basicAuth");
              window.location = "/";
            }}
            className='nav-logout-pc'
          >
            LOGOUT
          </button>
        </NavMenu>
        {/* profile picture */}
        <img src='https://randomuser.me/api/portraits/thumb/men/40.jpg' className='img-fluid-nav rounded-circle' />
      </Nav>
    </div>
  );
};
export default AdminNavbar;
