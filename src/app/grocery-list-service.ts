import { Injectable, signal, Signal } from '@angular/core';
import PocketBase, { UnsubscribeFunc } from "pocketbase";
import { DataService } from './data-service';

export interface GroceryList {
  id?: string;
  name: string;
  description: string;
  created?: Date;
  updated?: Date;
}

export interface GroceryListItem {
  id: string;
  listId: string;
  itemName: string;
  quantity: string;
  done: boolean;
  archived: boolean;
  sortDate: number;
  created: number;
  updated: number;
}

let sampleGroceryLists: GroceryList[] = [
  { id: '1', name: 'Weekly Groceries', description: 'Groceries for the week' },
  { id: '2', name: 'Party Supplies', description: 'Items needed for the party' },
];

let sampleGroceryListItems: GroceryListItem[] = [
{ id: '1', listId: '1', itemName: 'Milk', quantity: '2', done: false, archived: false, sortDate: Date.now(), created: Date.now(), updated: Date.now() },
  { id: '2', listId: '1', itemName: 'Bread', quantity: '1', done: false, archived: false, sortDate: Date.now(), created: Date.now(), updated: Date.now() },
  { id: '3', listId: '1', itemName: 'Chicken', quantity: '2', done: false, archived: false, sortDate: Date.now(), created: Date.now(), updated: Date.now() },
  { id: '4', listId: '1', itemName: 'Sauce', quantity: '1', done: false, archived: false, sortDate: Date.now(), created: Date.now(), updated: Date.now() },
];

@Injectable({
  providedIn: 'root',
})
export class GroceryListService {
  constructor(public dataService: DataService) {
  }

  lists: Signal<GroceryList[]> = signal(sampleGroceryLists);
  items: Signal<GroceryListItem[]> = signal(sampleGroceryListItems);

  async getLists(): Promise<Signal<GroceryList[]>> {
    // TODO: fetch lists from LocalStorage
    const rawLists = await this.dataService.pb.collection("lists").getFullList();
    return signal(<GroceryList[]><unknown>rawLists);
  }

  createList(name: string, description: string) {
    // TODO: add list and update localStorage, maybe PocketBase
    const newList: GroceryList = {
      name,
      description,
    };
  }

  deleteList(id: string) {
    // TODO: delete list and update localStorage, maybe PocketBase
  }

  getListItems(listId: string) {
    // TODO: fetch items from PocketBase and subscribe to changes, return
    // an object with the 'unsub' function returned from subscribe() and a
    // signal with the list items
  }

  addListItem(listId: string, name: string, quantity: number) {
    // TODO: add item to PocketBase
  }

  archiveListItem(listId: string, itemId: string) {
    // TODO: archive item from PocketBase - set archived flag to true,
    // but don't delete it, so we can show archived items in the UI and
    // allow unarchiving
  }

  deleteListItem(listId: string, itemId: string) {
    // TODO: delete item from PocketBase
  }
}

export class GroceryListItems {
  public items: Signal<GroceryListItem[]> = signal(sampleGroceryListItems);
  protected internalItems: GroceryListItem[] = sampleGroceryListItems;
  protected internalUnsub? : void | UnsubscribeFunc; 

  constructor(public groceryList: GroceryList, public dataService: DataService) {
    this.init();
  }

  async init() {
    const filter = `DERP=="${this.groceryList.id}"`;
    this.dataService.pb.collection("listItems").getFullList({
      filter: filter
    }).catch((error) => {
      console.error(error);
    });

    this.internalUnsub = await this.dataService.pb.collection("listItems").subscribe("*", (result) => {
      console.log(result);
    }, {
      filter: filter,
    }).catch((error: any) => {
      console.error(error);
    });
  }

  unsub() {
    if (this.internalUnsub) {
      this.internalUnsub();
    }
  }
}