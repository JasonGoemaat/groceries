import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { GroceryList, GroceryListService } from '../../grocery-list-service';

@Component({
  selector: 'app-test-grocery-list-service',
  imports: [],
  templateUrl: './test-grocery-list-service.html',
  styleUrl: './test-grocery-list-service.css',
  providers: [GroceryListService],
})
export class TestGroceryListService {
  public lists: WritableSignal<GroceryList[]> = signal([]);
  public list: Signal<GroceryList | null> = signal(null);

  constructor(public groceryListService: GroceryListService) {
    groceryListService.getLists().then(result => this.lists.set(result()));
  }

  selectList(list: GroceryList, event: MouseEvent) {
    event.preventDefault();
    console.log('selecting list', list);
  }

  addItem() {
  }
}
