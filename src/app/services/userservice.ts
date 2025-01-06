import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/Users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8087/api/users'; // Ajustez l'URL selon votre configuration

  constructor(private http: HttpClient) { }

  // Création d'un utilisateur
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(response => console.log('Utilisateur créé:', response)),
      catchError(this.handleError)
    );
  }

  // Récupération de tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      tap(users => console.log('Utilisateurs récupérés:', users)),
      catchError(this.handleError)
    );
  }

  // Récupération d'un utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Réponse API:', response)) // Pour déboguer
    );
  }

  // Mise à jour d'un utilisateur
  updateUser(id: number, user: Omit<User, 'id'>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      tap(updatedUser => console.log('Utilisateur mis à jour:', updatedUser)),
      catchError(this.handleError)
    );
  }

  // Suppression d'un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log('Utilisateur supprimé, id:', id)),
      catchError(this.handleError)
    );
  }

  // Connexion utilisateur
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => console.log('Réponse login:', response)),
      catchError(this.handleError)
    );
  }

  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 404:
          errorMessage = 'Ressource non trouvée';
          break;
        case 401:
          errorMessage = 'Non autorisé';
          break;
        case 403:
          errorMessage = 'Accès refusé';
          break;
        case 409:
          errorMessage = 'Conflit - Cette ressource existe déjà';
          break;
        default:
          errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}