import React, { useState, useEffect } from "react";
import Board from "./Board";

function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([
    { id: 1, title: "Go to game Start", count: 0 },
  ]);
  const [prevState, setPrevState] = useState([Array(9).fill(null)]);

  //Declaring a Winner
  useEffect(() => {
    const declareWinner = calculateWinner(squares);
    setWinner(declareWinner);
  }, [squares]);

  //function to check if a player has won.
  //If a player has won, we can display text such as “Winner: X” or “Winner: O”.
  //Input: squares: given an array of 9 squares:'X', 'O', or null.
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  //Handle player
  const handleClick = (i) => {
    const newSquares = squares.slice();

    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }

    newSquares[i] = xIsNext ? "X" : "O";

    setHistory([
      ...history,
      {
        id: Date.now(),
        title: `Go to move #${history.length}`,
        count: history.length,
      },
    ]);

    setPrevState([...prevState, newSquares]);

    setSquares(newSquares);
    setXIsNext((changeState) => !changeState);
  };

  //Restart game
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);

    setHistory([{ id: 1, title: "Go to game Start", count: 0 }]);
    setPrevState([Array(9).fill(null)]);
  };

  //Handle Go back
  const handleGoBack = (goBackLength) => {
    setSquares(prevState[goBackLength]);
    setXIsNext(() => {
      if (goBackLength % 2 === 0) {
        return true;
      } else {
        return false;
      }
    });
    setHistory(history.filter((a) => a.count <= goBackLength));

    setPrevState(prevState.slice(0, goBackLength + 1));
  };

  return (
    <div className="main">
      <h2 className="result">Winner is: {winner ? winner : "N/N"}</h2>
      <div className="flex-row">
        <div className="game">
          <span className="player">Next player is: {xIsNext ? "X" : "O"}</span>
          <Board squares={squares} handleClick={handleClick} />
        </div>
        <div className="history">
          <h4>History</h4>
          <ul>
            {history.map((move) => (
              <li key={move.id}>
                <button onClick={() => handleGoBack(move.count)}>
                  {move.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={handleRestart} className="restart-btn">
        Restart
      </button>
    </div>
  );
}

export default Game;
