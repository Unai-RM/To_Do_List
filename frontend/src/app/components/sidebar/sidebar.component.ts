import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  action?: () => void;
  showForRoles: number[]; // 0=superadmin, 1=empresa, 2=gestor, 3=usuario
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentUser: any;
  menuItems: MenuItem[] = [];
  showLogoutModal: boolean = false;

  allMenuItems: MenuItem[] = [
    {
      label: 'Kanban',
      icon: 'fas fa-columns',
      route: '/kanban',
      showForRoles: [1, 2, 3] // empresa, gestor, usuario (NO superadmin)
    },
    {
      label: 'Usuarios',
      icon: 'fas fa-users',
      route: '/users',
      showForRoles: [0, 1, 2] // superadmin, empresa, gestor (NO usuario)
    },
    {
      label: 'Configuración',
      icon: 'fas fa-cog',
      route: '/settings',
      showForRoles: [0, 1, 2, 3] // todos los roles
    },
    {
      label: 'Cerrar Sesión',
      icon: 'fas fa-power-off',
      action: () => this.openLogoutModal(),
      showForRoles: [0, 1, 2, 3] // todos los roles
    }
  ];

  constructor(
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.updateMenuLabels();
    this.filterMenuByRole();
  }

  updateMenuLabels(): void {
    // Si es superadmin, cambiar "Usuarios" por "Empresas"
    if (this.currentUser && this.currentUser.role === 0) {
      const usersMenuItem = this.allMenuItems.find(item => item.label === 'Usuarios');
      if (usersMenuItem) {
        usersMenuItem.label = 'Empresas';
      }
    }
  }

  filterMenuByRole(): void {
    if (!this.currentUser || this.currentUser.role === undefined) {
      this.menuItems = [];
      return;
    }

    this.menuItems = this.allMenuItems.filter(item => 
      item.showForRoles.includes(this.currentUser.role)
    );
  }

  navigate(item: MenuItem): void {
    if (item.action) {
      item.action();
    } else if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isActive(route?: string): boolean {
    if (!route) return false;
    return this.router.url === route;
  }

  getRoleName(role: number): string {
    const roles: { [key: number]: string } = {
      0: 'Superadmin',
      1: 'Empresa',
      2: 'Gestor',
      3: 'Usuario'
    };
    return roles[role] || 'Usuario';
  }
}
