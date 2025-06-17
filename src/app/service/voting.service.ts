import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RoomDetails {
  roomId: string;
  roomName: string;
}


@Injectable({
  providedIn: 'root'
})
export class VotingService {
  
  baseUrl:string="http://localhost:8080/api";


  constructor(private http:HttpClient) { }


getAllRooms(): Observable<RoomDetails[]> {
  return this.http.get<RoomDetails[]>(`${this.baseUrl}/rooms/room-details`);
}

addRoom(room: RoomDetails): Observable<RoomDetails> {
  return this.http.post<RoomDetails>(`${this.baseUrl}/rooms/add`, room);
}

deleteRoom(room: RoomDetails): Observable<void> {
  return this.http.request<void>('delete', `${this.baseUrl}/rooms/delete`, {
    body: room
  });
}


}
