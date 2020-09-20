import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from './training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  trainingSubscription: Subscription;

  onGoingTraining: boolean = false;

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.trainingSubscription = this.trainingService.exerciseChanged.subscribe(
      (exercise) => {
        if (exercise) {
          this.onGoingTraining = true;
        } else {
          this.onGoingTraining = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.trainingSubscription) {
      this.trainingSubscription.unsubscribe();
    }
  }
}
