import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Assets/css/adminBorrow.css"

const BorrowList = () => {
  const [data, setData] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartBooks, setCartBooks] = useState([]);


  const navigate = useNavigate();
  console.log(data);


  const fetchCartBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/allBooksInCart");
      console.log(response.data.books);

      if (Array.isArray(response.data.books)) {
        const sortedBooks = response.data.books.sort((a, b) =>
          a.username.localeCompare(b.username)
        );
        setCartBooks(sortedBooks);
      } else {
        setCartBooks([]);
      }
    } catch (err) {
      console.error("Error fetching cart books:", err);
      setCartBooks([]);
    }
  };



  const addToCart = async () => {
    //   const books = selectedBooks;
    //   const username = user.username;
    //   const send = { books: books, username: username };
    //   console.log(send);
    //   await axios
    //     .post(`http://localhost:5000/addToCart`, send, {})
    //     .then((response) => {
    //       console.log(response);
    //     });
    //   setTimeout(() => {
    //     window.location.href = "/cart";
    //   }, 500);
  };
  // console.log(selectedBooks);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/borrowedBooks");
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (Array.isArray(response.data.borrowedBooks)) {
        setData(response.data.borrowedBooks);
      } else {
        console.warn("Unexpected format:", response.data);
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching borrowed books:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
    fetchCartBooks();
  }, []);




  function formatDate(dateStr) {
    const currentDate = new Date();
    const date = new Date(dateStr);
    const options = { day: "numeric", month: "long", year: "numeric" };

    // Calculate the difference in days
    const timeDiff = Math.abs(currentDate.getTime() - date.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays > 8) {
      return `Due by ${diffDays} days`;
    } else {
      // Format and return the date
      const formattedDate = date.toLocaleDateString("en-US", options);
      return formattedDate;
    }
  }

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedBooks((prevSelectedBooks) => [...prevSelectedBooks, id]);
    } else {
      setSelectedBooks((prevSelectedBooks) =>
        prevSelectedBooks.filter((bookId) => bookId !== id)
      );
    }
    console.log(selectedBooks);
  };

  //variables
  const [currentPage, setCurrentPage] = useState(1);
  const recordPerPage = 10;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const record = data.slice(firstIndex, lastIndex);
  const npage = Math.ceil(data.length / recordPerPage);
  const number = [...Array(npage + 1).keys()].slice(1);

  const nextPage = () => {
    if (currentPage != npage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage != 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const proceedCheckout = async (username) => {
    const send = { username: username };
    try {
      const response = await axios.post(`http://localhost:5000/checkout`, send);
      console.log("Checkout response:", response);
      alert(`Checkout successful for ${username}`);
      // Optionally refresh the cart list
      window.location.reload();

    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed");
    }
  };

  const handleReturn = async (book) => {
    try {
      const payload = {
        uniqueId: book.uid,     // user ID from the book object
        isbn: [book.isbn],      // send as an array of ISBNs
      };

      const response = await axios.post('http://localhost:5000/return', payload);

      if (response.status === 200) {
        alert("Book returned successfully!");
        window.location.reload(); // or update state instead
      }
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return book.");
    }
  };

  const handleRemoveFromCart = async (username, isbn) => {
    try {
      const res = await axios.post("http://localhost:5000/removeFromCart", {
        username,
        isbn,
      });
      console.log("Removed:", res.data);
      // Refresh the cartBooks list
      fetchCartBooks(); // Your function to re-fetch the updated cart
    } catch (err) {
      console.error("Failed to remove book:", err);
    }
  };


  const seenUsernames = new Set();

  const isMobile = window.innerWidth <= 768;



  return (
    <div
      style={{
        display: "flex",
        boxShadow: "1px 1px 21px -3px rgba(0,0,0,10.75)",
        flexDirection: "column",
        justifyContent: "center",
        margin: "1rem",
        borderRadius: "1.5rem",
        padding: "0.5rem",
      }}
    >
      <div style={{ position: "relative", height: "3rem", marginBottom: "2rem" }}>
        <button
          onClick={() => {
            document.getElementById("checklist")?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{
            position: "absolute",
            bottom: 0,
            right: "3rem",
            backgroundColor: "transparent",
            border: "1px solid white",
            borderRadius: "1rem",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontSize: "1rem",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.color = "black";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "white";
          }}
          aria-label="Scroll to checklist"
        >
          <span>Checklist</span> <span style={{ fontSize: "1.3rem" }}>👇</span>
        </button>
      </div>





      {loading ? (
        <div className="loaders book">
          <figure className="page"></figure>
          <figure className="page"></figure>
          <figure className="page"></figure>
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", fontSize: "1.5rem", padding: "2rem" }}>
          📚 Nothing in Checklist
        </div>
      ) : (
        <div className="lists-responsive-container">



          <div className="admin-table-borrow">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Borrower</th>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Due/Borrowed Date</th>
                    {/* <th>Returned</th> */}
                  </tr>
                </thead>
                <tbody>
                  {record.map((d, i) => (
                    <tr key={d.isbn || i}>
                      <td>{(currentPage - 1) * 10 + i + 1}</td>
                      <td>{d.borrower}</td>
                      <td>{d.title}</td>
                      <td>{d.author}</td>
                      <td>{formatDate(d.takenDate)}</td>
                      {/*<td>
                      <input
                      type="checkbox"
                      onChange={(e) => handleCheckboxChange(e, d.isbn)}
                      checked={selectedBooks.includes(d.isbn)}
                      />
                      </td>*/}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <div
              style={{
                textAlign: "center",
                marginBlockStart: "2rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "left",
              }}
            >
              <div
                className="land-button lists-button"
                style={{ margin: "0 1rem", padding: "0", cursor: "pointer" }}
                onClick={prevPage}
              >
                <a
                  className="landing-button-hover"
                  style={{ width: "5rem", margin: "10px" }}
                >
                  <span>PREV</span>
                </a>
              </div>

              <div style={{ paddingBlockStart: "1rem" }}>{currentPage}</div>

              <div
                className="land-button"
                style={{ margin: "0 1rem", padding: "0", cursor: "pointer" }}
                onClick={nextPage}
              >
                <a
                  className="landing-button-hover"
                  style={{ width: "5rem", margin: "10px" }}
                >
                  <span>NEXT</span>
                </a>
              </div>
            </div>

            {/*<div style={{ marginLeft: "45rem" }}>
              <div className="land-button" style={{ cursor: "pointer" }} onClick={addToCart}>
                <a className="landing-button-hover" style={{ width: "12rem" }}>
                  <span>SAVE CHANGE</span>
                </a>
              </div>
              <div style={{ marginLeft: "8.4rem" }}>
                Save Returned Status of Borrower
              </div>
            </div>*/}
          </div>

          <div>
            <img
              className="vert-move"
              style={{ width: "70%", marginLeft: "30%" }}
              src="https://raw.githubusercontent.com/AnuragRoshan/images/71611a64e2b0acde9f0527b4f2341fabd7bf9555/undraw_process_re_gws7.svg"
              alt=""
            />
          </div>
        </div>
      )}

      <div id="checklist" className="admin-section-padding">

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            color: "white",
            marginBottom: "1rem",
            marginTop: "1rem",
          }}
        >
          🛒 Check List
        </h1>
        <div
          style={{
            backgroundColor: "#fff4e5",
            color: "#663c00",
            width: "50%",
            border: "1px solid #ffcc80",
            borderRadius: "0.75rem",
            padding: "1rem 1.5rem",
            marginTop: "1rem",
            marginLeft: "4rem",
            fontWeight: "500",
            textAlign: "left",
            fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            color: "red"
          }}
        >
          First REMOVE the books which cannot be checked out and then do the CHECKOUT for that user.
        </div>

        {cartBooks.length > 0 ? (
          <div
            style={{
              overflowX: "auto",
              borderRadius: "1rem",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              marginTop: "2rem",
              width: "90%",
            }}
          >
            <table
              className="table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "700px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#ee6c4d",
                  color: "white",
                }}
              >
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left", width: "5rem" }}>#</th>
                  <th style={{ padding: "1rem", textAlign: "left", width: "15rem" }}>User ID</th>
                  <th style={{ padding: "1rem", textAlign: "left", width: "15rem" }}>Genre</th>
                  <th style={{ padding: "1rem", textAlign: "left", width: "20rem" }}>Title</th>
                  <th style={{ padding: "1rem", textAlign: "left", width: "15rem" }}>Publisher</th>
                 {/* <th style={{ padding: "1rem", textAlign: "left", width: "10rem" }}>Item Count</th>*/}
                  <th style={{ padding: "1rem", textAlign: "left", width: "10rem" }}>Checkout</th>
                  <th style={{ padding: "1rem", textAlign: "left", width: "12rem" }}>Remove</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const seenUsernames = new Set();
                  return cartBooks.map((book, index) => {
                    const showCheckout = !seenUsernames.has(book.username);
                    seenUsernames.add(book.username);

                    return (
                      <tr
                        key={book._id || index}
                        style={{
                          backgroundColor: "white",
                          transition: "background 0.2s ease",
                          cursor: "default",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0efff")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                      >
                        <td style={{ padding: "1rem", color: "#333", fontSize: "0.95rem" }}>{index + 1}</td>
                        <td style={{ padding: "1rem", color: "#333" }}>{book.username}</td>
                        <td style={{ padding: "1rem", color: "#333" }}>{book.Genre}</td>
                        <td style={{ padding: "1rem", color: "#333" }}>{book.Title}</td>
                        <td style={{ padding: "1rem", color: "#333" }}>{book.Publisher}</td>
                       {/* <td style={{ padding: "1rem", color: "#333" }}>{book.ItemCount}</td> */}
                        <td style={{ padding: "1rem" }}>
                          {showCheckout && (
                            <button
                              style={{
                                padding: "0.4rem 1rem",
                                backgroundColor: "#3d5a80",
                                color: "white",
                                border: "none",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                              }}
                              onClick={() => proceedCheckout(book.username)}
                            >
                              Checkout
                            </button>
                          )}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <button
                            style={{
                              padding: "0.4rem 1rem",
                              backgroundColor: "#e63946",
                              color: "white",
                              border: "none",
                              borderRadius: "0.5rem",
                              cursor: "pointer",
                            }}
                            onClick={() => handleRemoveFromCart(book.username, book.ISBN)}
                          >
                            Remove from Cart
                          </button>
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No books in cart.</p>
        )}

      </div>




    </div>
  );

};

export default BorrowList;
