import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'flowbite-angular/button';
import { Card, CardContent, CardHeader } from 'flowbite-angular/card';
import { FormField, Label, FormControl, Helper } from 'flowbite-angular/form';

@Component({
  selector: 'app-flowbite',
  imports: [RouterLink,
    Button,
    Card, CardContent, CardHeader,
    FormField, Label, FormControl, Helper,
  ],
  templateUrl: './flowbite.html',
  styleUrl: './flowbite.css',
})
export class Flowbite {
  public samples = {
    card: `<div flowbiteCard>
    <div flowbiteCardContent>
        <h5 flowbiteCardHeader>Noteworthy technology acquisitions 2021</h5>
        <p>Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
            chronological order.</p>
    </div>
</div>
`,
    form: `<form class="mx-auto max-w-sm">
  <div flowbiteFormField>
    <label flowbiteLabel for="email">Email address</label>
    <input flowbiteFormControl id="email" name="email" placeholder="email@flowbite-angular.com" />
    <p flowbiteHelper>...</p>
  </div>
</form>`,
  }
}

