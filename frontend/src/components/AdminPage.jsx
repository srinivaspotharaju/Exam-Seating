import React, { useState } from "react";
import axios from "axios";
import "./AdminPage.css";


const AdminPage = () => {
  const [roomCapacity, setRoomCapacity] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [branchData, setBranchData] = useState({});

  const branchOptions = ["CSE", "EEE", "IT", "Mechanical", "Civil"];

  // Handle branch selection
  const handleBranchChange = (event) => {
    const branch = event.target.value;
    if (!selectedBranches.includes(branch)) {
      setSelectedBranches([...selectedBranches, branch]);
      setBranchData({ ...branchData, [branch]: { startRoll: "", endRoll: "" } });
    }
  };

  // Handle roll number change for each branch
  const handleRollNumberChange = (branch, field, value) => {
    setBranchData({
      ...branchData,
      [branch]: { ...branchData[branch], [field]: value },
    });
  };

  // Submit data to MongoDB
  const handleSubmit = async () => {
    const data = {
      roomCapacity,
      selectedRoom,
      branchData,
    };

    try {
      await axios.post("http://localhost:5000/api/save-seating-data", data);
      alert("Data submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Generate seating arrangement using Graph Coloring Algorithm
  const handleGenerate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/generate-seating", {
        room: roomCapacity,
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

      {/* Room Capacity Selection */}
      <label>Room Capacity:</label>
      <input
        type="number"
        value={roomCapacity}
        onChange={(e) => setRoomCapacity(e.target.value)}
        placeholder="Enter room capacity"
      />

      {/* Room Selection */}
      <label>Select Room:</label>
      <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
        <option value="">Select Room</option>
        <option value="Room 101">Room 101</option>
        <option value="Room 102">Room 102</option>
        <option value="Room 103">Room 103</option>
      </select>

      {/* Branch Selection */}
      <label>Select Branches:</label>
      <select onChange={handleBranchChange}>
        <option value="">Select Branch</option>
        {branchOptions.map((branch, index) => (
          <option key={index} value={branch}>
            {branch}
          </option>
        ))}
      </select>

      {/* Roll Number Inputs */}
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

      {/* Submit & Generate Buttons */}
      <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      <button className="generate-btn" onClick={handleGenerate}>Generate</button>
    </div>
  );
};

export default AdminPage;
