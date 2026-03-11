import { Injectable } from '@angular/core';
import PocketBase from "pocketbase";

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public pb = new PocketBase("https://groceries.goemaat.com");
}
