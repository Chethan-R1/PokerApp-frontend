import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { RoomListComponent } from './room-list/room-list.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RoomListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'planitpoker1';
}
