import React from "react";
import "../../Assets/css/DummyData.css"; // include the CSS file below

const stats = [
  {
    title: "42",
    label: "Borrowed",
    img: "https://raw.githubusercontent.com/AnuragRoshan/images/8d4745ca737a0e4a2307509f7d5ebbb994cf7158/undraw_sharing_knowledge_03vp.svg",
  },
  {
    title: "16",
    label: "Overdues",
    img: "https://raw.githubusercontent.com/AnuragRoshan/images/8d4745ca737a0e4a2307509f7d5ebbb994cf7158/undraw_receipt_re_fre3.svg",
  },
  {
    title: "148",
    label: "New Members",
    img: "https://raw.githubusercontent.com/AnuragRoshan/images/8d4745ca737a0e4a2307509f7d5ebbb994cf7158/undraw_new_entries_re_cffr.svg",
  },
  {
    title: "542",
    label: "Visitors",
    img: "https://raw.githubusercontent.com/AnuragRoshan/images/8d4745ca737a0e4a2307509f7d5ebbb994cf7158/undraw_real_time_analytics_re_yliv.svg",
  },
];

const DummyData = () => {
  return (
    <div className="dummy-container">
      {stats.map((item, index) => (
        <div
          key={index}
          className={`card-box ${index >= 2 ? "small-card" : ""}`}
        >
          <img src={item.img} alt={item.label} className="card-img" />
          <div className="card-title">{item.title}</div>
          <div className="card-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DummyData;
