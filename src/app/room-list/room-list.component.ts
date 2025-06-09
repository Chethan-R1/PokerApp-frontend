import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})

export class RoomListComponent {
    searchTerm = '';
    showAddRoomForm = false;
    newRoomId = '';
    newRoomName = '';

  rooms = [
    { id: 'R101', name: 'Frontend Discussion' },
    { id: 'R102', name: 'Backend Sync' },
    { id: 'R103', name: 'Sprint Planning' },
    { id: 'R104', name: 'Bug Bash' }
  ];

  get filteredRooms() {
    return this.rooms.filter(room =>
      room.id.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleAddRoomForm() {
    this.showAddRoomForm = !this.showAddRoomForm;
  }

  addRoom() {
    if (this.newRoomId.trim() && this.newRoomName.trim()) {
      this.rooms.push({ id: this.newRoomId, name: this.newRoomName });
      this.newRoomId = '';
      this.newRoomName = '';
      this.showAddRoomForm = false;
    }
  }

  // selectRoom(room: { id: string; name: string }) {
  //   alert(`Room selected: ${room.id} - ${room.name}`);
  // }
    constructor(private router: Router) {}

 selectRoom(room: { id: string, name: string }) {
  this.router.navigate(['/vote', room.id]);
}

  deleteRoom(roomId: string) {
  this.rooms = this.rooms.filter(room => room.id !== roomId);
}

}
