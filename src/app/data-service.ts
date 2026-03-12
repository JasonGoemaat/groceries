import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import PocketBase from "pocketbase";
import { environment } from '../environments/environment';
import { GroceryList, GroceryListItem } from './grocery-list-service';

export interface LocalGroceryList {
  id: string;
  name: string;
  alias: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // public pb = new PocketBase("https://groceries.goemaat.com");
  public pb = new PocketBase(environment.POCKETBASE_URL);

  public constructor(
    public router: Router
  ) {
  }

  /**
   * Return grocery lists saved in local storage in the browser.   These have
   * a different model and aliases for grocery lists shared with you.
   */
  getLocal(): LocalGroceryList[] {
    const json = localStorage.getItem('groceries:lists');
    let lists = <LocalGroceryList[]>[];
    try {
      if (json) {
        lists = <LocalGroceryList[]>JSON.parse(json);
      }
    } catch (error) {
      console.error('ERROR parsing localStorage "groceries:lists"', error);
      const answer = confirm('Error parsing local storage, clear?  If you answer "No" the app will continue and it will be cleared when you create a new list anyway.');
      if (answer) {
        localStorage.removeItem("groceries:lists");
      }
    }
    return lists;
  }

  /**
   * Async method to create a new list with the given name.  Calls server to
   * add the list which will create a new id and redirects to the list's page.
   */
  async createList(name: string, alias: string = '', description: string = '') {
    const lists = this.getLocal();
    if (lists.find(x => name.toLocaleLowerCase() === x.alias.toLocaleLowerCase())) {
      throw new Error(`Name '${name}' already exists`);
    }
    const record = await this.pb.collection("lists").create({ name, description });
    lists.unshift({ id: record.id, name: (record as any).name, alias: alias || name })
    localStorage.setItem("groceries:lists", JSON.stringify(lists));
    this.router.navigate(["/lists", record.id]);
  }

  /**
   * Synchronous method used when we go to the url for a list we don't have
   * in local storage, add it to local storage as the first with either the
   * given alias.   Lists with no alias will be displayed with the name and
   * show an option to set an alias.
   */
  upsertList(list: GroceryList, alias = ''): LocalGroceryList {
    const lists = this.getLocal();
    const found = lists.find(x => x.id === list.id);
    if (found) {
      return found;
    }
    alias = alias || list.name;
    const localList = { id: `${list.id}`, name: list.name, alias };
    lists.unshift(localList)
    localStorage.setItem("groceries:lists", JSON.stringify(lists));
    return localList;
  }

  /**
   * Add an item as active (not archived).  Returns item, but list page will
   * ignore as it uses LiveCollection to receive updates from the server.
   */
  async addItem(listId: string, itemName: string): Promise<GroceryListItem> {
    console.log(`updateItem('${listId}', '${name}')`);
    const result = await this.pb.collection('listItems').create({ listId, itemName, sortDate: Date.now() });
    console.log('Added item:', result);
    return <GroceryListItem>(<any>result);
  }

  async updateItem(id: string, changes: any): Promise<GroceryListItem> {
    console.log(`updateItem('${id}')`, changes);
    const result = await this.pb.collection('listItems').update(id, changes);
    console.log('updated item:', result);
    return <GroceryListItem>(<any>result);
  }
}
