import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { routing } from './app.routing';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './components/login/login';
import { Products } from './components/products/products';
import { Orders } from './components/orders/orders';
import { Contact } from './components/contact/contact';
import { Managment } from './components/managment/managment';

@NgModule({
  declarations: [
    App,
    Login,
    Products,
    Orders,
    Contact,
    Managment
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    AppRoutingModule
  ],
  bootstrap: [App]
})
export class AppModule { }
