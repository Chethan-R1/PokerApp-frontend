import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UserDetails{
  userId:string;
  username:string;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string = 'http://localhost:8080/api/users';

  constructor(private http:HttpClient) { }

   getAllUsers(): Observable<UserDetails[]> {
    return this.http.get<UserDetails[]>(`${this.baseUrl}`);
  }

  addUser(user: UserDetails): Observable<UserDetails> {
    return this.http.post<UserDetails>(`${this.baseUrl}`, user);
  }

  deleteUser(user: UserDetails): Observable<void> {
    return this.http.request<void>('delete', `${this.baseUrl}`, {
      body: user
    });
  }
}
