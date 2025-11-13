import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-managment',
  standalone: false,
  templateUrl: './managment.html',
  styleUrl: './managment.css',
})
export class Managment {
  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
