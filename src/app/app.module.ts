import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { HomeComponent } from './home/home.component';
import { LoderComponent } from './loder/loder.component';
import { NotfoundComponent } from './notfound/notfound.component';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FormsModule } from '@angular/forms';
import { MapComponent } from './map/map.component'; 


@NgModule({
  declarations: [
    AppComponent,
    WelcomepageComponent,
    HomeComponent,
    LoderComponent,
    NotfoundComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    LeafletModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
