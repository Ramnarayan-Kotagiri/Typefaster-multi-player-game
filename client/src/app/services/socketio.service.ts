import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: any;
  observer: any;
  constructor() {}

  /**
   * @summary setup socket connection
   */
  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      auth: {
        token: 'tyepfaster',
      },
    });
  }

  /**
   * @summary Disconnect from Socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  /**
   *
   * @param user Player name
   * @returns response from Socket based on the Game Stage
   * @summary Create new room / join existing room and submit the game.
   */
  joinRoom(user: string) {
    this.socket.emit('join_room', user);

    this.socket.on('all_participants_joined', (res: any) => {
      this.observer.next(res);
    });

    this.socket.on('waiting_for_second_participant', (res: any) => {
      this.observer.next(res);
    });

    this.socket.on('game_finished', (res: any) => {
      this.observer.next(res);
    });

    return this.getJoinedRoomObservable();
  }

  /**
   *
   * @returns Observable of the response from Socket server
   */
  getJoinedRoomObservable(): Observable<any> {
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  /**
   * @summary A player has submitted the Game. Close the Game and declare Winner.
   * @param gameId The game ID / room ID
   * @param user The winner name
   * @param mins Minutes taken by the winner
   * @param secs Seconds taken by the winner
   * @param milliseconds Milliseconds taken by the winner
   */
  submitGame(
    gameId: string,
    user: string,
    mins: number,
    secs: number,
    milliseconds: number
  ) {
    this.socket.emit('submit_game', [gameId, user, mins, secs, milliseconds]);
  }
}
