import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'tab1',
        loadComponent: () => import('./components/tab-content/tab-content.component').then(mod => mod.TabContentComponent)
    },
    {
        path: 'tab2',
        loadComponent: () => import('./components/tab-content2/tab-content2.component').then(mod => mod.TabContent2Component)
    },
    {
        path: '',
        redirectTo: '/tab1',
        pathMatch: 'full'
    },
];
