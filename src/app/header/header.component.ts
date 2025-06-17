import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDetails, UserService } from '../service/user.service';
import { Route, Router } from '@angular/router';




@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showUsers = false;
  users: UserDetails[] = [];
  newUser = '';
  currentUser: string | null = null;

  constructor(private userService:UserService,private route:Router) {}

  ngOnInit() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = savedUser;
    }
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Failed to load users', err)
    });
  }

  toggleUserList() {
    this.showUsers = !this.showUsers;
  }

  addUser() {
    const trimmedUser = this.newUser.trim();
    if (trimmedUser && !this.users.find(u => u.username === trimmedUser)) {
      const newUserDetails: UserDetails = {
        userId: '',
        username: trimmedUser
      };
      this.userService.addUser(newUserDetails).subscribe({
        next: (createdUser) => {
          this.users.push(createdUser);
          this.selectUser(createdUser.username);
          this.newUser = '';
        },
        error: (err) => console.error('Failed to add user', err)
      });
    }
  }

  selectUser(username: string) {
    this.currentUser = username;
    localStorage.setItem('currentUser', username);
    this.showUsers = false;
  }

  logout(){
 localStorage.clear();
    this.route.navigate([''])
  }
}
