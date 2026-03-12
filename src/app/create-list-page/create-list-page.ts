import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header-component/header-component';
import { DataService } from '../data-service';
import { FormControl, FormField, Helper, Label } from 'flowbite-angular/form';
import { Button } from 'flowbite-angular/button';
import { ErrorService } from '../error-service';

@Component({
  selector: 'app-create-list-page',
  imports: [HeaderComponent, FormField, Label, FormControl, Helper, Button, FormsModule],
  templateUrl: './create-list-page.html',
  styleUrl: './create-list-page.css',
})
export class CreateListPage {
  name: WritableSignal<string> = signal('');
  alias: WritableSignal<string> = signal('');
  description: WritableSignal<string> = signal('');
  isBusy: WritableSignal<boolean> = signal(false);

  public constructor(
    public dataService: DataService,
    public errorService: ErrorService,
  ) {
  }

  onSubmit() {
    this.isBusy.set(true);
    this.dataService.createList(this.name(), this.alias(), this.description())
    .then(result => {
      console.log('navigated away (I hope)')
    }).catch(error => {
      this.errorService.replacePage("Error Creating Grocery List", `${error}`)
    })
    console.log('you submitted:', { name: this.name(), alias: this.alias() });
  }
}
