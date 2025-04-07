import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Assets/css/table.css"
import "../../Assets/css/lists.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Lists = ({ user }) => {
  const [data, setData] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const navigate = useNavigate();

  const [filter, setfilter] = useState({
    search: "-",
  });

  const handleInputs = (e) => {
    setfilter({ ...filter, [e.target.name]: e.target.value });
    console.log(filter);
  };



  const addToCartCaller = async (send) => {
    try {
      const response = await axios.post("http://localhost:5000/addToCart", send);
      console.log("Response from server:", response.data);
      return { result: true, message: "added to cart" };
    } catch (error) {
      const errorMsg =
        error.response?.data?.msg || "Request failed to add to cart";
      console.error("Error response:", errorMsg);
      return { result: false, message: errorMsg };
    }
  };



  const addToCart = async () => {
    const books = selectedBooks;
    const username = user.username;
    const send = { books, username };
    const { result, message } = await addToCartCaller(send);

    if (result) {
      toast.success("Books added to cart successfully!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        style: { textAlign: "center" },
      });

      setTimeout(() => {
        window.location.href = "/Cart";
      }, 2000);
    } else {
      toast.error(message || "Failed to add books to cart", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        style: { textAlign: "center" },
      });
    }
  };

  const fetchData = async () => {
    let search = filter.search;
    if (search.length === 0) {
      search = "-";
    }

    try {
      let response = await axios.get(`http://localhost:5000/search/${search}`);

      // If response has no books, fetch all books
      if (!response.data.books || response.data.books.length === 0) {
        response = await axios.get(`http://localhost:5000/allBook`);
      }

      // If still no books, set data to an empty array to prevent infinite loading
      setData(response.data.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setData([]); // Ensure data does not remain undefined
    }
  };




  useEffect(() => {
    let delayTimer;
    const handleFilterChange = () => {
      clearTimeout(delayTimer);
      delayTimer = setTimeout(fetchData, 1500);
    };

    handleFilterChange();

    return () => {
      clearTimeout(delayTimer);
    };
  }, [filter]);

  const handleBookClick = (id) => {
    navigate(`/book/${id}`);
  };

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

  return (
    <div
      style={{
        display: "flex",
        // border: "1px solid grey",
        boxShadow: "1px 1px 21px -3px rgba(0,0,0,10.75)",
        flexDirection: "column",
        justifyContent: "center",
        margin: "1rem",
        borderRadius: "1.5rem",
        padding: "0.5rem",
        cursor: "default"
      }}
    >
      {data.length > 0 ? (
        <div className="lists-responsive-container">


          <div className="lists-left">
            <div className="login-field ">
              <input
                type="text"
                className="login-input"
                placeholder="Search Books"
                name="search"
                style={{ width: "40%", marginInlineStart: "5rem" }}
                onChange={(e) => handleInputs(e)}
              />
            </div>
            <div
              style={{
                justifyContent: "center",
                paddingInlineStart: "5rem",
                width: "100%",
              }}
            >
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: "5rem" }}>#</th>
                      <th style={{ width: "15rem" }}>Name</th>
                      <th style={{ width: "15rem" }}>Publisher</th>
                      <th style={{ width: "15rem" }}>Genre</th>
                      <th style={{ width: "15rem" }}>Copies Available</th>
                      <th style={{ width: "10rem" }}>Add To Cart</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.map((d, i) => (
                      <tr key={d.ISBN || `book-${i}`}>
                        <td>{(currentPage - 1) * 10 + i + 1}</td>
                        <td
                          className="clickable"
                          onClick={() => handleBookClick(d.Title)}
                        >
                          {d.Title || "N/A"}
                        </td>
                        <td>{d.Author || "Unknown Author"}</td>
                        <td>{d.Genre || "Uncategorized"}</td>
                        <td>{d.ItemCount || "0"}</td>
                        <td>
                          <input
                            type="checkbox"
                            onChange={(e) => handleCheckboxChange(e, d.ISBN)}
                            checked={selectedBooks.includes(d.ISBN)}
                            disabled={!d.ISBN}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
            <div
              style={{
                textAlign: "left",
                marginBlockStart: "2rem",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                marginLeft: "5rem"
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
            <div
              style={{
                marginLeft: "-1.6rem",
                // marginBlockEnd: "2rem",
              }}
            >
              <div
                className="land-button"
                style={{ cursor: "pointer" }}
                onClick={addToCart}
              >
                <a
                  className="landing-button-hover"
                  style={{
                    width: "22rem",
                  }}
                >
                  <span>PROCCED TO CHECKOUT</span>
                </a>
              </div>
              <div style={{ marginLeft: "8rem", marginTop: "1rem" }}>
                Save Selected Item To Cart And Proceed To Checkout
              </div>
            </div>

          </div>
          <div className="lists-right">
            <img
              className="vert-move"
              style={{
                width: "40%",
                marginLeft: "30%",
                // marginRight: "50%",
                // height: "30%",
              }}
              src="https://raw.githubusercontent.com/AnuragRoshan/images/e8666db54a2712302f33449ec4ab8454ec7e1400/undraw_selection_re_ycpo.svg"
              alt=""
              srcSet=""
            />
          </div>
        </div>
      ) : (
        <div className="loaders book">

          <figure className="page"></figure>
          <figure className="page"></figure>
          <figure className="page"></figure>
        </div>
      )}
    </div>
  );
};
export default Lists;
