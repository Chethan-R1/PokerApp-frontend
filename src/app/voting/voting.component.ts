import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { StoryDetails, StoryService } from '../service/story.service';
import { PollService, Vote } from '../service/poll.service';
import { RoomDetails, VotingService } from '../service/voting.service';
import { HeaderComponent } from "../header/header.component";


@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.css',
})
export class VotingComponent {
  roomId = '';
  story = '';
  stories: StoryDetails[] = [];
  currentStoryIndex: number | null = null;
  selectedVote:Vote[]= [];
  votes = [1, 2, 3, 5, 8, 13, 21, 34];
  allVotes: { [story: string]: { vote: number; story: string }[] } = {};
  currentUser: string | null = null;
  editingIndex: number | null = null;
  storyEditText: string = '';
  rooms: RoomDetails[] = [];
showDropdown = false;

  constructor(private route: ActivatedRoute, private storyService: StoryService,private pollService:PollService,private votingService:VotingService) {}

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';
    this.currentUser = localStorage.getItem('currentUser');
      this.getAllRooms();

    // this.storyService.getAllStories().subscribe((data) => {
    //   this.stories = data;
    
  this.loadStories(); // Load stories specific to this room
  }
  loadStories() {
  this.storyService.getStoriesByRoom(this.roomId).subscribe({
    next: (data) => {
      this.stories = data;
      console.log(this.stories)
    },

    error: (err) => {
      console.error('Error loading stories:', err);
    } 
    });
    this.getVotes()
  }

  get storySet(): boolean {
    return this.currentStoryIndex !== null;
  }

  get allVotesKeys(): string[] {
    return Object.keys(this.allVotes);
  }

  addStory() {
  const trimmed = this.story.trim();
  if (trimmed && !this.stories.find(s => s.storyName === trimmed)) {
    const newStory: StoryDetails = {
      storyId: Date.now().toString(),
      storyName: trimmed,
      roomDetails: {
        roomId: this.roomId,
        roomName: '' // Optional: set if known or leave blank if backend can infer
      }
    };

    this.storyService.addStory(newStory).subscribe((added) => {
      this.stories.push(added);
      this.story = '';
    });
  }
}

selectInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.select();
}

getInviteLink(): string {
  return `${window.location.origin}/vote/${this.roomId}`;
}

copyInviteLink(): void {
  navigator.clipboard.writeText(this.getInviteLink()).then(() => {
    alert('Invite link copied!');
  });
}



getAllRooms() {
  this.votingService.getAllRooms().subscribe({
    next: (data) => this.rooms = data,
    error: (err) => console.error('Failed to load rooms:', err)
  });
}




  setStory(index: number) {
    this.currentStoryIndex = index;
    console.log(this.currentStoryIndex)
    this.selectedVote = [];
  }


vote(value: number) {
  if (this.currentStoryIndex === null) {
    alert('Please select a story first.');
    return;
  }

  const currentStory = this.stories[this.currentStoryIndex];
  const userId = localStorage.getItem('currentUser') || 'guest';

  const voteData: Vote = {
    voteId:value,
    user: {
      userId: userId,
      username: userId
    },
    room: {
      roomId: this.roomId,
      roomName: ''
    },
    story: currentStory
  };

  this.pollService.addVote(voteData).subscribe({
    next: (response) => {
      this.selectedVote.push(response); // ✅ Push to array instead of overwrite
      this.selectedVote = [...this.selectedVote]; // Force change detection
      console.log('Vote submitted:', response);
    },
    error: (err) => {
      console.error('Error submitting vote:', err);
      alert('Failed to submit vote. Please try again.');
    }
  });
}
getVotes(){
  this.pollService.getAllVotes().subscribe({
    next:(r)=>{
      console.log(r)
    },
    error:(err)=>{
      console.log(err)
    }
  })
}
  deleteStory(index: number) {
    const story = this.stories[index];
    this.storyService.deleteStory(story.storyId).subscribe(() => {
      this.stories.splice(index, 1);
      if (this.allVotes[story.storyName]) delete this.allVotes[story.storyName];
      if (this.currentStoryIndex === index) {
        this.currentStoryIndex = null;
     
      } else if (this.currentStoryIndex !== null && this.currentStoryIndex > index) {
        this.currentStoryIndex--;
      }
    });
  }

  editStory(index: number) {
    this.editingIndex = index;
    this.storyEditText = this.stories[index].storyName;
  }

  saveEditedStory() {
    if (this.editingIndex === null) return;
    const oldStory = this.stories[this.editingIndex];
    const newName = this.storyEditText.trim();
    if (!newName || oldStory.storyName === newName) {
      this.cancelEdit();
      return;
    }

    const updated = { ...oldStory, storyName: newName };
    this.storyService.addStory(updated).subscribe(() => {
      this.stories[this.editingIndex!] = updated;
      if (this.allVotes[oldStory.storyName]) {
        this.allVotes[newName] = this.allVotes[oldStory.storyName];
        delete this.allVotes[oldStory.storyName];
      }
      this.cancelEdit();
    });
  }

  cancelEdit() {
    this.editingIndex = null;
    this.storyEditText = '';
  }

  clearVotes() {
    if (confirm('Are you sure you want to clear all voting results?')) {
      this.allVotes = {};
    }
  }
}
