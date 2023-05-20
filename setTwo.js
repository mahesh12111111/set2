import React, { useState, useEffect } from 'react';

const SeatSelection = () => {
  const [numRows, setNumRows] = useState(3);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const fetchSeats = async () => {
    try {
      const response = await fetch(`https://codebuddy.review/seats?count=${numRows}`);
      const data = await response.json();
      setSeats(data);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [numRows]);

  const handleNumRowsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (count >= 3 && count <= 10) {
      setNumRows(count);
    }
  };

  const toggleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter((selectedSeat) => selectedSeat !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://codebuddy.review/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedSeats),
      });
      const data = await response.json();
      console.log('Submit response:', data);
    } catch (error) {
      console.error('Error submitting seats:', error);
    }
  };

  const calculateTotalCost = () => {
    let cost = 0;
    selectedSeats.forEach((seatId) => {
      const seat = seats.find((seat) => seat.id === seatId);
      cost += seat.rowNumber * 10;
    });
    cost += 20; // Base ticket cost
    setTotalCost(cost);
  };

  useEffect(() => {
    calculateTotalCost();
  }, [selectedSeats]);

  const renderSeats = () => {
    if (seats.length === 0) {
      return <p>Loading seats...</p>;
    }

    return seats.map((seat) => (
      <button
        key={seat.id}
        disabled={seat.reserved}
        className={`seat ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
        onClick={() => toggleSeatSelection(seat)}
      >
        <span className="seat-number">{seat.seatNumber}</span>
        <span className="seat-status">{seat.reserved ? 'Reserved' : 'Available'}</span>
        <span className="seat-row">{seat.rowNumber}</span>
      </button>
    ));
  };

  return (
    <div>
      <h2>Seat Selection</h2>
      <div>
        <label>Number of Rows:</label>
        <input
          type="number"
          min={3}
          max={10}
          value={numRows}
          onChange={handleNumRowsChange}
        />
        <button onClick={fetchSeats}>Fetch Seats</button>
      </div>
      <div className="seat-container">{renderSeats()}</div>
      <div>
        <p>Total Cost: ${totalCost}</p>
        <button
          disabled={selectedSeats.length === 0 || selectedSeats.length > 5}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SeatSelection;
