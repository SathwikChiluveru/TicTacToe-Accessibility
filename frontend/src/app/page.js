"use client"

import React, { useState, useEffect } from "react";
import "./App.css";
import Square from "./components/Square";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { checkWinner, takePlayerName } from "@/app/utils/gameUtils";
 

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const App = () => {
  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState("circle");
  const [finishedState, setFinishedState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const winner = checkWinner(gameState);
    if (winner) {
      setFinishedState(winner);
    }
  }, [gameState]);

  socket?.on("opponentLeftMatch", () => {
    setFinishedState("opponentLeftMatch");
  });

  socket?.on("playerMoveFromServer", (data) => {
    const id = data.state.id;
    setGameState((prevState) => {
      let newState = [...prevState];
      const rowIndex = Math.floor(id / 3);
      const colIndex = id % 3;
      newState[rowIndex][colIndex] = data.state.sign;
      return newState;
    });
    setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
  });

  socket?.on("connect", function () {
    setPlayOnline(true);
  });

  socket?.on("OpponentNotFound", function () {
    setOpponentName(false);
  });

  socket?.on("OpponentFound", function (data) {
    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
    setSessionId(data.sessionId);
  });

  async function playOnlineClick() {
    const result = await takePlayerName();

    if (!result.isConfirmed) {
      return;
    }

    const username = result.value;
    setPlayerName(username);

    await fetch('http://localhost:5000/api/player/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username }),
    });

    const newSocket = io("http://localhost:5000", {
      autoConnect: true,
    });

    newSocket?.emit("request_to_play", {
      playerName: username,
    });

    setSocket(newSocket);

    const session = uuidv4();
    setSessionId(session);
  }

  async function fetchHistory(){
    const response = await fetch(`http://localhost:5000/api/player/${playerName}/history`);
    const history = await response.json();

    let historyTable = `
      <table style="width:100%; text-align: left; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 1px solid black;">
            <th>Opponent</th>
            <th>Session ID</th>
            <th>Outcome</th>
          </tr>
        </thead>
        <tbody>
          ${history.map(item => `
            <tr>
              <td>${item.opponent}</td>
              <td>${item.sessionId}</td>
              <td>${item.outcome}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    await Swal.fire({
      title: `${playerName}'s Game History`,
      html: historyTable,
      showCloseButton: true,
      width: '800px'
    });
  }

  useEffect(() => {
    if (finishedState && playerName) {
      const outcome = finishedState === 'draw' ? 'draw' : (finishedState === playingAs ? 'win' : 'lose');
      fetch('http://localhost:5000/api/player/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName,
          sessionId: sessionId,
          outcome,
          opponent: opponentName,
        }),
      });
    }
  }, [finishedState]);

  if (!playOnline) {
    return (
      <div className="main-div">
        <button onClick={playOnlineClick} className="playOnline">
          Play Online
        </button>
      </div>
    );
  }

  if (playOnline && !opponentName) {
    return (
      <div className="waiting">
        <p>Waiting for opponent</p>
      </div>
    );
  }

  return (
    <div className="main-div" role="main">
      <div className="move-detection" aria-live="polite">
        <div
          className={`left ${
            currentPlayer === playingAs ? "current-move-" + currentPlayer : ""
          }`}
          role="status"
          aria-label={`${playerName}'s turn`}
        >
          {playerName}
        </div>
        <div
          className={`right ${
            currentPlayer !== playingAs ? "current-move-" + currentPlayer : ""
          }`}
          role="status"
          aria-label={`${opponentName}'s turn`}
        >
          {opponentName}
        </div>
      </div>
      <div role="region" aria-labelledby="game-heading">
        <h1 id="game-heading" className="game-heading water-background">Tic Tac Toe</h1>
        <div className="square-wrapper" role="grid" aria-label="Tic Tac Toe board">
          {gameState.map((arr, rowIndex) =>
            arr.map((e, colIndex) => {
              return (
                <Square
                  socket={socket}
                  playingAs={playingAs}
                  gameState={gameState}
                  finishedArrayState={finishedArrayState}
                  finishedState={finishedState}
                  currentPlayer={currentPlayer}
                  setCurrentPlayer={setCurrentPlayer}
                  setGameState={setGameState}
                  id={rowIndex * 3 + colIndex}
                  key={rowIndex * 3 + colIndex}
                  currentElement={e}
                  aria-label={`Square ${rowIndex * 3 + colIndex}`}
                />
              );
            })
          )}
        </div>
        {finishedState &&
          finishedState !== "opponentLeftMatch" &&
          finishedState !== "draw" && (
            <>
              <h3 role="alert" aria-live="assertive" className="finished-state">
                {finishedState === playingAs ? "You " : finishedState} won the
                game
              </h3>
              <button className="historyButton" onClick={fetchHistory} aria-label="View game history">
              History
              </button>
            </>
          
          )}
        {finishedState &&
          finishedState !== "opponentLeftMatch" &&
          finishedState === "draw" && (
            <>
              <h3 role="alert" aria-live="assertive" className="finished-state">It's a Draw</h3>
              <button className="historyButton" onClick={fetchHistory} aria-label="View game history">
                History
              </button>
            </>
          )}
      </div>
      {!finishedState && opponentName && (
        <h2>You are playing against {opponentName}</h2>
      )}
      {finishedState && finishedState === "opponentLeftMatch" && (
        <>
          <h2 role="alert" aria-live="assertive"> You won the match, Opponent has left</h2>
          <button className="historyButton" onClick={fetchHistory} aria-label="View game history">
                History
          </button>
        </>
      )}
    </div>
  );
};

export default App;
