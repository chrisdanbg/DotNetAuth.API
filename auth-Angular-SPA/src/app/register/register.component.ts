import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '../../../node_modules/@angular/forms';
import { AuthService } from '../_services/auth.service';
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegister = new EventEmitter();

    registerForm: FormGroup
    registerMessage: any;
    submitted = false;

    constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    get f() { return this.registerForm.controls; }

    register() {
        this.submitted = true;

        if (this.registerForm.valid) {
            this.authService.register(this.f.username.value, this.f.password.value)
                .subscribe(() => {
                    this.registerMessage = 'User Registered';
                }, error => {
                    console.log(error);
                });
        }
    }

    cancel() {
        this.cancelRegister.emit(false);
    }
}
