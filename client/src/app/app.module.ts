import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RandomnameService } from './services/randomname.service';
import {SocketioService} from './services/socketio.service';
import { HomeComponent } from './components/home/home.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [SocketioService,RandomnameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
