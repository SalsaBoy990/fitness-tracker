import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>()
  isAuth: boolean = false;
  authSubscription: Subscription;
  
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe()
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

}
