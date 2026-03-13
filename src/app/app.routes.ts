import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Test } from './test/test';
import { NotFoundPage } from './not-found-page/not-found-page';

export const routes: Routes = [
    { path: '', component: HomePage, },
    { path: 'about', loadComponent: () => import('./about-page/about-page').then(m => m.AboutPage), },
    { path: 'create', loadComponent: () => import('./create-list-page/create-list-page').then(m => m.CreateListPage), },
    { path: 'lists/:id', loadComponent: () => import('./list-page/list-page').then(m => m.ListPage), },
    { path: 'test', component: Test, },
    { path: 'test/flowbite', loadComponent: () => import('./test/flowbite/flowbite').then(m => m.Flowbite), },
    { path: '**', component: NotFoundPage },
];
