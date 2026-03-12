import { Component } from '@angular/core';
import { HeaderComponent } from '../header-component/header-component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [HeaderComponent, RouterLink],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.css',
})
export class NotFoundPage {

}
