import { Routes } from '@angular/router';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FoodOrderComponent } from './components/food-order/food-order.component';
import { GeolocationComponent } from './components/geolocation/geolocation.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'order',
    },
    {
        path: 'geolocation',
        component: GeolocationComponent
    },
    {
        path: 'feedback',
        component: FeedbackComponent
    },
    {
        path: 'order',
        component: FoodOrderComponent
    }
];
