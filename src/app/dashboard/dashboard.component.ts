import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosEgresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private IngresoEgresoService: IngresoEgresoService
    
    
  ) { }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
    .pipe(filter(auth => auth.user != null))
    .subscribe(({user}) => {
      console.log(user);
      this.ingresosEgresosSubs = this.IngresoEgresoService.initIngresosEgresosListener(user.uid)
      .subscribe(ingresosEgresosFB => {
        this.store.dispatch(ingresoEgresoActions.setItems({items: ingresosEgresosFB }));
      } );
  })
}

  ngOnDestroy(){
    this.ingresosEgresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
    

  }


}
