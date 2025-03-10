import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from '../../models/login';
import { LoginService } from 'src/app/services/login.service';
import { Respuesta } from 'src/app/models/respuesta';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  login: Login = new Login();


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.login = new Login();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nick: ['', [Validators.required, Validators.minLength(3)]],
      password: ['']
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {

      this.login = new Login();
      this.login.nick = this.loginForm.value.nick;
      this.login.password = this.loginForm.value.password;

      this.loginService.doLogin(this.login).subscribe(
        (response: Respuesta) => {
          const token = response.result;
          sessionStorage.setItem('authToken', token);
          this.loginService.setLoggedIn(true);
        },
        (error) => {
          console.error('Error de autenticación:', error);
        }
      );
    } else {
      console.log("Formulario inválido");
    }
    this.router.navigate(['']);
  }

}

