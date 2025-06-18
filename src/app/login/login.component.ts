import { Component } from '@angular/core';
import { UserService, UserDetails } from '../service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  username: string = '';

  constructor(private userService: UserService,private route:Router) {}


 getNextUserId(): string {
  const key = 'planitpoker_user_counter';
  let counter = Number(localStorage.getItem(key)) || 1;
  localStorage.setItem(key, String(counter + 1));
  return `user-${counter}`;
}

 login(): void {
  const trimmed = this.username.trim();
  if (trimmed) {
    const user: UserDetails = {
      userId: this.getNextUserId(),
      username: trimmed
    };

    this.userService.addUser(user).subscribe({
      next: () => {
        localStorage.setItem('currentUser', trimmed);

        if (trimmed.toLowerCase() === 'admin') {
          this.route.navigate(['/room']);
        } else {
          const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/';
          localStorage.removeItem('redirectAfterLogin');
          this.route.navigateByUrl(redirectUrl);
        }
      },
      error: (err) => {
        console.error('Failed to add user:', err);
        alert('Login failed!');
      }
    });
  }
}


  
}


