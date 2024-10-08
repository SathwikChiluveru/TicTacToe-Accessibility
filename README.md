## Getting Started

### Prerequisites
 npm
    
    npm install npm@latest -g

### Installation

**Step 1:** Clone the repository and install dependencies using `npm install` for both frontend and backend.

**Step 2:**  Traverse into the backend folder and create a .env file with the following information:

`MONGO_URI=mongodb+srv://sathwik:sathwik@cluster0.ya5hy.mongodb.net/Accessibility-TicTacToe`

**Step 3:** Start the backend server using `npm start` in the backend directory.

**Step 4:** Start the frontend using `npm run dev` in the frontend directory.

**Step 5:** Open two different browsers and navigate to `http://localhost:3000`. Enter a name for each player and click "Play Online."

**Step 6:** Play the game by clicking on squares to mark them as either 'X' or 'O'. The game ends when one player wins or it's a draw. If a player leaves the match in the middle, the opponent will get an automatic win as a forfeit.

**Step 7:** View match history by clicking the "History" button.

## Assumptions and Architecture Decisions

1.  **Session Management**
    -   A unique session ID is generated using `uuidv4` to identify each game session. This ensures the same session is shared across different browsers for both players in a session.
2.  **WebSocket Communication**
    
    -   Real-time communication is achieved using Socket.IO, which instantly updates player moves and the game state. This provides a smooth, low-latency gameplay experience.
3.  **Data Model**
    
    -   Each player's match history is stored using a `Player` schema, which includes:
        -   **Opponent**: The name of the opposing player.
        -   **Session ID**: A unique identifier for each game.
        -   **Outcome**: The result of the game (win, lose, or draw).
4.  **Scalability**
    
    -   REST APIs are designed for creating players and updating game history. This modular approach makes it easy to scale the application, allowing for more players and game sessions to be handled simultaneously.

## Gameplay Assumptions

-   **No Authentication**  
    As this is a minimal implementation designed for a casual setting (board game cafe in this case), players are not required to log in with passwords or accounts. The assumption is that players join and start games in close physical proximity, eliminating the need for strict security measures like authentication.


## Design Decisions for Testing with Persons-with-Disabilities (PWDs)

-   **Accessibility Features:**
    -   Aria-labels for buttons and dynamic content like player turns and game status (win, lose, or draw).
    -   Screen readers announce each player's turn and the winner, supporting players with visual impairments.
    -   Simplified interface with clear contrast and large buttons for better usability.

## List of API Functions and Specifications

-   **Create Player (POST `/api/player/create`)**
    
    -   **Request Body:** `{ name: "PlayerName" }`
    -   **Response:** `{ message: 'Player created', player }`
-   **Update Player History (POST `/api/player/update`)**
    
    -   **Request Body:** `{ name, sessionId, outcome, opponent }`
    -   **Response:** `{ message: 'Player history updated', player }`
-   **Get Player History (GET `/api/player/:name/history`)**
    
    -   **Response:** `[ { sessionId, outcome, opponent }, ... ]`

## Design/Infra and Accessibility Considerations

The application was built using the MERN stack, ensuring real-time gameplay via WebSockets (Socket.IO) and REST APIs for player data management. A UUID ensures a unique session ID for game tracking across browsers. Accessibility was prioritized through ARIA labels, keyboard navigation, and screen reader support, with a focus on high-contrast visuals and large clickable areas to enhance usability for individuals with disabilities.

While initially considering more complex database schemas and APIs, I realized that a minimal design was more efficient. The schema with an array for history tracking is sufficient and scalable, avoiding unnecessary complexity. It links game sessions effectively, ensuring that both players share a session ID without requiring an over-complicated API structure. This design balances simplicity with scalability.

I decided to use SweetAlert2, which is a fantastic option to improve the user experience, especially for users who depend on accessibility features, because of its reputation for being highly configurable and WAI-ARIA compatible. With accessibility in mind, this enables smooth game interaction and notifications about game status or history.

## Infrastructure Diagram

![Tic-Tac-Toe-Architecture](https://github.com/user-attachments/assets/d22815b0-50d9-44f2-99a9-15d00545b0e0)



