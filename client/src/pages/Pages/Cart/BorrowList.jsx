import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        setCartBooks(response.data.books);
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


      <div style={{ marginBottom: "2rem", paddingInlineStart: "5rem" }}>
        <h3>🛒 Check List</h3>

        {cartBooks.length > 0 ? (
          <table className="table">
            <thead style={{ backgroundColor: "#ee6c4d", color: "white" }}>
              <tr>
                <th style={{ width: "5rem", textAlign: "left" }}>#</th>
                <th style={{ width: "15rem", textAlign: "left" }}>User ID</th>
                <th style={{ width: "15rem", textAlign: "left" }}>Genre</th>
                <th style={{ width: "20rem", textAlign: "left" }}>Title</th>
                <th style={{ width: "15rem", textAlign: "left" }}>Publisher</th>
                <th style={{ width: "10rem", textAlign: "left" }}>Item Count</th>
                <th style={{ width: "10rem", textAlign: "left" }}>Checkout</th>
                <th style={{ width: "12rem", textAlign: "left" }}>Remove</th>
              </tr>
            </thead>
            <tbody>
              {[...new Set()].forEach}; {/* Ensure seenUsernames is declared before */}
              {(() => {
                const seenUsernames = new Set();
                return cartBooks.map((book, index) => {
                  const showCheckout = !seenUsernames.has(book.username);
                  seenUsernames.add(book.username);

                  return (
                    <tr key={book._id || index}>
                      <td>{index + 1}</td>
                      <td>{book.username}</td>
                      <td>{book.Genre}</td>
                      <td>{book.Title}</td>
                      <td>{book.Publisher}</td>
                      <td>{book.ItemCount}</td>
                      <td>
                        {showCheckout && (
                          <button
                            className="land-button"
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
                      <td>
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
        ) : (
          <div style={{ textAlign: "center", fontSize: "1.2rem", padding: "1rem" }}>
            📭 No books to check out
          </div>
        )}
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
        <>
          <div>
            <img
              className="vert-move"
              style={{ width: "40%", marginLeft: "30%" }}
              src="https://raw.githubusercontent.com/AnuragRoshan/images/71611a64e2b0acde9f0527b4f2341fabd7bf9555/undraw_process_re_gws7.svg"
              alt=""
            />
          </div>

          <div style={{ justifyContent: "center", paddingInlineStart: "5rem" }}>
            <table className="table">
              <thead style={{ backgroundColor: "#3d5a80", color: "white" }}>
                <tr>
                  <th style={{ width: "5rem", textAlign: "left" }}>#</th>
                  <th style={{ width: "15rem", textAlign: "left" }}>Borrower</th>
                  <th style={{ width: "15rem", textAlign: "left" }}>Book Name</th>
                  <th style={{ width: "15rem", textAlign: "left" }}>Author</th>
                  <th style={{ width: "15rem", textAlign: "left" }}>
                    Due/Borrowed Date
                  </th>
                  <th style={{ width: "15rem", textAlign: "left" }}>Returned</th>
                </tr>
              </thead>
              <tbody>
                {record.map((d, i) => (
                  <tr key={d.isbn || i}>
                    <td>{(currentPage - 1) * 10 + i + 1}</td>
                    <td style={{ padding: "0.5rem" }}>{d.borrower}</td>
                    <td style={{ padding: "0.5rem" }}>{d.title}</td>
                    <td style={{ padding: "0.5rem" }}>{d.author}</td>
                    <td style={{ padding: "0.5rem" }}>{formatDate(d.takenDate)}</td>
                    <td style={{ padding: "0.5rem" }}>
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckboxChange(e, d.isbn)}
                        checked={selectedBooks.includes(d.isbn)}
                      />
                    </td>
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
              justifyContent: "center",
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

          <div style={{ marginLeft: "45rem" }}>
            <div className="land-button" style={{ cursor: "pointer" }} onClick={addToCart}>
              <a className="landing-button-hover" style={{ width: "12rem" }}>
                <span>SAVE CHANGE</span>
              </a>
            </div>
            <div style={{ marginLeft: "8.4rem" }}>
              Save Returned Status of Borrower
            </div>
          </div>
        </>
      )}
    </div>
  );

};

export default BorrowList;
