import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreyVsPredatorComponent } from './prey-vs-predator/prey-vs-predator.component';
import { PixiComponent } from './pixi/pixi.component';

@NgModule({
  declarations: [
    AppComponent,
    PreyVsPredatorComponent,
    PixiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
