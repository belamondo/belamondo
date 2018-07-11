import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  OnChanges
} from '@angular/core';
import {
  MediaMatcher,
  BreakpointObserver,
  Breakpoints
} from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

/**
 * Services
 */
import { AuthenticationService } from './../../services/firebase/authentication.service';
import { CrudService } from './../../services/firebase/crud.service';
import { StrategicDataService } from '../../services/strategic-data.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'topbar-menu',
  templateUrl: './topbar-menu.component.html',
  styleUrls: ['./topbar-menu.component.css']
})
export class TopbarMenuComponent implements OnInit, OnChanges {
  public isStarted: boolean;
  public isProfileChoice: boolean;
  private _mobileQueryListener: () => void;
  public mobileQuery: MediaQueryList;
  public mobile = (typeof window !== 'undefined') ?
  (window.screen.availWidth < 800) :
  true;

  public options: any;
  public user: any;
  public userData: any;

  @Input() params;

  constructor(
    private _auth: AuthenticationService,
    private _crud: CrudService,
    private _router: Router,
    public _snackbar: MatSnackBar,
    private _strategicData: StrategicDataService,
    public breakpointObserver: BreakpointObserver,
    public changeDetectorRef: ChangeDetectorRef,
    public media: MediaMatcher,
  ) {
    this.isStarted = false;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    this
      .mobileQuery
      .addListener(this._mobileQueryListener);

    this.options = {
      fixed: 'fixed', // Define the sidenav style, possible values are 'fixed' and 'Non-fixed'
      opened: !this.mobileQuery.matches, // Possible values are true or false
      mode: 'auto', // Define the sidenav mode, possible values are push, side and over
      top: 56, // Css 'top' from sidenav
      bottom: 0, // Css 'bottom' from sidenav
      userCard: true
    };

    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(mobile => {
      this.options.opened = !mobile.matches;
    });
  }

  ngOnChanges() {
    let checkIfProfileChoice;
    checkIfProfileChoice = this._router.url.split('/');
    this.isProfileChoice = false;

    if (checkIfProfileChoice[checkIfProfileChoice.length - 1] === 'profile_choice') {
      this.isProfileChoice = true;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this
      .mobileQuery
      .removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (!this._strategicData.userData$ && !this.userData) {
      this._strategicData.setUserData()
      .then(userData => {
        this.userData = userData;

        this.isStarted = true;
      });
    } else {
      if (!this.userData) {
        this.userData = this._strategicData.userData$;
        this.isStarted = true;
      }
    }
  }

  logout = () => {
    let params;
    params = {
      navigateTo: '/login'
    };

    this._auth.logout(params);
  }
}
