import {
  Injectable
} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import {
  Observable
} from 'rxjs/Observable';

/**
 * Services
 */
import {
  AuthenticationService
} from './../services/firebase/authentication.service';
import {
  CrudService
} from '../services/firebase/crud.service';
import {
  MatSnackBar
} from '@angular/material';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot, state:
    RouterStateSnapshot
  ): Observable < boolean > | Promise < boolean > | boolean {
    this._auth.setUser()
      .then(resUser => {
        let userAssigned,
        userType;

        userAssigned = true;
        userType = '';

        // Check if loggedin before get in module
        if (!resUser || !resUser['id']) {
          this._router.navigate(['/']);

          this._snackbar.open('Você precisa logar para entrar.', '', {
            duration: 4000
          });

          return false;
        }
      });

    return true;
  }
}
