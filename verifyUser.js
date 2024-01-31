//@ts-check

import firebase from "./firebase";

// common module to reroute if a different user is logged in
export const verify = async (setCuruser, setPhone) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setPhone(user.phoneNumber);
      user.getIdToken(true).then((idToken) => {
        setCuruser(idToken);
      });
    } else {
      setCuruser("No user found");
      window.location = "/init-signin";
    }
  });
};
