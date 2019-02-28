import { AuthService } from '../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    model: any;
    errorMessage: any;
    registerMode = false;

    constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
        username: ['',Validators.required],
        password: ['', Validators.required]
      });
    }

    get f() { return this.loginForm.controls; }

    onSubmit() {
      this.submitted = true;

      if (this.loginForm.invalid) {
        return;
      }
      
      this.loading = true;
      this.authService.login(this.f.username.value , this.f.password.value)
        .pipe(first())
        .subscribe(
            next => {
                this.loading = false;
            }, error => { 
                this.errorMessage = error.error;
                this.loading = false;
                return;
          });
    }

    loggedIn() {
        return this.authService.loggedIn();
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.authService.decodedToken = null;
    }

    register() {
        this.registerMode = true;
    }

    cancelRegister(registerMode: boolean) {
        this.registerMode = registerMode;
    }
}
