import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import { firestore } from 'firebase';
import { Subscription } from 'rxjs';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _user: Usuario;

  get user(){
    return this._user;
  }

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) { }

  crearUsuario(nombre: string, email: string, password: string){

   return this.auth.createUserWithEmailAndPassword(email, password)
   .then( ({user}) => {
     const newUser = new Usuario( user.uid, nombre , email);
     return this.firestore.doc(`${ user.uid }/usuario`).set({...newUser});
   });
  }

  login(email: string, password: string){

    return this.auth.signInWithEmailAndPassword(email, password);
   }

   logout(){
     return this.auth.signOut();
   }

   initAuthListener(){
    this.userSubscription =  this.auth.authState.subscribe( fbUser => {
       if (fbUser){
         this.firestore.doc(`${fbUser.uid}/usuario`).valueChanges()
         .subscribe((firestoreUser: any) => {

          const user = Usuario.fromFirebase(firestoreUser);
          this._user = user;
          this.store.dispatch( authActions.setUser({user}) );
           }
         );
       }else{
        this._user = null;
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser() );
        this.store.dispatch( ingresoEgresoActions.unSetItems());
      }
    });
  }

  isAuth(){
     return this.auth.authState.pipe(map( fbUser => fbUser != null ));
   }

}


