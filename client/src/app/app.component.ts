import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public isDevelopment = !environment.production;
  public showAccountDropdownMenu = false;
  public loading = false;

  constructor(public auth: AuthenticationService, private router: Router) {
    this.router.events.subscribe(event => { 
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

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
