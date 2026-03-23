/**
 * Helper to make icons more easily usable.   Icons used anywhere in the app
 * should be imported here.
 */
import { close } from 'flowbite-angular/icon/outline/general';
import { matMenu } from '@ng-icons/material-icons/baseline';
import { provideIcons } from '@ng-icons/core';

export const icons = {
    close, matMenu,
}

export const useIcons = provideIcons;
export const useAllIcons = () => provideIcons(icons);

