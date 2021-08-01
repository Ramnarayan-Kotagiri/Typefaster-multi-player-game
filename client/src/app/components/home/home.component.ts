import { Component, OnInit } from '@angular/core';
import { RandomnameService } from '../../services/randomname.service';
import { SocketioService } from '../../services/socketio.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  name: string = '';
  stage: string = '';
  countdown: number = 3;
  gamePhrase: string = '';
  gameId : string = ''
  winner : string = ''
  winnerMM : number = 0
  winnerSS : number = 0
  winnerMS : number = 0
  enteredText = '';

  mm = 0;
  ss = 0;
  ms = 0;
  isRunning = false;
  timerId : any;

  constructor(
    private socketService: SocketioService,
    private nameService: RandomnameService
  ) {}

  ngOnInit() {
    this.socketService.setupSocketConnection();
    this.name = this.nameService.generateName();
    this.stage = 'home';

  }


  ngOnDestroy() {
    this.socketService.disconnect();
  }


  /**
   * @summary Create a new room / join a room. Check if the game is submitted by opponent.
   */
  joinRoom() {
    let response: any;
    this.socketService.joinRoom(this.name).subscribe((data: any) => {
      console.log(data);
      response = data;
      if (response.state === 'waiting') {
        this.stage = 'waiting';
        this.gameId = response.game
        this.gamePhrase = response.phrase;
      }
      if (response.state === 'connected') {
        this.stage = 'connected';
        this.gameId = response.game
        this.gamePhrase = response.phrase;
        let interval = setInterval(() => {
          if (this.countdown > 1) {
            this.countdown = this.countdown - 1;
          }
          if (this.countdown === 1) {
            clearInterval(interval);
            this.loadGame();
          }
        }, 1000);
      }
      if (response.state === 'finished'){
        this.stage = 'finished'
        this.winner = response.user;
        this.winnerMM = response.mm
        this.winnerSS = response.ss
        this.winnerMS = response.ms
      }
    });
  }

/**
 * @summary load the game and update the stage
 */
  loadGame() {
    this.stage = 'game';
    this.submitHandler()
  }

  /**
   * 
   * @param event input by the user on the textarea
   */
  onInput(event: any) {
    this.enteredText = event.target.value;
  }

  /**
   * 
   * @param letterFromGivenPhrase Letter from the game Phrase
   * @param enteredLetter Letter entered by the user
   * @returns the class of the letter to be displayed on the game phrase
   */
  compare(letterFromGivenPhrase: string, enteredLetter: string) {
    if (!enteredLetter) {
      return 'pending';
    }

    return letterFromGivenPhrase === enteredLetter ? 'correct' : 'incorrect';
  }

  /**
   * @summary Start / Stop the timer based on game submission.
   */
  submitHandler() {
    if (!this.isRunning) {
      this.timerId = setInterval(() => {
        this.ms++;

        if (this.ms >= 100) {
          this.ss++;
          this.ms = 0;
        }
        if (this.ss >= 60) {
          this.mm++;
          this.ss = 0
        }
      }, 10);
    } else {
      clearInterval(this.timerId);
    }
    this.isRunning = !this.isRunning;
  }

  /**
   * @param num time entity minutes / seconds / milliseconds
   * @returns formatted number
   */
  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }

  /**
   * @summary Submit the Game and declare winner.
   */
  submitGame(){
    this.submitHandler()
    this.socketService.submitGame(this.gameId,this.name,this.mm,this.ss,this.ms);
  }
}
