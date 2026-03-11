import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Theme } from 'flowbite-angular/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  hostDirectives: [Theme],
})
export class App {
  protected isCollapsed = signal(true);
  protected readonly title = signal('groceries');

  ngOnInit(): void {
    initFlowbite();
  }
}
