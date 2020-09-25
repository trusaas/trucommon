import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { LoaderService } from './loader.service';
import { Injectable } from '@angular/core';
import { TruAppService } from '../tru-app.service';
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  constructor(private svc: TruAppService,
    private loaderService: LoaderService) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let req = request;
    let loader=true;
    let body=req.body;
    let params=req.params;
    if(params.get('globalLoader') == 'false'){
      loader=false;
      params.delete('globalLoader');
    }
    if(body!=undefined && body!=null && body.globalLoader!=null && body.globalLoader===false){
      loader=false;
      delete body.globalLoader;
    }
    if(body!=undefined && body!=null && body.globalLoader!=null && body.globalLoader===true){
      delete body.globalLoader;
    }
    if(loader){
      this.requests.push(req);
      this.loaderService.isLoading.next(true);
    }
    if (this.svc.checkSession()) {
      request = request.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + this.svc.getToken(),
        }
      });
    }
    return Observable.create(observer => {
      const subscription = next.handle(request).pipe(
        retry(0),
        map(event => {
          return event;
        }),
        catchError(err => {
          this.removeRequest(req);
          return throwError(err);
        })).
        subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
            }
          },
          err => {
            if (err.status === 401 || err.status === 404
              || err.status === 500 || err.status === 403) {
              this.svc.handleServerErrorCodes(err);
            }
            this.removeRequest(req);
            observer.error(err);
          },
          () => {
            this.removeRequest(req);
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
