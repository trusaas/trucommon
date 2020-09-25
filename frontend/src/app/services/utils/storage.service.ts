import { Injectable } from '@angular/core';
@Injectable({
  providedIn:'root'
})
export class StorageService {


  constructor() { }

  getSessionItem(key, json?: boolean) {
    if (json) {
      return JSON.parse(localStorage.getItem(key));
    } else {
      return localStorage.getItem(key);
    }

  }

  setSessionItem(key, data, json?: boolean) {
    let result = data;
    if (json) {
      result = JSON.stringify(data);
    }
    localStorage.setItem(key, result);
  }

  removeSessionItem(key) {
    localStorage.removeItem(key);
  }


  getLocalItem(key, json?: boolean) {
    if (json) {
      return JSON.parse(localStorage.getItem(key));
    } else {
      return localStorage.getItem(key);
    }

  }

  setLocalItem(key, data, json?: boolean) {
    let result = data;
    if (json) {
      result = JSON.stringify(data);
    }
    localStorage.setItem(key, result);
  }

  removeLocalItem(key) {
    localStorage.removeItem(key);
  }

}
