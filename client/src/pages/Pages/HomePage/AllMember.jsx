import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllMember = ({ user }) => {
  const [userList, setUserList] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [bookList, setBookList] = useState([]);
  const [queryOptions, setQueryOptions] = useState({ keyword: "-" });
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const routeTo = useNavigate();

  const retrieveUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/allUser");
      const sortedUsers = res.data.sort((a, b) =>
        a.username.localeCompare(b.username)
      );
      setUserList(sortedUsers);
      setVisibleUsers(sortedUsers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    retrieveUsers();
  }, []);

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchTerm(text);
    const filtered = userList.filter(
      (u) =>
        u.username.toLowerCase().includes(text) ||
        (u.name && u.name.toLowerCase().includes(text))
    );
    setVisibleUsers(filtered);
    setCurrentPage(1);
  };

  const handleBookClick = (uid) => {
    routeTo(`/edit/${uid}`);
  };

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const displayedUsers = visibleUsers.slice(startIndex, endIndex);

  const retrieveBooks = async () => {
    let keyword = queryOptions.keyword;
    if (keyword === "") keyword = "-";
    try {
      let res = await axios.get(`http://localhost:5000/search/${keyword}`);
      if (!res.data.books || res.data.books.length === 0) {
        res = await axios.get(`http://localhost:5000/allBook`);
      }
      setBookList(res.data.books || []);
    } catch (err) {
      console.log(err);
      setBookList([]);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      retrieveBooks();
    }, 1500);
    return () => clearTimeout(timeout);
  }, [queryOptions]);

  const updateQueryOptions = (e) => {
    setQueryOptions({ ...queryOptions, [e.target.name]: e.target.value });
  };

  const viewBookDetails = (bookId) => {
    routeTo(`/book/${bookId}`);
  };

  const start = (activePage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pagedBooks = bookList.slice(start, end);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "1.5rem auto",
        borderRadius: "1.5rem",
        padding: "1rem",
        boxShadow: "1px 1px 21px -3px rgba(0,0,0,0.2)",
        width: "95%",
        maxWidth: "1200px",
      }}
    >
      <input
        type="text"
        placeholder="Search by name or username"
        value={searchTerm}
        onChange={handleSearch}
        style={{
          width: "50%",
          padding: "12px 16px",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      />

      {/* User Table */}
      <div style={{ width: "100%", padding: "1rem" }}>
        <table
          className="table"
          style={{
            borderRadius: "1.5rem",
            overflow: "hidden",
            borderCollapse: "separate",
            borderSpacing: 0,
            width: "100%",
          }}
        >
          <thead style={{ backgroundColor: "#3d5a80", color: "white" }}>
            <tr>
              <th style={{ width: "5rem", textAlign: "left" }}>#</th>
              <th style={{ width: "15rem", textAlign: "left" }}>Username</th>
              <th style={{ width: "15rem", textAlign: "left" }}>Name</th>
              <th style={{ width: "15rem", textAlign: "left" }}>UID</th>
              <th style={{ width: "15rem", textAlign: "left" }}>Phone</th>
              <th style={{ width: "15rem", textAlign: "left" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((d, i) => (
              <tr key={d.uniqueId}>
                <td>{startIndex + i + 1}</td>
                <td style={{ padding: "0.5rem" }}>{d.username}</td>
                <td
                  style={{ cursor: "pointer", padding: "0.5rem" }}
                  onClick={() => handleBookClick(d.uniqueId)}
                >
                  {d.name}
                </td>
                <td style={{ padding: "0.5rem" }}>{d.uniqueId}</td>
                <td style={{ padding: "0.5rem" }}>{d.phone}</td>
                <td style={{ padding: "0.5rem" }}>
                  {d.borrowed?.length > 0 ? "Borrowed" : "Not Borrowed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        <div
          className="land-button lists-button"
          style={{ cursor: "pointer" }}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <a className="landing-button-hover" style={{ padding: "10px 20px" }}>
            <span>PREV</span>
          </a>
        </div>

        <div style={{ fontSize: "1.1rem",  marginInline:"-7rem", marginTop:"1.5rem" }}>{currentPage}</div>

        <div
          className="land-button"
          style={{ cursor: "pointer" }}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <a className="landing-button-hover" style={{ padding: "10px 20px" }}>
            <span>NEXT</span>
          </a>
        </div>
      </div>

      {/* Book Search */}
      <div
        style={{
          margin: "2rem 0",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          name="keyword"
          className="login-input"
          placeholder="Search Books"
          onChange={updateQueryOptions}
          style={{
            width: "50%",
            padding: "12px 16px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            outline: "none",
          }}
        />
      </div>

      {/* Book Table */}
      <div style={{ width: "100%", padding: "1rem" }}>
        <table
          className="table"
          style={{
            borderRadius: "1.5rem",
            overflow: "hidden",
            borderCollapse: "separate",
            borderSpacing: 0,
            width: "100%",
          }}
        >
          <thead style={{ backgroundColor: "#3d5a80", color: "white" }}>
            <tr>
              <th style={{ width: "5rem", textAlign: "left" }}>#</th>
              <th style={{ width: "20rem", textAlign: "left" }}>Title</th>
              <th style={{ width: "20rem", textAlign: "left" }}>Publisher</th>
              <th style={{ width: "15rem", textAlign: "left" }}>Genre</th>
              <th style={{ width: "10rem", textAlign: "left" }}>
                Copies Available
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedBooks.map((book, index) => (
              <tr key={book.ISBN || index}>
                <td>{start + index + 1}</td>
                <td
                  className="clickable"
                  onClick={() => viewBookDetails(book.Title)}
                  style={{ padding: "0.5rem", cursor: "pointer" }}
                >
                  {book.Title}
                </td>
                <td style={{ padding: "0.5rem" }}>{book.Author}</td>
                <td style={{ padding: "0.5rem" }}>{book.Genre}</td>
                <td style={{ padding: "0.5rem" }}>{book.ItemCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Book Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1.5rem",
          margin: "2rem 0",
        }}
      >
        <div
          className="land-button lists-button"
          style={{ cursor: "pointer" }}
          onClick={() => setActivePage((p) => p - 1)}
        >
          <a className="landing-button-hover" style={{ padding: "10px 10px" }}>
            <span>PREV</span>
          </a>
        </div>

        <div style={{ fontSize: "1.1rem" , marginInline:"-7rem", marginTop:"1.5rem"}}>{activePage}</div>

        <div
          className="land-button"
          style={{ cursor: "pointer" }}
          onClick={() => setActivePage((p) => p + 1)}
        >
          <a className="landing-button-hover" style={{ padding: "10px 10px" }}>
            <span>NEXT</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AllMember;
