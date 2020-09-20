import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIiService } from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  selectedId: string;
  exercises: Exercise[];
  exercisesSubscription: Subscription;

  private loadingSubscription: Subscription;
  isLoading: boolean;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIiService
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
      (result: Exercise[]) => {
        this.exercises = result;
      }
    );
    this.trainingService.fetchAvailableExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
    console.log(this.trainingService.getRunningExercise());
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
  }
}
