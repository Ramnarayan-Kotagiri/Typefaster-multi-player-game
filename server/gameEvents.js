var io;
var gameSocket;
var games = {}

var phrases = [
    'She had the gift of being able to paint songs.',
    'Giving directions that the mountains are to the west only works when you can see them.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin',
    'The most disastrous thing that you can ever learn is your first programming language. -Alan Kay'
];

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initializeGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.on('join_room', joinRoom);
    gameSocket.on('submit_game', submitGame);
}

/* *******************************
   *                             *
   *       Game FUNCTIONS        *
   *                             *
   ******************************* */

/**
 * The 'Lets Play' button was clicked and 'join_room' event occurred.
 */
function joinRoom() {

    let gameId = null;

    // Check for Rooms with empty slots.
    for(let i in games) {
        if(games && games[i]['count'] && games[i]['count'] < 2) {
            gameId = i;
            break;
        }
    }

    // Create New Game Room If Rooms are filled.
    if(!gameId) {
        gameId = createNewRoom();
        games[gameId]['phrase'] = getGamePhrase();
    }

    // Keep track of memebers for a given gameId
    games[gameId]['count'] += 1;

     // Join the Room and wait for the players
    this.join(gameId.toString());

    if(games[gameId]['count'] > 1) {
        // trigger countdown for play
        io.in(gameId.toString()).emit("all_participants_joined", {
          game: gameId.toString(),
          phrase: games[gameId]["phrase"],
          state: "connected",
        });
    } else {
        // wait for another player to join
        io.in(gameId.toString()).emit("waiting_for_second_participant", {
          game: gameId.toString(),
          phrase: games[gameId]["phrase"],
          state: "waiting",
        });
    }


};

/**
 * Rooms are all filled and User requested for New Room
 */
function createNewRoom() {
    
    // Create a unique Socket.IO Room
    let gameId = ( Math.random() * 100000 ) | 0;

    // Add a count key to keep track of members
    games[gameId] = {
        count: 0
    };

    return gameId;
}


/**
 * The Countdown is completed and Game Phrase is requested.
 */
function getGamePhrase() {
    let randomPhraseLocator = Math.floor(Math.random() * Math.floor(phrases.length));
    return phrases[randomPhraseLocator];
}

/**
 * @summary A player has submitted the Game. Close the Game and declare Winner.
 * @param gameId The game ID / room ID
 * @param user The winner name
 * @param mm Minutes taken by the winner
 * @param ss Seconds taken by the winner
 * @param ms Milliseconds taken by the winner
 */
function submitGame(...options) {
    io.in(options[0][0]).emit("game_finished", {
      user: options[0][1],
      mm: options[0][2],
      ss: options[0][3],
      ms: options[0][4],
      state: "finished",
    });
}
