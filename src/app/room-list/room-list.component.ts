import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomDetails, VotingService } from '../service/voting.service';


@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent implements OnInit {
  searchTerm = '';
  showAddRoomForm = false;
  newRoomId = '';
  newRoomName = '';

  rooms: RoomDetails[] = [];

  constructor(private router: Router, private votingService: VotingService) {}

  ngOnInit() {
    this.loadRooms();
  }

  get filteredRooms() {
    return this.rooms.filter(room =>
      room.roomId.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleAddRoomForm() {
    this.showAddRoomForm = !this.showAddRoomForm;
  }

  loadRooms() {
    this.votingService.getAllRooms().subscribe((data) => {
      console.log(data)
      this.rooms = data;
    });
  }

  addRoom() {
    if (this.newRoomId.trim() && this.newRoomName.trim()) {
      const newRoom: RoomDetails = {
        roomId: this.newRoomId,
        roomName: this.newRoomName
      };
      this.votingService.addRoom(newRoom).subscribe((room) => {
        this.rooms.push(room);
        this.newRoomId = '';
        this.newRoomName = '';
        this.showAddRoomForm = false;
      });
    }
  }

  selectRoom(room: RoomDetails) {
    this.router.navigate(['/vote', room.roomId]);
  }

deleteRoom(roomId: string) {
  const room = this.rooms.find(r => r.roomId === roomId);
  if (!room) return;

  this.votingService.deleteRoom({ roomId: room.roomId, roomName: room.roomName }).subscribe({
    next: () => {
      this.rooms = this.rooms.filter(r => r.roomId !== roomId);
    },
    error: (err) => console.error('Error deleting room:', err)
  });
}


}
