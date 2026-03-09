import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Test } from './test/test';

export const routes: Routes = [
    { path: '', component: HomePage, },
    { path: 'about', loadComponent: () => import('./about-page/about-page').then(m => m.AboutPage), },
    { path: 'test', component: Test, },
    { path: 'test/grocery-list-service', loadComponent: () => import('./test/test-grocery-list-service/test-grocery-list-service').then(m => m.TestGroceryListService), },
];
