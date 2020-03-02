import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthTokenInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthenticationService, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthorizationToken;
    let newHeaders = req.headers;

    if (token) {
      newHeaders = newHeaders.append('Authorization', token);
    }

    const authReq = req.clone({ headers: newHeaders });

    return next.handle(authReq).pipe(
      map(response => {
        if (response instanceof HttpResponse) {
          if (!response.body.status) {
            this.toastr.error(response.body.message, 'Error');
          }

          return response;
      }
      })
    );
  }
}
