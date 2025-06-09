import { Routes } from '@angular/router';
import { RoomListComponent } from './room-list/room-list.component';
import { VotingComponent } from './voting/voting.component';

export const routes: Routes = [
  { path: '', component: RoomListComponent },
  { path: 'vote/:roomId', component: VotingComponent },
];
