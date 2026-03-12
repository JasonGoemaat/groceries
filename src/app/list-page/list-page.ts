import { Component, WritableSignal, Signal, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, LocalGroceryList } from '../data-service';
import { GroceryList, GroceryListItem } from '../grocery-list-service';
import { ErrorService } from '../error-service';
import { LiveCollection } from '../Live';
import { HeaderComponent } from '../header-component/header-component';
import { Button } from 'flowbite-angular/button';
import { Table, TableBody } from 'flowbite-angular/table';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-page',
  imports: [HeaderComponent, Button, Table, TableBody, FormsModule],
  templateUrl: './list-page.html',
  styleUrl: './list-page.css',
})
export class ListPage {
  // properties to signal id and list and when we have locally and remotely
  isLoading: WritableSignal<boolean> = signal(true);
  haveLocal: WritableSignal<boolean> = signal(false);
  haveRemote: WritableSignal<boolean> = signal(false);
  local?: WritableSignal<LocalGroceryList>;
  remote?: WritableSignal<GroceryList>;
  id?: WritableSignal<string>;

  // properties to handle items for associated list
  haveItems: WritableSignal<boolean> = signal(false);
  itemsCollection?: LiveCollection<GroceryListItem>;
  activeItems?: Signal<GroceryListItem[]>;
  archivedItems?: Signal<GroceryListItem[]>;

  // adding new item
  isAdding: WritableSignal<boolean> = signal(false);
  addingName: string = '';
  
  public constructor(
    public route: ActivatedRoute,
    public dataService: DataService,
    public errorService: ErrorService,
  ) {
    // get 'id' parameter, error if none found
    const foundId = route.snapshot.paramMap.get('id');
    if (!foundId) {
      this.errorService.replacePage("List Not Found", "There is no 'id' present in the url '/list/:id', you shouldn't be here :)")
    }
    const knownId = `${foundId}`;
    this.id = signal(knownId);

    // see if we have the list locally already
    const foundLocal = dataService.getLocal().find(x => x.id === foundId);
    if (foundLocal) {
      this.local = signal(foundLocal);
      this.haveLocal.set(true);
    }

    // find the list on the server
    console.log(`fetching id '${knownId}' from collection 'lists'`);
    this.dataService.pb.collection("lists").getOne(knownId)
    .then(record => {
      console.log(`received:`, record);
      const list = <GroceryList>(record as any);
      this.remote = signal(list);
      console.log('set remote to:', list);
      this.haveRemote.set(true);
      console.log('set haveRemote to true');
      this.dataService.upsertList(list);
      console.log('upserted list');

      const filter = `listId = "${knownId}"`;
      this.itemsCollection = new LiveCollection(dataService, "listItems", filter);
      this.activeItems = computed<GroceryListItem[]>(() => {
        // TODO: sort here?  what by?
        return this.itemsCollection?.items().filter(x => !x.archived) || [];
      })
      this.archivedItems = computed<GroceryListItem[]>(() => {
        // TODO: sort here - most recently updated first?
        return this.itemsCollection?.items().filter(x => x.archived) || [];
      })
    }).catch(reason => {
      this.errorService.replacePage("List Not Found", `There was an error fetching the list with id '${knownId}' from the server`, `${reason}`);
    })
  }

  public onAddClicked() {
    console.log('onAddClicked()');
    if (this.isAdding()) {
      this.addingName = '';
      this.isAdding.set(false);
      console.log('onAddClicked() - isAdding set to FALSE');
      return;
    }
    this.addingName = '';
    this.isAdding.set(true);
    console.log('onAddClicked() - isAdding set to TRUE');
  }

  public onVoiceClicked() {
    // 1. Initialize the API (with vendor prefix fallback)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    console.log('recognition:', recognition);

    // 2. Configure settings
    recognition.lang = 'en-US'; // Set recognition language
    recognition.continuous = false; // Stop after one phrase
    recognition.interimResults = false; // Only return final results

    // 3. Start listening
    recognition.start();

    // 4. Handle results
    recognition.onresult = (event: any) => {
      console.log('SPEECH RECOGNITION RESULTS:', event.results);
      const transcript = event.results[0][0].transcript;
      console.log('Recognized text:', transcript);
    };
  }

  public toggleDone(item: GroceryListItem, event: Event) {
    console.log('toggleDone()', item);
  }

  public archiveItem(item: GroceryListItem) {
    console.log('archiveItem()', item);
  }

  public addItem(name: string) {
    
  }
}
