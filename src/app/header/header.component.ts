import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn: boolean = false; // État de connexion

  constructor(private router: Router) {}

  toggleLogin() {
    if (this.isLoggedIn) {
      // Déconnexion
      this.isLoggedIn = false;
      this.router.navigate(['/login']); // Rediriger vers la page de connexion
    } else {
      // Connexion
      this.isLoggedIn = true;
      this.router.navigate(['/admin']); // Rediriger vers la page admin
    }
  }
}