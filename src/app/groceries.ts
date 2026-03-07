import { Injectable } from '@angular/core';
import { GroceryList } from './groceries-info';

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
        if (typeof list.createdAt === 'string') {
          const oldCreatedAt = list.createdAt;
          list.createdAt = new Date(list.createdAt);
        }
        if (typeof list.modifiedAt === 'string') {
          list.modifiedAt = new Date(list.modifiedAt);
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
