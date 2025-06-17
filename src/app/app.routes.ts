import { Routes } from '@angular/router';
import { RoomListComponent } from './room-list/room-list.component';
import { VotingComponent } from './voting/voting.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'room', component: RoomListComponent },
  { path: 'vote/:roomId', component: VotingComponent,canActivate:[authGuard] },
  {path:'',component:LoginComponent}
];
