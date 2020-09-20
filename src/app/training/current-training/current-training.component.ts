import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';
import { Howl, Howler } from 'howler';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit {
  
  // @Output() trainingExit = new EventEmitter();
  progress: number = 0;
  timer: number;


  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService,
    private snackBar: MatSnackBar
    ) {}


  ngOnInit(): void {
    this.startOrResumeTimer();
  }


  startOrResumeTimer() {
    const step = this.trainingService.getRunningExercise().duration / 100 * 1000;
    this.timer = window.setInterval(() => {
      if (this.progress >= 100) {
        let sound = new Howl({
          src: ['assets/sound/sunny.mp3'],
          volume: 0.6,
          onplay: () => {
            this.snackBar.open(
              'Congratulations! You just finished an exercise!',
              '',
              { duration: 4000 });
          }
        });
        sound.play();
        this.trainingService.completeExercise();
        clearInterval(this.timer);
        return;
      }
      this.progress += 1;

    }, step);
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === true) {
        this.trainingService.cancelExercise(this.progress);
        // this.trainingExit.emit();
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
