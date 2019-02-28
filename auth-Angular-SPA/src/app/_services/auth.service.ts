import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { empty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    baseUrl = 'http://127.0.0.1:5080/user/';
    helper = new JwtHelperService();
    decodedToken: any;

    constructor(private http: HttpClient) { }



    login(username: string, password: string) {
      return this.http.post(this.baseUrl + 'authenticate/', {username, password})
        .pipe(map((response: any) => {
            const token = response.token;
            const user = response.username;
            localStorage.setItem('token', token);
            localStorage.setItem('username', user);
            this.decodedToken = this.helper.decodeToken(response.token);
        }));
    }

    register(username: string, password: string) {
        return this.http.post(this.baseUrl + 'register/', {username, password});
    }

    loggedIn() {
        const token = localStorage.getItem('token');
        return !this.helper.isTokenExpired(token);
    }
  
}
