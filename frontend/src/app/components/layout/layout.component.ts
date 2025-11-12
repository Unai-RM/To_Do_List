import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  showSidebar: boolean = false;
  currentUser: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    // Mostrar sidebar para todos los roles (0, 1, 2, 3)
    this.showSidebar = this.currentUser && this.currentUser.role !== undefined;
  }
}
