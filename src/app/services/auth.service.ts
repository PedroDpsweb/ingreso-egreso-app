import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore
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
     this.auth.authState.subscribe( fbUser => {
       console.log( fbUser );
     });
   }

   isAuth(){
     return this.auth.authState.pipe(map( fbUser => fbUser != null ));
   }

}


