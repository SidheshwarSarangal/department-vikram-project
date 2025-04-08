import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../Assets/css/cart.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Cart = ({ user }) => {
  const [data, setData] = useState([null]);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const [borrowedBooks, setBorrowedBooks] = useState([]);


  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/booksInCart/${user.username}`
      );
      console.log("Cart response:", response.data);

      // ✅ Ensure data is always an array
      setData(response.data.books || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setData([]); // ✅ If there's an error, set an empty array
      setIsLoading(false);
    }
  };


  const fetchBorrowedBooks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/borrowedBooks`);
      console.log(response.data);
      console.log(user.uniqueId);
      const userBooks = response.data.filter((book) => {
        console.log("uid", book.uid);
        return book.uid === user.uniqueId;
      });

      setBorrowedBooks(userBooks);
      console.log("borrowedbooks", userBooks);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
      setBorrowedBooks([]);
    }
  };


  const proceedCheckout = async () => {
    const username = user.username;
    const send = { username: username };
    await axios
      .post(`http://localhost:5000/checkout`, send)
      .then((response) => {
        console.log(response);
      });
    setTimeout(() => {
      window.location.href = "/home";
    }, 500);
  };

  useEffect(() => {
    fetchData();
    fetchBorrowedBooks();

  }, []); // Empty dependency array ensures it runs only once when the component mounts.


  const handleReturn = async (book) => {
    try {
      const payload = {
        uniqueId: user.uniqueId,  // ✅ use uniqueId, not username
        isbn: book.isbn,
      };
      console.log("payload", payload);

      const response = await axios.post("http://localhost:5000/returnStatusBook", payload);

      if (response.status === 200) {
        console.log(response);
        toast.success("Book returned successfully!", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          textAlign: "center",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500); // wait 1.5 seconds before reloading
      }
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("Failed to return book.");
    }
  };

  const handleRemoveFromCart = async (isbn) => {
    try {
      const response = await axios.post("http://localhost:5000/removeFromCart", {
        username: user.username,
        isbn: isbn,
      });

      if (response.status === 200) {
        toast.success("Book removed from cart successfully.", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          textAlign: "center",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500); // wait 1.5 seconds before reloading
      }
    } catch (error) {
      console.error("Error removing book from cart:", error);
      toast.error("Failed to remove book.");
    }
  };





  if (data == null) {
    return <>NULL H RE BABA</>;
  } else
    return (
      <div style={{ paddingBlockStart: "4rem", cursor: "default" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: "5" }}>
            {isLoading ? ( // Render loading state when isLoading is true
              <div>
                <img
                  style={{
                    width: "10rem",
                    marginInlineStart: "10.5em",
                    marginBlockStart: "9rem",
                  }}
                  src="https://raw.githubusercontent.com/AnuragRoshan/images/2da16323d0b50258ee4a9f8ffe0ec96bf73ed0b9/undraw_happy_music_g6wc.svg"
                  alt=""
                  srcSet=""
                />
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "poppins",
                    fontSize: "2rem",
                  }}
                >
                  Cart is empty <br /> Add Some Books
                </div>
              </div>
            ) : data.length === 0 ? (
              <div>
                <img
                  style={{
                    width: "10rem",
                    marginInlineStart: "10.5em",
                    marginBlockStart: "9rem",
                  }}
                  src="https://raw.githubusercontent.com/AnuragRoshan/images/2da16323d0b50258ee4a9f8ffe0ec96bf73ed0b9/undraw_happy_music_g6wc.svg"
                  alt=""
                />
                <div
                  style={{
                    textAlign: "center",
                    fontFamily: "poppins",
                    fontSize: "2rem",
                  }}
                >
                  Cart is empty <br /> Add Some Books
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div style={{ padding: "2rem" }}>
                    <div style={{ display: "flex" }}>
                      <div style={{ fontFamily: "poppins", fontSize: "2rem", marginBottom: "1rem" }}>CART</div>
                    </div>

                    {data.map((book, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          border: "1px solid transparent",
                          backgroundColor: "black",
                          marginBottom: "1rem",
                          color: "white",
                          paddingRight: "1rem",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <div>
                            <img
                              src="https://miro.medium.com/v2/resize:fit:1200/1*d5VjR-g8k6hSXWA4n0czXQ.jpeg"
                              alt=""
                              style={{
                                width: "5rem",
                                height: "6rem",
                                marginTop: "0rem",
                                padding: "0.4rem 1rem",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontFamily: "poppins",
                              padding: "0.4rem 1rem",
                              fontSize: "0.9rem",
                            }}
                          >
                            <div>Title : {book.Title}</div>
                            <div>Author : {book.Author}</div>
                            <div>Publisher : {book.Publisher}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveFromCart(book.ISBN)}
                          style={{
                            padding: "1rem 1rem",
                            backgroundColor: "transparent",
                            color: "white",
                            border: "1px solid white",
                            borderRadius: "0.4rem",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "white";
                            e.target.style.color = "black";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.color = "white";
                          }}
                        >
                          Remove
                        </button>


                      </div>
                    ))}
                  </div>
                </div>

              </>
            )}
            <div style={{ padding: "2rem" }}>
              <div style={{ display: "flex" }}>
                <div style={{ fontFamily: "poppins", fontSize: "2rem", marginBottom: "1rem" }}>Borrowed Books</div>
              </div>

              {borrowedBooks.length === 0 ? (
                <div style={{ fontFamily: "poppins", fontSize: "1.2rem", color: "gray" }}>
                  No books borrowed
                </div>
              ) : (
                borrowedBooks.map((book, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      border: "1px solid transparent",
                      backgroundColor: "black",
                      marginBottom: "1rem",
                      color: "white",
                      paddingRight: "1rem",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <div>
                        <img
                          src="https://miro.medium.com/v2/resize:fit:1200/1*d5VjR-g8k6hSXWA4n0czXQ.jpeg"
                          alt=""
                          style={{
                            width: "5rem",
                            height: "6rem",
                            marginTop: "0.5rem",
                            marginBottom: "0.5rem",
                            padding: "0.4rem 1rem",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "poppins",
                          padding: "0.4rem 1rem",
                          fontSize: "0.9rem",
                          marginBottom: "0.5rem",
                          marginTop: "0.5rem",

                        }}
                      >
                        <div>Title : {book.title}</div>
                        <div>Author : {book.author}</div>
                        <div>Taken Date : {book.takenDate}</div>
                      </div>
                    </div>

                    {book.status === "returning" ? (
                      <div
                        style={{
                          padding: "1rem 1.4rem",
                          backgroundColor: "#ffe0b2",
                          color: "#333",
                          borderRadius: "0.4rem",
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          textAlign: "center",
                        }}
                      >
                        Returning
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReturn(book)}
                        style={{
                          padding: "1rem 1.4rem",
                          backgroundColor: "transparent",
                          color: "white",
                          border: "1px solid white",
                          borderRadius: "0.4rem",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "white";
                          e.target.style.color = "black";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent";
                          e.target.style.color = "white";
                        }}
                      >
                        Return
                      </button>
                    )}



                  </div>
                ))
              )}
            </div>



          </div>
          <div style={{ flex: "8", backgroundColor: "white" }}>
            <img
              style={{ height: "86vh" }}
              src="https://raw.githubusercontent.com/AnuragRoshan/images/8b58d063ae66f90faefec23c75fe787161fc66ca/undraw_empty_cart_co35.svg"
              alt=""
              srcSet=""
            />
          </div>
        </div>
      </div>
    );
};

export default Cart;
