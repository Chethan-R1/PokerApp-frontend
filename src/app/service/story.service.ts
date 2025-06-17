import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomDetails } from './voting.service';


export interface StoryDetails {
  storyId: string;
  storyName: string;
  roomDetails: {
    roomId: string;
    roomName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  baseUrl:string="http://localhost:8080/api";

  constructor(private http:HttpClient) { }

  getAllStories(): Observable<StoryDetails[]> {
    return this.http.get<[]>(`${this.baseUrl}/story-details`);
  }

  getStoriesByRoom(roomId: string): Observable<StoryDetails[]> {
  return this.http.get<StoryDetails[]>(`${this.baseUrl}/room/${roomId}`);
}
  
  addStory(story:StoryDetails): Observable<StoryDetails> {
    return this.http.post<StoryDetails>(`${this.baseUrl}/story-details`, story);
  }
  
  deleteStory(storyId:String): Observable<void> {
    return this.http.request<void>('delete', `${this.baseUrl}/story-details/${storyId}`, {
    
    });
  }
  
}
