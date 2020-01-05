import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public isDevelopment = !environment.production;
  public showAccountDropdownMenu = false;

  constructor(public auth: AuthenticationService, private router: Router) {}

  toggleAccountDropdownMenu() {
    this.showAccountDropdownMenu = !this.showAccountDropdownMenu;
  }

  routeTo(route) {
    this.router.navigate([route]);
    this.toggleAccountDropdownMenu();
  }
  
  logout() {
    this.auth.logout();
    this.toggleAccountDropdownMenu();
  }
}
