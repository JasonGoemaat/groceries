/**
 * Helper to make icons more easily usable.   Icons used anywhere in the app
 * should be imported here.
 */
import { close } from 'flowbite-angular/icon/outline/general';
import { provideIcons } from '@ng-icons/core';

export const icons = {
    close,
}

export const useIcons = provideIcons;
