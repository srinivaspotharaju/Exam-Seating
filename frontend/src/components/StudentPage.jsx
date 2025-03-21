import React, { useState } from 'react';
import './StudentPage.css';

function StudentPage() {
  const [rollNumber, setRollNumber] = useState('');
  const [seatInfo, setSeatInfo] = useState(null);

  const handleSearch = () => {
    // Mock API response (Replace this with actual API call)
    setSeatInfo({
      roomNumber: "A-101",
      examName: "Mathematics",
      examDate: "Feb 25, 2025",
    });
  };

  return (
    <div className="student-container">
      <h2>Student Seat Lookup</h2>
      <p>Enter your roll number to find your seat.</p>
      <input
        type="text"
        placeholder="Enter Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        className="input-field"
      />
      <button onClick={handleSearch} className="search-button">
        Find Room
      </button>

      {seatInfo && (
        <div className="result-card">
          <h3>Seat Details</h3>
          <p><strong>Room Number:</strong> {seatInfo.roomNumber}</p>
          <p><strong>Exam Name:</strong> {seatInfo.examName}</p>
          <p><strong>Exam Date:</strong> {seatInfo.examDate}</p>
        </div>
      )}
    </div>
  );
}

export default StudentPage;
