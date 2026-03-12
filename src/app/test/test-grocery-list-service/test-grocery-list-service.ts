import { Component, signal, WritableSignal } from '@angular/core';
import { GroceryList, GroceryListItem, GroceryListService } from '../../grocery-list-service';
import { Button } from 'flowbite-angular/button';
import { LiveCollection } from '../../Live';
import { DataService } from '../../data-service';
import { TGLSGroceryList } from './tglsgrocery-list/tglsgrocery-list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-test-grocery-list-service',
  imports: [Button, TGLSGroceryList, RouterLink],
  templateUrl: './test-grocery-list-service.html',
  styleUrl: './test-grocery-list-service.css',
  providers: [GroceryListService, DataService],
})
export class TestGroceryListService {
  public lists: WritableSignal<GroceryList[]> = signal([]);
  public selectedList: WritableSignal<GroceryList | null> = signal(null);
  public items: WritableSignal<LiveCollection<GroceryListItem> | null> = signal(null);

  // public items: WritableSignal<GroceryListItem[]> = signal([]);

  constructor(
    public dataService: DataService,
    public groceryListService: GroceryListService
  ) {
    groceryListService.getLists().then(result => this.lists.set(result()));
  }

  selectList(list: GroceryList | null) {
    console.log('selecting list', list);
    this.selectedList.set(list);
    const filter = `listId="${this.selectedList()?.id}"`;
    // tried this rule, but it failed:
    //    listId = @request.query.filter.listId
    // trying this now:
    //    @request.query.filter = "listId=\"" + listId + "\""
    // no go, trying this:
    //    @request.query.filter ~ listId
    console.log('filter', filter);
    const live = new LiveCollection<GroceryListItem>(this.dataService, "listItems", filter);
    this.items.set(live);
  }

  addList() {

  }

  clearList() {
    this.selectList(null);
  }

  addItem() {
  }

  onItemUpdated(item: GroceryListItem) {
    console.log("onItemUpdated", item);
  }
}
