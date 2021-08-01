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

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT, {
      auth: {
        token: 'tyepfaster',
      },
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

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
    })

    return this.getJoinedRoomObservable();
  }

  getJoinedRoomObservable(): Observable<any> {
    return new Observable((observer) => {
      this.observer = observer;
    });
  }

  submitGame(gameId: string,user:string,mins:number,secs:number,milliseconds:number){
    this.socket.emit('submit_game', [gameId,user,mins,secs,milliseconds]);
  }
}
