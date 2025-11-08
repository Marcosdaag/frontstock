// Modulos del router
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Componentes
import { Login } from './components/login/login';
import { Products } from './components/products/products';
import { Orders } from './components/orders/orders';
import { Contact } from './components/contact/contact';
import { Managment } from "./components/managment/managment";

const appRoutes: Routes = [
    {path: '', component: Login},
    {path: 'managment', component: Managment},
    {path: 'contact', component: Contact},
    {path: 'products', component: Products},
    {path: 'orders', component: Orders},
    {path: '**', component: Login}
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(appRoutes);