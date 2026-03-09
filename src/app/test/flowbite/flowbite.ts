import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'flowbite-angular/button';

@Component({
  selector: 'app-flowbite',
  imports: [RouterLink, Button],
  templateUrl: './flowbite.html',
  styleUrl: './flowbite.css',
})
export class Flowbite {

}
