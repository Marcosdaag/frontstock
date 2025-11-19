// Modulos del router
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Componentes
import { Login } from './components/login/login';
import { Products } from './components/products/products';
import { Orders } from './components/orders/orders';
import { Contact } from './components/contact/contact';
import { Managment } from "./components/managment/managment";
import { Metrics } from "./components/metrics/metrics";
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from "./guards/login.guard";

const appRoutes: Routes = [
    { path: '', component: Login, canActivate: [LoginGuard] },
    {
        path: 'managment',
        component: Managment,
        canActivate: [AuthGuard],
        children: [
            { path: 'products', component: Products },
            { path: 'orders', component: Orders },
            { path: 'metrics', component: Metrics },
            { path: '', redirectTo: 'products', pathMatch: 'full' }
        ],
    },
    { path: 'contact', component: Contact },
    { path: '**', component: Login }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(appRoutes);