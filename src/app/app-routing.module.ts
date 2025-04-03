import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { NotfoundComponent } from './notfound/notfound.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [

  { path: '', component: WelcomepageComponent },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  {path: 'map', component: MapComponent, pathMatch: 'full', canActivate: [AuthGuard]},

  { path: '404', component: NotfoundComponent },

  { path: '**',  redirectTo: '404', }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
