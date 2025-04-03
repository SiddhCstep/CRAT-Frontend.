import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from './service/authservice.service';

@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = !!sessionStorage.getItem('jwtToken'); 
    if (!isAuthenticated) {
      this.router.navigate(['404']); 
      return false;
    }
    return true;
  }
}
