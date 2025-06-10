import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface Vote {
  story: string;
  vote: number;
}

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.css'
})
export class VotingComponent {
  roomId = '';
  story = '';
  stories: string[] = [];
  currentStoryIndex: number | null = null;
  selectedVote: number | null = null;
  votes = [1, 2, 3, 5, 8, 13, 21, 34];

  allVotes: { [story: string]: Vote[] } = {};

  editingIndex: number | null = null;
  storyEditText: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';

    // Load stories and votes from localStorage
    const savedStories = localStorage.getItem('stories');
    const savedVotes = localStorage.getItem('votes');

    if (savedStories) this.stories = JSON.parse(savedStories);
    if (savedVotes) this.allVotes = JSON.parse(savedVotes);
  }

  get allVotesKeys(): string[] {
    return Object.keys(this.allVotes);
  }

  get storySet(): boolean {
    return this.currentStoryIndex !== null;
  }

  addStory() {
    console.log('Add Story Clicked:', this.story);
    const trimmed = this.story.trim();
    if (trimmed && !this.stories.includes(trimmed)) {
      this.stories.push(trimmed);
      this.saveStories();
      this.story = '';
    }
  }

  setStory(index: number) {
    this.currentStoryIndex = index;
    this.selectedVote = null;
  }

  vote(value: number) {
    if (this.currentStoryIndex === null) {
      alert('Please select a story first.');
      return;
    }

    const currentStory = this.stories[this.currentStoryIndex];

    if (!this.allVotes[currentStory]) {
      this.allVotes[currentStory] = [];
    }

    this.allVotes[currentStory].push({ vote: value, story: currentStory });
    this.selectedVote = value;
    this.saveVotes();
  }

  saveStories() {
    localStorage.setItem('stories', JSON.stringify(this.stories));
  }

  saveVotes() {
    localStorage.setItem('votes', JSON.stringify(this.allVotes));
  }

  deleteStory(index: number) {
    const storyToDelete = this.stories[index];
    this.stories.splice(index, 1);
    this.saveStories();

    if (this.allVotes[storyToDelete]) {
      delete this.allVotes[storyToDelete];
      this.saveVotes();
    }

    if (this.currentStoryIndex === index) {
      this.currentStoryIndex = null;
      this.selectedVote = null;
    } else if (this.currentStoryIndex !== null && this.currentStoryIndex > index) {
      this.currentStoryIndex--;
    }
  }

  editStory(index: number) {
    this.editingIndex = index;
    this.storyEditText = this.stories[index];
  }

  saveEditedStory() {
    if (this.editingIndex === null) return;

    const oldStory = this.stories[this.editingIndex];
    const newStory = this.storyEditText.trim();

    if (!newStory || oldStory === newStory) {
      this.cancelEdit();
      return;
    }

    // Update story name
    this.stories[this.editingIndex] = newStory;

    // Move votes if story name changed
    if (this.allVotes[oldStory]) {
      this.allVotes[newStory] = this.allVotes[oldStory];
      delete this.allVotes[oldStory];
    }

    this.saveStories();
    this.saveVotes();
    this.cancelEdit();
  }

  cancelEdit() {
    this.editingIndex = null;
    this.storyEditText = '';
  }

  clearVotes() {
  if (confirm('Are you sure you want to clear all voting results?')) {
    this.allVotes = {};
    localStorage.removeItem('votes');
  }
}

}
