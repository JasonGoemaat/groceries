import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public lastErrorTitle: string = '';
  public lastErrorMessage: string = '';
  public lastErrorDetail: string = '';

  public constructor(
    public router: Router,
  ) {
  }

  public setLastError(title: string, message: string, detail: string) {
    this.lastErrorTitle = title;
    this.lastErrorMessage = message;
    this.lastErrorDetail = detail;
  }

  public replacePage(title: string, message: string = '', detail: string = '') {
    this.router.navigate(['error'], {
      skipLocationChange: true,
      // replaceUrl: true, // another option?
    })
  }

  public clear() {
    this.lastErrorTitle = '';
    this.lastErrorMessage = '';
    this.lastErrorDetail = '';
  }
}
