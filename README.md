## Typefaster-multi-player-game

### Test Requirement :
- 2 users will connect to the same URL in different browser window.
- The users will initiate the game by clicking the play button.
- A count down (3 seconds) will appear on the screen. This should be same for each screen.
- As soon as the countdown is over the users can start typing the random given
sentence.
- A timer will start in the background to measure the typing speed.
- As soon as the users has finished typing and the text matches correctly the given
sentence, they will be able to submit the text by either pressing enter on thekeyboard
or clicking on the submit button. Doing so, the timer will be stopped and mark the
result. The time will be displayed on the user'sscreen.
- Once a user has completed the round, the winner will be announced for both users
and displayed on both screens.  
  

## Game Screens:

  <img  src="https://i.ibb.co/wgtCPC0/screen-layout.png" align="center"  />
  

## Demo :


  <img  src="https://i.ibb.co/qkv7HFV/ezgif-com-gif-maker-6.gif" align="center"  />
  

## Instructions to run

### Clone the repo

```sh

git clone https://github.com/Ramnarayan-Kotagiri/Typefaster-multi-player-game.git

cd Typefaster-multi-player-game

```

### Client 
***

#### Install Dependencies

```sh
cd client
npm i
```
#### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```sh

ng serve

```

### Server
***

#### Install Dependencies

```sh
cd server
npm i
```
#### Development server

Run `npm start` to create the backend node server running on port `3000`. 

```sh
npm start
```

## Game Play
- On Landing Page click on "Lets Play" to start the game.
- Player will be placed in a waiting room till opponent joins.
- As soon as opponent joins countdown starts for both players from 3 to 1.
- A phrase is displayed on the next screen with a timer running on top of it.
- Players are required to type out the phrase in the least time.
- As soon as one of the user submits his result game ends and winner is displayed.

Note : Players are restricted from copying the phrase.

## Contact

Website : https://ramnarayan-kotagiri.github.io/