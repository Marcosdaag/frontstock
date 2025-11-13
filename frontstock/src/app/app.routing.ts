// Modulos del router
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Componentes
import { Login } from './components/login/login';
import { Products } from './components/products/products';
import { Orders } from './components/orders/orders';
import { Contact } from './components/contact/contact';
import { Managment } from "./components/managment/managment";
import { AuthGuard } from './auth/auth.guard';

const appRoutes: Routes = [
    { path: '', component: Login },
    {
        path: 'managment',
        component: Managment,
        canActivate: [AuthGuard],
        children: [
            { path: 'products', loadComponent: () => import('./components/products/products').then(m => m.Products) },
            { path: 'orders', loadComponent: () => import('./components/orders/orders').then(m => m.Orders) },
        ]
    },
    { path: 'contact', component: Contact },
    { path: '**', component: Login }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(appRoutes);