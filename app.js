const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//GET PLAYERS
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      cricket_team
    ORDER BY
      player_id;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//ADD PLAYER
app.post("/players/", async (request, response) => {
  const playerDetail = request.body;
  const { playerName, jerseyNumber, role } = playerDetail;
  const addPlayerQuery = `
    INSERT INTO
     cricket_team(player_name,jersey_number,role)
    VALUES
      (
          '${playerName}',
          ${jerseyNumber},
          '${role}'
      );`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added Successfully");
});

//GET PLAYER
app.get("/players/playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId}`;
  const Player = await db.get(getPlayerQuery);
  response.send(Player);
});

//UPDATE PLAYER
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetail;
  const addPlayerQuery = `
    UPDATE
     cricket_team
    SET
       player_name='${playerName}',
       jersey_number=${jerseyNumber},
       role='${role}'
    WHERE
      player_id = ${playerId}
      );`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//DELETE PLAYER
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
