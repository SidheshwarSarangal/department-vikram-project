import React, { useState, useEffect } from "react";
import "../../Assets/css/profile.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = ({ user }) => {
  const dateStr = user.createdAt;
  const date = new Date(dateStr);
  const options = { day: "numeric", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1028);


  const [data, setData] = useState({
    name: user.name,
    username: user.username,
    phone: user.phone,
    address: user.address,
    uniqueId: user.uniqueId,
  });


  useEffect(() => {
    console.log("User data on refresh:", user);
  }, [user]);
  const handleInputs = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    // setData({ ...data, uniqueId: user.uniqueId });
  };


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 728);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const submitForm = async () => {
    // alert("Submitted")
    await axios
      .post(`http://localhost:5000/updateUser`, data)
      .then((response) => {
        var message = response.data.msg;
        var status = response.status;
        console.log(message);

        if (status === 200) {
          toast.success(`${message}`, {
            position: "top-center",
            autoClose: 2000,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: true,
            textAlign: "center",
          });
          setTimeout(() => {
            window.location.href = "/profile";
          }, 1500);
          // window.location.reload();
        } else if (status === 202) {
          toast.warn(`${message}`, {
            position: "top-center",
            autoClose: 2000,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: true,
            textAlign: "center",
          });
        }
      });
  };



  return (
    <div style={{ paddingBlockStart: "4rem" }}>
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        marginLeft: "1rem",
        marginRight: "1rem",
        cursor: "default"
      }}>
        <div style={{ flex: "1" }}>
          <div
            style={{
              margin: "1rem",
              borderRadius: "2rem",
              background: "linear-gradient(to bottom right,rgb(0, 91, 209),rgb(66, 66, 66))", // blue to gray
              padding: "1rem",
              boxShadow: "1px 1px 21px -3px rgba(0,0,0,0.75)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  width: "120px",  // Adjusted width
                  height: "120px", // Adjusted height
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden" // Prevents image overflow
                }}
              >
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    marginTop: "-1px",
                    borderRadius: "50%",        // makes it circular
                    border: "2px solid white",  // border styling
                    boxSizing: "border-box",    // ensures border doesn't overflow
                    objectFit: "cover"          // keeps the image inside the circle neatly
                  }}
                  src={`https://api.dicebear.com/9.x/initials/svg?seed=${data.name}`}
                  alt="Avatar"
                />


              </div>

            </div>

            <div
              style={{
                textAlign: "center",
                fontFamily: "poppins",
                marginBlockStart: "1rem",
                fontWeight: "600",
                fontSize: "1.5rem",
                color: "white",
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                textAlign: "center",
                fontFamily: "poppins",
                marginBlockStart: "0.5rem",
                fontWeight: "600",
                fontSize: "1rem",
                color: "white",
              }}
            >
              UID : <span>{user.uniqueId}</span>
            </div>
            <div
              style={{
                textAlign: "center",
                fontFamily: "poppins",
                marginBlockStart: "0.5rem",
                fontWeight: "600",
                fontSize: "1rem",
                color: "white",
              }}
            >
              Email : {user.username}
            </div>
            <div
              style={{
                textAlign: "center",
                fontFamily: "poppins",
                marginBlockStart: "0.5rem",
                fontWeight: "600",
                fontSize: "1rem",
                color: "white",
              }}
            >
              Phone : {user.phone}
            </div>
            <div
              style={{
                textAlign: "center",
                fontFamily: "poppins",
                marginBlockStart: "0.5rem",
                fontWeight: "600",
                fontSize: "1rem",
                color: "white",
              }}
            >
              Joined on{" "}
              <span style={{ color: "#a0a2a1" }}>{formattedDate}</span>
            </div>
            <div
              style={{
                textAlign: "center",
                fontFamily: "poppins",
                marginBlockStart: "0.5rem",
                fontWeight: "600",
                fontSize: "1rem",
                color: "white",
              }}
            >
              {user.borrowed.length} <a  href="/cart" style={{ color: "#2bea2b", textDecoration: "none" }}>Borrowed</a>
            </div>
            <div
              style={{
                textAlign: "center",
                fontFamily: "poppins",
                marginBlockStart: "0.5rem",
                fontWeight: "600",
                fontSize: "1rem",
                color: "white",
              }}
            >
              <span style={{ color: "yellow" }}> {user.cart.length} </span>{" "}
              items in{" "}
              <a
                style={{ color: "#539cda", textDecoration: "none" }}
                href="/cart"
              >
                cart
              </a>
            </div>
          </div>
        </div>
        <div style={{ flex: "3", display: "flex", flexDirection: "column" }}>
          <div>
            <div
              style={{
                margin: "1rem",
                background: "linear-gradient(to bottom right, #cfe6f9, #2b6cb0)", // light blue to dark blue
                borderRadius: "2rem",
                boxShadow: "1px 1px 21px -3px rgba(0,0,0,10.75)",
              }}
            >
              <div
                style={{
                  color: "#539cda",
                  margin: "0.5rem",
                  display: "flex",
                  padding: "1rem 0 0 1rem",
                  fontSize: "2rem",
                  fontWeight: "600",
                  fontFamily: "poppins",
                }}
              >
                Edit Your Profile
              </div>
              <div
                style={{
                  margin: "0.5rem",
                  display: "flex",
                  padding: "0.5rem",
                }}
              >
                <input
                  style={{ width: "60%" }}
                  type="text"
                  className="login-input"
                  name="name"
                  placeholder="Name"
                  defaultValue={user.name}
                  onChange={(e) => handleInputs(e)}
                />
              </div>
              {/* <div
                style={{
                  margin: "0.5rem",
                  display: "flex",
                  padding: "0.5rem",
                }}
              >
                {/*
                <input
                  style={{ width: "60%" }}
                  type="email"
                  className="login-input"
                  name="username"
                  placeholder="Email"
                  defaultValue={user.username}
                  onChange={(e) => handleInputs(e)}
                />
               }
              </div>
                */}
              <div
                style={{
                  margin: "0.5rem",
                  marginTop: "0",
                  display: "flex",
                  padding: "0.5rem",
                }}
              >
                <input
                  style={{ width: "60%" }}
                  type="number"
                  className="login-input"
                  name="phone"
                  defaultValue={user.phone}
                  placeholder="Phone"
                  onChange={(e) => handleInputs(e)}
                />
              </div>
              <div
                style={{
                  color: "#539cda",
                  margin: "0.5rem",
                  display: "flex",
                  padding: "0.5rem 0.5rem 2rem 0.5rem",
                }}
              >
                <input
                  style={{ width: "90%" }}
                  type="text"
                  className="login-input"
                  name="address"
                  placeholder="Address"
                  defaultValue={user.address}

                  onChange={(e) => handleInputs(e)}
                />
                <span onClick={submitForm} className="profile-button">
                  Update
                </span>
                <ToastContainer />
              </div>
            </div>
            <div>
              <div
                style={{
                  margin: "1rem",
                  background: "linear-gradient(to bottom right, #cfe6f9, #2b6cb0)", // light blue to dark blue
                  borderRadius: "2rem",
                  boxShadow: "1px 1px 21px -3px rgba(0,0,0,10.75)",
                }}
              >
                <div
                  style={{
                    color: "#539cda",
                    margin: "0.5rem",
                    display: "flex",
                    padding: "1rem 0 0 1rem",
                    fontSize: "2rem",
                    fontWeight: "600",
                    fontFamily: "poppins",
                  }}
                >
                  Any Query Or Feedbak ?
                </div>
                <div
                  style={{
                    margin: "0.5rem",
                    display: "flex",
                    padding: "0.5rem",
                  }}
                >
                  <textarea
                    style={{ width: "100%", fontFamily: "poppins" }}
                    type="text"
                    className="login-input"
                    name="query"
                    placeholder="Write Something ..."
                    defaultValue="I like to suggest You ....."
                    rows={6}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
