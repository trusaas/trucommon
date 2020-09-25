import { Injector, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface IRequestOptions {
    headers?: HttpHeaders;
    observe?: 'body';
    params?: HttpParams;
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    body?: any;
}
@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
    private api = environment.restApiUrl;
    _isLoader = true;

    // Extending the HttpClient through the Angular DI.
    public constructor(public http: HttpClient, public injector: Injector) {
        // If you don't want to use the extended versions in some cases you can access the public property and use the original one.
        // for ex. this.httpClient.http.get(...)
    }

    /**
     * GET request
     * @param {string} endPoint it doesn't need / in front of the end point
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public get<T>(endPoint: string, options?: IRequestOptions): Observable<any> {
      return this.http.get<T>(this.processEndpoint(endPoint), options);
    }

    /**
     * POST request
     * @param {string} endPoint end point of the api
     * @param {Object} params body of the request.
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public post<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<any> {
      return this.http.post<T>(this.processEndpoint(endPoint), params, options);
    }
    private processEndpoint = (endPoint:string):string =>{
      /*
      if(endPoint.indexOf('?')<0){
        endPoint+='?tru_ts='+new Date().getTime();
      }else{
        endPoint+='&tru_ts='+new Date().getTime();
      }
      */
      if(endPoint.startsWith("http")){
        return endPoint;
      }else{
        return this.api + endPoint;
      }
    }
    /**
     * PUT request
     * @param {string} endPoint end point of the api
     * @param {Object} params body of the request.
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public put<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<any> {
      return this.http.put<T>(this.processEndpoint(endPoint), params, options);
    }

    /**
    * PATCH request
    * @param {string} endPoint end point of the api
    * @param {Object} params body of the request.
    * @param {IRequestOptions} options options of the request like headers, body, etc.
    * @returns {Observable<T>}
    */
    public patch<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<any> {
      return this.http.patch<T>(this.processEndpoint(endPoint), params, options);
    }

    /**
     * DELETE request
     * @param {string} endPoint end point of the api
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public delete<T>(endPoint: string, options?: IRequestOptions): Observable<any> {
      return this.http.delete<T>(this.processEndpoint(endPoint), options);
    }
    public getTranslation(lang: string): Observable<Object> {
        return this.http.get('./assets/i18n/' + lang + '.json');
    }
    public getJsonFile(url): Observable<Object> {
        return this.http.get(url);
    }
    postFile(fileToUpload: File, endPoint): Observable<boolean> {
        // const endpoint = 'your-destination-url';
        const getHeaders: HttpHeaders = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const formData: FormData = new FormData();
        formData.append('pic', fileToUpload, 'pic');
        return this.post(endPoint, formData, { headers: getHeaders });
    }
}

export function HttpClientServiceCreator(http: HttpClient, injector: Injector) {
    return new HttpClientService(http, injector);
}
