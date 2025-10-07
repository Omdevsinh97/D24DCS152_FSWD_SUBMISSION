import React, { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    if (value === "=") {
      try {
        // Evaluate the expression
        const evalResult = eval(input);
        setResult(evalResult);
      } catch {
        setResult("Error");
      }
    } else if (value === "DEL") {
      setInput(input.slice(0, -1)); // Remove last character
    } else if (value === "C") {
      setInput("");
      setResult("");
    } else {
      setInput(input + value); // Add value to input
    }
  };

  return (
    <div className="calculator">
      <div className="display">
        <div className="input">{input || "0"}</div>
        <div className="result">{result !== "" ? `= ${result}` : ""}</div>
      </div>
      <div className="buttons">
        <button onClick={() => handleClick("/")}>/</button>
        <button onClick={() => handleClick("*")}>*</button>
        <button onClick={() => handleClick("+")}>+</button>
        <button onClick={() => handleClick("-")}>-</button>
        <button onClick={() => handleClick("C")}>C</button>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "."].map((item) => (
          <button key={item} onClick={() => handleClick(item.toString())}>
            {item}
          </button>
        ))}

        <button onClick={() => handleClick("DEL")}>DEL</button>
        <button className="equal" onClick={() => handleClick("=")}>=</button>
      </div>
    </div>
  );
}

export default App;
