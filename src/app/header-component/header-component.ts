import { Component, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'flowbite-angular/button';
import { Icon } from 'flowbite-angular/icon';
import { icons, useAllIcons } from '@src/my-icons';
import { environment } from '@src/environments/environment';
import {
  provideFlowbiteSidebarState,
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarToggle,
} from 'flowbite-angular/sidebar';

@Component({
  selector: 'app-header-component',
  imports: [RouterLink,
    Button, Icon,
    Sidebar, SidebarContent, SidebarItem, SidebarToggle,
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
  providers: [useAllIcons(), provideFlowbiteSidebarState()],
  host: {
    class: 'flex flex-row',
  },
})
export class HeaderComponent {
  sidebarOpen = signal(false);
  showFlowbite = signal(!environment.production);
  sidebar = ViewChild('sidebar');

  toggleSidebar() {
    this.sidebarOpen.update(oldValue => !oldValue);
  }
}
