import { Injectable } from '@angular/core';
import { GroceryList } from './grocery-list-service';

export const GroceryListsKey = 'grocery-lists';

@Injectable({
  providedIn: 'root',
})
export class Groceries {
  public async fetchLists(): Promise<GroceryList[]> {
    const json = localStorage.getItem(GroceryListsKey);
    if (!json) {
      return Promise.resolve([]);
    }
    try {
      let lists = JSON.parse(json);
      lists.forEach((list: GroceryList) => {
        if (typeof list.created === 'string') {
          const oldCreatedAt = list.created;
          list.created = new Date(list.created);
        }
        if (typeof list.updated === 'string') {
          list.updated = new Date(list.updated);
        }
      });
      return Promise.resolve(<GroceryList[]>lists);
    } catch (err) {
      const clear = confirm(`Error parsing groceries from localStorage, delete?\r\n\r\n${err}`);
      if (clear) {
        localStorage.removeItem(GroceryListsKey);
        return Promise.resolve(<GroceryList[]>[]);
      }
      throw err
    }
  }

  public async saveLists(lists: GroceryList[]): Promise<void> {
    const json = JSON.stringify(lists);
    localStorage.setItem(GroceryListsKey, json);
  }
}
