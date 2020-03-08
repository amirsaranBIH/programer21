import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ResponseErrorInterceptorService implements HttpInterceptor {

  constructor(private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone();

    return next.handle(authReq).pipe(
      map(response => {
        if (response instanceof HttpResponse) {
          if (response.body.status === false) {
            this.toastr.error(response.body.message, 'Error');
          }

          return response;
      }
      })
    );
  }
}
