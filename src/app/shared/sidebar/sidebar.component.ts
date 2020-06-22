import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  userName =  "";
  userSubs : Subscription;

  constructor( 
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {

    this.userSubs = this.store.select('user')
    .pipe(
      filter( ({user}) => user != null)
    )
    .subscribe( ({user}) => this.userName = user.nombre );

  }

  ngOnDestroy(){
    this.userSubs.unsubscribe();

  }

  logout(){
    this.authService.logout().then( () => {
      this.router.navigate(['/login']);
    });
  }

}
