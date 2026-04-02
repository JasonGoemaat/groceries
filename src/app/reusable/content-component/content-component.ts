import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  imports: [],
  templateUrl: './content-component.html',
  styleUrl: './content-component.css',
  host: {
    '[class]': "{ 'bg-white': true, 'dark:bg-black': true, 'text-blue-800': true, 'dark:text-blue-200': true }",
    '[style.display]': "'block'",
  }
})
export class ContentComponent {

}
