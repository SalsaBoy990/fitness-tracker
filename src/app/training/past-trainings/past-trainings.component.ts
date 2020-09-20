import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, OnDestroy, AfterViewInit {
  
  finishedExercisesSubscription:Subscription;
  
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.finishedExercisesSubscription = this.trainingService.finishedExercisesChanged.subscribe( (exercises: Exercise[]) => {
      this.dataSource.data = exercises;
    })
    this.trainingService.fetchCompletedOrCancelledExercise();

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy():void {
    if (this.finishedExercisesSubscription) {
      this.finishedExercisesSubscription.unsubscribe();
    }
  }

}
