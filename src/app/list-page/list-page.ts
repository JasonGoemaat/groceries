import { Component, WritableSignal, Signal, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, LocalGroceryList } from '../data-service';
import { GroceryList, GroceryListItem } from '../grocery-list-service';
import { ErrorService } from '../error-service';
import { LiveCollection } from '../Live';
import { HeaderComponent } from '../header-component/header-component';
import { Button } from 'flowbite-angular/button';
import { Table, TableBody } from 'flowbite-angular/table';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

// INFO: Icons
// see: https://ng-icons.github.io/ng-icons/#/browse-icons?iconset=tablerBrandGoogle
// Clicking on set shows 'Package' you need to add above the search box which
// is in the import.   If not added, you need to add the group using npm.
// Example, I click 'Material Icons' and want to add matCheckBoxRound and matCheckBoxOutlineBlankRound.
// I need to install '@ng-icons/material-icons' for that group of icons
//    npm i @ng-icons/material-icons
// I need to add an import to my typescript:
//    import { matCheckBoxRound, matCheckBoxOutlineBlankRound } from '@ng-icons/material-icons/round'
// i.e. 'Material Icons' I run `npm i @ng-icons/material-icons/outline`
import { Icon } from 'flowbite-angular/icon';
import { close } from 'flowbite-angular/icon/outline/general';
import { provideIcons } from '@ng-icons/core';
import { matCheckBoxRound, matCheckBoxOutlineBlankRound } from '@ng-icons/material-icons/round';
import { matIndeterminateCheckBox } from '@ng-icons/material-icons/baseline';
import { bootstrapSoundwave } from '@ng-icons/bootstrap-icons';
import { RecentItems } from './recent-items/recent-items';
import { ShareModal } from '../reusable/share-modal/share-modal';

@Component({
  selector: 'app-list-page',
  imports: [
    HeaderComponent,
    Button,
    Table,
    TableBody,
    FormsModule,
    Icon,
    ShareModal,
    RecentItems,
  ],
  templateUrl: './list-page.html',
  styleUrl: './list-page.css',
  providers: [provideIcons({
    close,
    matCheckBoxRound, matCheckBoxOutlineBlankRound, matIndeterminateCheckBox,
    bootstrapSoundwave,
  })]
})
export class ListPage {
  // to focus element
  @ViewChild('itemName') inputElement!: ElementRef;
  @ViewChild('recentItems') recentItemsComponent!: RecentItems;
  @ViewChild('shareModal') shareModal!: ShareModal;

  // properties to signal id and list and when we have locally and remotely
  isLoading: WritableSignal<boolean> = signal(true);
  haveLocal: WritableSignal<boolean> = signal(false);
  haveRemote: WritableSignal<boolean> = signal(false);
  local?: WritableSignal<LocalGroceryList>;
  remote?: WritableSignal<GroceryList>;
  id: WritableSignal<string> = signal('UNKNOWN');

  // properties to handle items for associated list
  haveItems: WritableSignal<boolean> = signal(false);
  itemsCollection?: LiveCollection<GroceryListItem>;
  activeItems?: Signal<GroceryListItem[]>;
  archivedItems?: Signal<GroceryListItem[]>;

  // adding new item
  isAddingItem: WritableSignal<boolean> = signal(true); // in case we want to toggle
  addingItemName = signal('');

  // busy when performing operatoins, disables controls
  isBusy: WritableSignal<boolean> = signal(false);

  // url for dialog when share button is pressed
  listUrl: WritableSignal<string> = signal('');
  
  public constructor(
    public route: ActivatedRoute,
    public dataService: DataService,
    public errorService: ErrorService,
  ) {
    // get 'id' parameter, error if none found
    const foundId = route.snapshot.paramMap.get('id');
    if (!foundId) {
      this.errorService.replacePage("List Not Found", "There is no 'id' present in the url '/list/:id', you shouldn't be here :)")
      return;
    }
    const knownId = `${foundId}`;
    this.id.set(knownId);

    // set share url, using environment variable if specified or current url
    if (environment.SHARE_BASE_URL) {
      this.listUrl.set(`${environment.SHARE_BASE_URL}/lists/${foundId}`)
    } else {
      // not overridden, use actual location we're on
      this.listUrl.set(location.href);
    }

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
      const list = <GroceryList>(record as any);
      this.remote = signal(list);
      this.haveRemote.set(true);
      const newList = this.dataService.upsertList(list);
      this.local = signal(newList);
      this.haveLocal.set(true);

      const filter = `listId = "${knownId}"`;
      this.itemsCollection = new LiveCollection(dataService, "listItems", filter);
      this.activeItems = computed<GroceryListItem[]>(() => {
        // TODO: sort here?  what by?
        const filtered = this.itemsCollection?.items().filter(x => !x.archived) || [];
        filtered.sort((a, b) =>
        {
          return b.sortDate - a.sortDate;
        });
        return filtered;
      })
      this.archivedItems = computed<GroceryListItem[]>(() => {
        // TODO: sort here - most recently updated first?
        return this.itemsCollection?.items().filter(x => x.archived) || [];
      })
    }).catch(reason => {
      this.errorService.replacePage("List Not Found", `There was an error fetching the list with id '${knownId}' from the server`, `${reason}`);
    })
  }

  public onVoiceClicked() {
    // 1. Initialize the API (with vendor prefix fallback)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    console.log('recognition:', recognition);

    // 2. Handlers
    const onSpeechResult = (event: any) => {
      console.log('SPEECH RECOGNITION RESULTS:', event.results);
      const transcript = event.results[0][0].transcript;
      console.log('Recognized text:', transcript);
      this.addItem(transcript);
      // TODO: Stop listening?   Destroy object?
    };

    const onSpeechStart = (event: any) => {

    };

    // 3. Configure settings
    recognition.lang = 'en-US'; // Set recognition language
    recognition.continuous = false; // Stop after one phrase
    recognition.interimResults = false; // Only return final results
    recognition.onaudiostart = onSpeechStart;
    recognition.onresult = onSpeechResult;

    // 4. Start listening
    recognition.start();
  }

  public async toggleDone(item: GroceryListItem) {
    try {
      this.isBusy.set(true);
      console.log(`toggling done for item '${item.id}', currently ${item.done}`)
      const result = await this.dataService.updateItem(item.id, { done: !item.done });
      console.log('result:', result);
      this.isBusy.set(false);
    } catch (error) {
      this.isBusy.set(false);
      this.errorService.replacePage("An Error Occurred", "archiving item failed", `${error}`);
    }
  }

  public isAddValid() {
    return this.addingItemName().length >= 2 && this.addingItemName().length <= 80;
  }

  /**
   * Helper used by adding with the text box or voice button
   */
  public async addItem(itemName: string) : Promise<GroceryListItem | undefined> {
    if (itemName.length < 2 || itemName.length > 80) {
      this.errorService.alert("Name must be between 2 and 80 characters");
    }

    this.isBusy.set(true);
    if (this.remote && this.archivedItems && this.activeItems) {
      try {
        const found = this.archivedItems().find(x => x.itemName.toLocaleLowerCase() == itemName.toLocaleLowerCase())
        if (found) {
          var updatedItem = await this.dataService.updateItem(found.id, { archived: false, done: false, sortDate: Date.now() })
          this.isBusy.set(false);
          return updatedItem;
        } else  {
          const foundActive = this.activeItems().find(x => x.itemName.toLocaleLowerCase() == itemName.toLocaleLowerCase())
          if (foundActive) {
            this.errorService.alert(`Item exists: '${itemName}`)
            this.addingItemName.set('');
            return undefined;
          }
          const addedItem = await this.dataService.addItem(this.remote().id || '', itemName)
          this.isBusy.set(false);
          return <GroceryListItem>(<any>addedItem);
        }
      } catch (error) {
        this.isBusy.set(false);
        this.errorService.replacePage("An Error Occurred", "adding item to database failed", `${error}`);
        return undefined;
      }
    } else {
      this.isBusy.set(false);
      this.errorService.replacePage("An Error Occurred", "'remote' object not set, that's odd!");
      return undefined;
    }
  }

  public async archiveItem(item: GroceryListItem) : Promise<GroceryListItem | undefined> {
    try {
      this.isBusy.set(true);
      const result = await this.dataService.updateItem(item.id, { archived: true, sortDate: Date.now() });
      this.isBusy.set(false);
      return <GroceryListItem>(<any>result);
    } catch (error) {
      this.isBusy.set(false);
      this.errorService.replacePage("An Error Occurred", "archiving item failed", `${error}`);
      return undefined;
    }
  }

  public focusAddingItemName() {
    this.addingItemName.set('');
    this.inputElement.nativeElement.focus();
  }

  /**
   * When 'add' is clicked, use text from input control and add a new item.
   * If item is in archived list already, just unarchive it.
   */
  public async onAddClicked() {
    console.log(`onAddClicked() - start, name = '${this.addingItemName()}'`)
    this.isBusy.set(true);
    if (this.archivedItems) {
      const found = this.archivedItems().find(x => x.itemName.toLocaleLowerCase() == this.addingItemName().toLocaleLowerCase())
      if (found) {
        console.log(`onAddClicked() - found in archivedItems, updating:`, found)
        this.dataService.updateItem(found.id, { archived: false, done: false, sortDate: Date.now() })
        this.addingItemName.set('');
        this.focusAddingItemName();
        return;
      }
    }
    this.addItem(this.addingItemName());
    this.addingItemName.set('');
  }

  public onEditClicked() {
    // TODO: open edit dialog or navigate to edit page
    console.log('onEditClicked()');
  }

  public onShareClicked() {
    this.shareModal.show();
  }

  /**
   * Finish list, mark all active items as archived.
   */
  public onFinishClicked() {
    if (this.activeItems) {
      const promises = this.activeItems().map(item => {
        return this.dataService.updateItem(item.id, { archived: true, sortDate: Date.now() });
      })
      Promise.all(promises).then(x => {
        console.log('Archived all active items in list');
      })
    }
  }

  /**
   * TODO: call from edit maybe
   */
  public onDelete() {
    // TODO: confirm delete (confirm() or dialog?), delete items then list
    // Maybe leave on server but just delete from local lists, possibly
    // store recent list of local ones and have link on home page to 
    // add them back?
    console.log('onDelete()');
  }

  public showRecentItems() {
    console.log('showRecentItems()');
    if (this.recentItemsComponent) {
      console.log('showRecentItems() - opening dialog');
      this.recentItemsComponent.show();
    } else {
      console.log('showRecentItems() - component not defined');
    }
  }

  public haveArchivedItems() : boolean {
    if (this.archivedItems && this.archivedItems().length > 0) {
      return true;
    }
    return false;
  }
}
