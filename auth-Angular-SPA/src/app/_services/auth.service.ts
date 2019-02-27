import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://127.0.0.1:5080/user/authenticate';

  constructor(private http: HttpClient) { }



  login(username: string, password: string) {
    return this.http.post(this.baseUrl, {username, password})
      .pipe(map((response: any) => {
        console.log(response);
      }));
  }
}
