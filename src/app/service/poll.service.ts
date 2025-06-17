import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StoryDetails } from './story.service';
import { RoomDetails } from './voting.service';

export interface User{
  userId:String;
  username:String;
}

export interface Vote{
   voteId:number;
   user:User;
  room :RoomDetails ;
  story:StoryDetails;

}
@Injectable({
  providedIn: 'root'
})
export class PollService {
  
  baseUrl:string="http://localhost:8080/api/votes";

  constructor(private http:HttpClient) { }

  getAllVotes(): Observable<Vote[]> {
    return this.http.get<Vote[]>(`${this.baseUrl}`);
  }
  
  addVote(vote: Vote): Observable<Vote> {
    return this.http.post<Vote>(`${this.baseUrl}`, vote);
  }
}
