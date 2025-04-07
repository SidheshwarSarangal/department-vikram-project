import { useState } from "react";
import "../Assets/css/login.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate, useNavigate } from "react-router-dom";
import img2 from "../../../src/pages/Assets/logins.jpg";
import img from "./department.webp";

const Signin = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const handleInputs = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    console.log(user);
  };
  const submitForm = async () => {
    console.log(user);

    try {
      const response = await axios.post(`http://localhost:5000/login`, user, {
        withCredentials: true,
      });

      console.log(response);

      const message = response.data.message;
      const status = response.data.status;

      if (status === "200") {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          textAlign: "center",
        });
        window.location.href = "/profile";
      } else if (status === "202") {
        toast.warn(message, {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          textAlign: "center",
          theme: "dark",
        });
      } else if (status === "500") {
        toast.error(message, {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          textAlign: "center",
          theme: "dark",
        });
      }
      // You can choose to navigate here if needed.
    } catch (error) {
      console.error("An error occurred:", error);

      // Handle network errors gracefully
      if (error.message === "Network Error") {
        toast.error("Network error. Please check your internet connection.", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          textAlign: "center",
          theme: "dark",
        });
      }
    }
    // Optionally, show an alert message or perform other actions.
  };

  return (
    

    <div className="login-top">
      <div className="login-inner-top-left">
        <div className="login-title">Biotech Library</div>
        <div className="login-title-below">Loginn To Your Account</div>
        <div className="login-signup-call">
          Dont Have Account ? <a href="/signup">SignUp</a>
        </div>
        <div className="login-form">
          <div className="login-field">
            <input
              type="text"
              name="username"
              className="login-input"
              placeholder="Email"
              onChange={(e) => handleInputs(e)}
            />
          </div>
          <div className="login-field ">
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              name="password"
              onChange={(e) => handleInputs(e)}
            />
          </div>
          <div className="land-button">
            <div
              className="landing-button-hover"
              style={{ marginBlockStart: "1rem", cursor: "pointer" }}
              onClick={() => submitForm()}
            >
              <span>SignIn</span>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>
      <div className="login-inner-top-right" >
        <div>
          <img className="login-img" src={img} alt="" srcSet="" />
        </div>
      </div>
    </div>
  );
};

export default Signin;
