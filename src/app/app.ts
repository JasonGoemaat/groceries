import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Theme } from 'flowbite-angular/theme-toggle';
import { HeaderComponent } from '@src/app/header-component/header-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
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
