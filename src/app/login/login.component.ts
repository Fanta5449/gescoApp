import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:3000/api/auth/login', { username: this.username, password: this.password })
      .subscribe(
        (response: any) => {
          if (response.success) {
            this.router.navigate(['/admin']); // Rediriger vers la page admin
          }
        },
        (error) => {
          this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
        }
      );
  }
}