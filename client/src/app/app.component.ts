import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isDevelopment = !environment.production;
  public showAccountDropdownMenu = false;
  public loading = false;
  public fixedHeaderPages = [ '/', '/login', '/signup', '/forgot-password', '/new-password' ];
  public hasFixedHeader = false;

  constructor(public auth: AuthenticationService, private router: Router) {
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          const e: any = event;
          for (let i = 0, n = this.fixedHeaderPages.length; i < n; i++) {
            this.hasFixedHeader = false;

            if (this.fixedHeaderPages[i] === e.url) {
              this.hasFixedHeader = true;
              break;
            }
          }
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
    this.toggleAccountDropdownMenu();
    this.auth.userData = null;
    this.auth.removeJwtToken();
    this.router.navigate(['/']);
  }
}
