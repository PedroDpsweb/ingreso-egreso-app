import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routes';
import { RouterModule, Routes } from '@angular/router';



const rutasHijas: Routes = [
  {
  path: '', 
  component: DashboardComponent,
  children: DashboardRoutes,
  // canActivate: [AuthGuard]},

}
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild( rutasHijas )
  ],
  exports:[
    RouterModule
  ]
})
export class DashBoardRoutesModule { }
