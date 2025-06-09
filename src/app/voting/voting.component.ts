import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-voting',
  imports: [ CommonModule, FormsModule],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.css'
})
export class VotingComponent {
   roomId = '';
  story = '';
  storySet = false;
  votes = [1, 2, 3, 5, 8, 13, 21, 34];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomId') || '';
  }

  setStory() {
    if (this.story.trim()) {
      this.storySet = true;
    }
  }

  vote(value: number) {
    if (!this.storySet) {
      alert('Please add a story first!');
      return;
    }
    alert(`You voted ${value} in room ${this.roomId} for story "${this.story}"`);
  }
}
