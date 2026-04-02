import { Component, WritableSignal, signal } from '@angular/core';
import { DataService, LocalGroceryList } from '../data-service';
import { RouterLink } from '@angular/router';
import { Button } from 'flowbite-angular/button';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, Button],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  providers: [DataService],
})
export class HomePage {
  lists: WritableSignal<LocalGroceryList[]> = signal([]);

  public constructor(public dataService: DataService) {
    this.lists.set(dataService.getLocal());
  }

  public addList() {
    console.log("HomePage component addList() called")
  }
}
