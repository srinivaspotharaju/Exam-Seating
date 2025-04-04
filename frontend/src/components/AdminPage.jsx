import React, { useState } from "react";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = () => {
  const [roomCapacity, setRoomCapacity] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [branchData, setBranchData] = useState({});

  const branchOptions = ["CSE", "EEE", "IT", "Mechanical", "Civil"];

  const handleBranchChange = (event) => {
    const branch = event.target.value;
    if (branch && !selectedBranches.includes(branch)) {
      setSelectedBranches([...selectedBranches, branch]);
      setBranchData({ ...branchData, [branch]: { startRoll: "", endRoll: "" } });
    }
  };

  const handleRollNumberChange = (branch, field, value) => {
    setBranchData({
      ...branchData,
      [branch]: { ...branchData[branch], [field]: value },
    });
  };

  const validateForm = () => {
    if (!roomCapacity || !selectedRoom || selectedBranches.length === 0) {
      alert("Please fill all required fields.");
      return false;
    }
    for (const branch of selectedBranches) {
      const { startRoll, endRoll } = branchData[branch] || {};
      if (!startRoll || !endRoll) {
        alert(`Please enter start and end roll numbers for ${branch}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      roomCapacity,
      selectedRoom,
      branchData,
    };

    try {
      await axios.post("http://localhost:5000/api/save-seating-data", data);
      alert("Data submitted successfully!");
      // Clear form
      setRoomCapacity("");
      setSelectedRoom("");
      setSelectedBranches([]);
      setBranchData({});
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/generate-seating", {
         room_capacity: roomCapacity,
        branches:selectedRoom,
        roll_numbers:branchData,
      });
      alert("Seating arrangement generated successfully!");
      console.log("Seating Arrangement:", response.data);
    } catch (error) {
      console.error("Error generating seating arrangement:", error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin - Seating Arrangement</h2>

      <label>Room Capacity:</label>
      <input
        type="number"
        value={roomCapacity}
        onChange={(e) => setRoomCapacity(e.target.value)}
        placeholder="Enter room capacity"
      />

      <label>Select Room:</label>
      <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
        <option value="">Select Room</option>
        <option value="Room 101">Room 101</option>
        <option value="Room 102">Room 102</option>
        <option value="Room 103">Room 103</option>
      </select>

      <label>Select Branches:</label>
      <select onChange={handleBranchChange}>
        <option value="">Select Branch</option>
        {branchOptions
          .filter((branch) => !selectedBranches.includes(branch))
          .map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
      </select>

      {selectedBranches.map((branch) => (
        <div key={branch} className="branch-inputs">
          <h4>{branch}</h4>
          <input
            type="text"
            placeholder="Start Roll No"
            value={branchData[branch]?.startRoll || ""}
            onChange={(e) => handleRollNumberChange(branch, "startRoll", e.target.value)}
          />
          <input
            type="text"
            placeholder="End Roll No"
            value={branchData[branch]?.endRoll || ""}
            onChange={(e) => handleRollNumberChange(branch, "endRoll", e.target.value)}
          />
        </div>
      ))}

      <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      <button className="generate-btn" onClick={handleGenerate}>Generate</button>
    </div>
  );
};

export default AdminPage;
