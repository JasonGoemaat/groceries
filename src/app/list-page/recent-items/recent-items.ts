import { Component, input, inject, viewChild, TemplateRef } from '@angular/core';
import { Modal, ModalContent, ModalFooter, ModalOverlay } from 'flowbite-angular/modal';
import { Badge, BadgeButton } from 'flowbite-angular/badge';
import { Button } from 'flowbite-angular/button';
import { GroceryListItem } from '../../grocery-list-service';
import { NgpDialogManager } from 'ng-primitives/dialog';
import { DataService } from '../../data-service';
import { icons, useIcons } from '../../../my-icons';
import { Icon } from 'flowbite-angular/icon';


// SEE: https://flowbite-angular.com/docs/components/modal

@Component({
  selector: 'app-recent-items',
  imports: [Modal, ModalContent, ModalFooter, ModalOverlay, Badge, BadgeButton, Button, Icon],
  templateUrl: './recent-items.html',
  styleUrl: './recent-items.css',
  providers: [useIcons(icons)],
})
export class RecentItems {
  public readonly ngpDialogManager = inject(NgpDialogManager);
  public readonly modal = viewChild('dialog', { read: TemplateRef<unknown> });

  public items = input.required<GroceryListItem[]>();

  public constructor(
    public dataService: DataService,
  ) {}

  public show() {
    const modal = this.modal();
    if (modal) {
      this.ngpDialogManager.open(modal);
    }
    console.log('icons:', icons);
  }

  public unarchiveItem(item: GroceryListItem) {
      this.dataService.updateItem(item.id, { archived: false });
  }

  public deleteItem(item: GroceryListItem) {
    this.dataService.deleteItem(item.id);
  }
}
