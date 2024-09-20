import Swal from "sweetalert2";

// Utility function to check winner
export const checkWinner = (gameState) => {
  if (!gameState || !gameState.length) return null;
  // Row
  for (let row = 0; row < gameState.length; row++) {
    if (gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
      return gameState[row][0];
    }
  }

  // Column
  for (let col = 0; col < gameState.length; col++) {
    if (gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
      return gameState[0][col];
    }
  }

  // Diagonal
  if (gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
    return gameState[0][0];
  }

  if (gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
    return gameState[0][2];
  }

  // Check for draw
  const isDrawMatch = gameState.flat().every((e) => e === "circle" || e === "cross");
  return isDrawMatch ? "draw" : null;
};

// Function to prompt player name
export const takePlayerName = async () => {
  const result = await Swal.fire({
    title: "Enter your name",
    input: "text",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });

  return result;
};