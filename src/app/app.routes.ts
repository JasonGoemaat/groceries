import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';

export const routes: Routes = [
    {
        path: '',
        component: HomePage,
    },
    {
        path: 'about',
        loadComponent: () => import('./about-page/about-page').then(m => m.AboutPage),
    },
];
