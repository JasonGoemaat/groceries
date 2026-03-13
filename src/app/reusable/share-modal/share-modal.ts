import { Component, inject, input, TemplateRef, viewChild } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { Button } from 'flowbite-angular/button';
import { Modal, ModalContent, ModalFooter, ModalOverlay } from 'flowbite-angular/modal';
import { NgpDialogManager } from 'ng-primitives/dialog';

@Component({
  selector: 'app-share-modal',
  imports: [
    Button,
    Modal,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    QRCodeComponent,
  ],
  templateUrl: './share-modal.html',
  styleUrl: './share-modal.css',
})
export class ShareModal {
  url = input.required<string>();
  public readonly ngpDialogManager = inject(NgpDialogManager);
  public readonly modal = viewChild('dialog', { read: TemplateRef<unknown> });
  
  public show() {
    const modal = this.modal();
    if (modal) {
      this.ngpDialogManager.open(modal);
    }
  }
}
