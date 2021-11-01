import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState } from "react";
import "./App.css";
import { auth } from "./firebaseConfig";

function App() {
  const [value, setvalue] = useState(0);
  const [otp, setotp] = useState(0);

  console.log(value);

  const clickHandler = () => {
    console.log("Clicked");

    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
          console.log("response");
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...
          alert("expired");
        },
      },
      auth
    );
    onSignInSubmit();
  };

  const onSignInSubmit = () => {
    console.log("Inside onSignInSubmit");
    const phoneNumber = value;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        console.log("Inside signInWithPhoneNumber");
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        alert(error);
      });
  };

  const otpVerification = () => {
    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        // ...
        alert("Success");
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        alert(error, "OTP failed");
      });
  };

  return (
    <div className="App">
      Hello Firebase ke chode
      <input
        type="tel"
        value={value}
        onChange={(e) => setvalue(e.target.value)}
      />
      <button id="sign-in-button" onClick={clickHandler}>
        Submit
      </button>
      <input
        type="number"
        value={otp}
        onChange={(e) => setotp(e.target.value)}
      />
      <button onClick={otpVerification}>Submit2</button>
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default App;
