import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }

  private loading = false;

  get isLoading() {
    return this.loading;
  }

  set setLoadingStatus(value) {
    this.loading = value;
  }
}
