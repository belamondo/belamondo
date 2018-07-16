import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MatTableModule, MatPaginatorModule, MatSortModule, MAT_DATE_LOCALE } from '@angular/material';

/**
 * Components
 */
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileChoiceComponent } from './components/profile-choice/profile-choice.component';

/**
 * Modules
 */
import { SharedModule } from './modules/shared/shared.module';

/**
 * Routing
 */
import { AppRoutingModule } from './app-routing.module';

/**
 * Third party
 */

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileChoiceComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
