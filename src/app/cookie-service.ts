import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class CookieService {
  document = inject(DOCUMENT);
  get(name: string): string | null {
    const matchedRow = this.document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='));
    if (!matchedRow) {
      return null;
    }
    return decodeURIComponent(matchedRow.substring(name.length + 1));
  }

  set(name: string, value: string, days?: number): void {
    let expires = '';
    days = days ?? 730; // 2 year default
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
    this.document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
  }
}
