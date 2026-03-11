import { Component, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Table, TableBody } from 'flowbite-angular/table'
import { GroceryListItem } from '../../../grocery-list-service';

@Component({
  selector: 'app-tglsgrocery-list',
  imports: [Table, TableBody, FormsModule],
  templateUrl: './tglsgrocery-list.html',
  styleUrl: './tglsgrocery-list.css',
})
export class TGLSGroceryList {
  public itemUpdated = output<GroceryListItem>();
  public items = input<GroceryListItem[] | undefined>([]);
  public filtered = computed(() => this.items() ? this.items()?.filter(x => !x.archived) : [])

  public toggleDone(item: GroceryListItem, event: Event) {
    console.log('toggleDone, emitting itemUpdated event:', item);
    this.itemUpdated.emit(item);
  }
}
