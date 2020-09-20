import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIiService } from '../../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;

  isLoaded: boolean;
  private loadingSubscription: Subscription;

  constructor(private authService: AuthService, private uiService: UIiService) {}

  ngOnInit(): void {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe( (isLoaded) => {
      this.isLoaded = isLoaded;
    });
    this.maxDate = new Date();
    // today - 18 days ago
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Belép')
      this.authService.registerUser({
        email: form.value.email,
        password: form.value.password
      });
      console.log(form);
    } else {
      console.log('form is invalid');
    }
  }

  ngOnDestroy() {
    // if ngOnDestroy run before subscription created:
    // avoid error
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
