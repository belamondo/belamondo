import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Services
 */
import { AuthenticationService } from './../services/firebase/authentication.service';
import { CrudService } from '../services/firebase/crud.service';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CrmGuard implements CanActivate {
  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      this._auth.setUser()
      .then(res => {
        if (!res || !res['id']) {
          this._router.navigate(['/']);

          this._snackbar.open('Você precisa logar para entrar.', '', {
            duration: 4000
          })

          return false;
        }
        
        this._crud.read({
          route: 'people',
          whereId: res['id']
        }).then(res => { 
          if (!res[0]) {
            this._router.navigate(['/main/profile_choice'])
          }

          if(!sessionStorage.getItem('documents')) {
            this._crud.read({
              route: 'documents'
            }).then(res => {
              console.log(res)
              sessionStorage.setItem('documents', JSON.stringify(res))
            })
          }
        })
      })

    return true;
  }
}
