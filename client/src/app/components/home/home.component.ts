import { Component, OnInit } from '@angular/core';
import { RandomnameService } from '../../services/randomname.service';
import { SocketioService } from '../../services/socketio.service'
import { Router } from '@angular/router';
import { ThisReceiver } from '@angular/compiler';

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
    private nameService: RandomnameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.socketService.setupSocketConnection();
    this.name = this.nameService.generateName();
    this.stage = 'home';

  }


  ngOnDestroy() {
    this.socketService.disconnect();
  }

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

  loadGame() {
    this.stage = 'game';
    this.clickHandler()
  }

  onInput(event: any) {
    this.enteredText = event.target.value;
  }

  compare(randomLetter: string, enteredLetter: string) {
    if (!enteredLetter) {
      return 'pending';
    }

    return randomLetter === enteredLetter ? 'correct' : 'incorrect';
  }

  clickHandler() {
    if (!this.isRunning) {
      // Stop => Running
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

  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }

  submitGame(){
    this.clickHandler()
    this.socketService.submitGame(this.gameId,this.name,this.mm,this.ss,this.ms);
  }
}
