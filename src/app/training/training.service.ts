import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UIiService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();


  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;

  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIiService) {}

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                ...doc.payload.doc.data() as Exercise
                // name: doc.payload.doc.data()['name'],
                // duration: doc.payload.doc.data()['duration'],
                // calories: doc.payload.doc.data()['calories'],
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
            this.uiService.loadingStateChanged.next(false);
          },
          (error) => {
            console.log(error);
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbarNotification("Fetching Exercises failed, please try again later", null, 3000);
            // if fetching data fails
            this.exercisesChanged.next(null);
          }
        )
    );
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercise() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            this.finishedExercisesChanged.next(exercises);
            this.uiService.loadingStateChanged.next(false);
          },
          (error) => {
            console.log(error);
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbarNotification("Fetching Past Exercises failed, please try again later", null, 3000);
          }
        )
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe())
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({
    //   lastSelected: new Date()
    // });

    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  private addDataToDatabase(exercise: Exercise) {
    // if not exists firebase automatically creates the collection
    this.db.collection('finishedExercises').add(exercise);
  }
}
