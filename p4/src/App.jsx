import React, { useState } from "react";

function App() {
  // State for counter
  const [count, setCount] = useState(0);

  // State for first name and last name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div className="container"
      style={{
        alignItems: "center",
        textAlign: "center",
        border: "2px solid #000",
        padding: "20px",
        width: "400px",
        margin: "50px auto",
        borderRadius: "10px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Count: {count}</h1>
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setCount(0)}
          style={{ margin: "5px", padding: "5px 10px" }}
        >
          Reset
        </button>
        <button
          onClick={() => setCount(count + 1)}
          style={{ margin: "5px", padding: "5px 10px" }}
        >
          Increment
        </button>
        <button
          onClick={() => setCount(count - 1)}
          style={{ margin: "5px", padding: "5px 10px" }}
        >
          Decrement
        </button>
        <button
          onClick={() => setCount(count + 5)}
          style={{ margin: "5px", padding: "5px 10px" }}
        >
          Increment 5
        </button>
      </div>

      <h2>Welcome to CHARUSAT!!!</h2>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ margin: "10px 0" }}>
          <label>
            First Name:{" "}
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ padding: "5px" }}
            />
          </label>
        </div>
        <div style={{ margin: "10px 0" }}>
          <label>
            Last Name:{" "}
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ padding: "5px" }}
            />
          </label>
        </div>
      </div>

      <div>
        <p>First Name: {firstName}</p>
        <p>Last Name: {lastName}</p>
      </div>
    </div>
  );
}

export default App;
