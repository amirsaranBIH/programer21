import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { environment } from 'src/environments/environment';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isDevelopment = !environment.production;
  public showAccountDropdownMenu = false;
  public fixedHeaderPages = [ '/', '/login', '/signup', '/forgot-password', '/new-password', '/404' ];
  public hasFixedHeader = false;

  constructor(
    public auth: AuthenticationService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    public loading: LoadingService
  ) {
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.showAccountDropdownMenu = false;

          const e: any = event;
          for (let i = 0, n = this.fixedHeaderPages.length; i < n; i++) {
            this.hasFixedHeader = false;

            if (this.fixedHeaderPages[i] === e.url) {
              this.hasFixedHeader = true;
              break;
            }
          }
          this.loading.setLoadingStatus = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading.setLoadingStatus = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    let language = localStorage.getItem('language');

    if (!language) {
      if (['bs', 'hr', 'sr'].some(lang => window.navigator.language.includes(lang))) {
        language = 'bs';
      } else {
        language = 'en';
      }

      localStorage.setItem('language', language);
    }

    this.translate.use(language);
  }

  toggleAccountDropdownMenu() {
    this.showAccountDropdownMenu = !this.showAccountDropdownMenu;
  }

  logout() {
    this.toastr.success('Successfully logged out from your account', 'Success');
    this.toggleAccountDropdownMenu();
    this.auth.logout().then((res: any) => {
      if (res.status) {
        this.auth.userData = null;
        this.router.navigate(['/']);
      }
    });
  }
}
