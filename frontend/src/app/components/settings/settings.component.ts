import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService, Theme } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  themes: Theme[] = [];
  currentTheme: Theme | null = null;
  showThemeSelector = false;
  
  userForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: any = null;
  isEditingUser = false;
  isChangingPassword = false;
  errorMessage = '';
  successMessage = '';
  passwordErrorMessage = '';
  passwordSuccessMessage = '';
  notificationsEnabled = true;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      nick: ['', [Validators.required, Validators.minLength(3)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Configuración de temas
    this.themes = this.themeService.getThemes();
    this.currentTheme = this.themeService.getCurrentTheme();
    
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Cargar datos del usuario actual
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.userForm.patchValue({
        nick: this.currentUser.nick,
        nombre: this.currentUser.nombre,
        apellidos: this.currentUser.apellidos
      });
      this.notificationsEnabled = this.currentUser.notifications_enabled !== false;
    }
  }

  toggleThemeSelector(): void {
    this.showThemeSelector = !this.showThemeSelector;
  }

  selectTheme(themeId: string): void {
    this.themeService.setTheme(themeId);
    this.showThemeSelector = false;
  }

  closeThemeSelector(): void {
    this.showThemeSelector = false;
  }

  enableUserEdit(): void {
    this.isEditingUser = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelUserEdit(): void {
    this.isEditingUser = false;
    this.loadCurrentUser();
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveUserChanges(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const updatedData = this.userForm.value;

    this.userService.updateUser(this.currentUser.id, updatedData).subscribe({
      next: (response) => {
        this.successMessage = 'Datos actualizados correctamente';
        this.isEditingUser = false;
        
        // Actualizar el usuario en el localStorage
        const updatedUser = { ...this.currentUser, ...updatedData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUser = updatedUser;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al actualizar los datos';
      }
    });
  }

  enablePasswordChange(): void {
    this.isChangingPassword = true;
    this.passwordErrorMessage = '';
    this.passwordSuccessMessage = '';
    this.passwordForm.reset();
  }

  cancelPasswordChange(): void {
    this.isChangingPassword = false;
    this.passwordForm.reset();
    this.passwordErrorMessage = '';
    this.passwordSuccessMessage = '';
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      this.passwordErrorMessage = 'Las contraseñas nuevas no coinciden';
      return;
    }

    this.passwordErrorMessage = '';
    this.passwordSuccessMessage = '';

    this.userService.changePassword(this.currentUser.id, currentPassword, newPassword).subscribe({
      next: (response) => {
        this.passwordSuccessMessage = 'Contraseña actualizada correctamente';
        this.isChangingPassword = false;
        this.passwordForm.reset();

        setTimeout(() => {
          this.passwordSuccessMessage = '';
        }, 3000);
      },
      error: (error) => {
        this.passwordErrorMessage = error.error?.message || 'Error al cambiar la contraseña';
      }
    });
  }

  toggleNotifications(): void {
    this.notificationsEnabled = !this.notificationsEnabled;
    
    this.userService.updateNotificationPreferences(this.currentUser.id, this.notificationsEnabled).subscribe({
      next: (response) => {
        // Actualizar en localStorage
        const updatedUser = { ...this.currentUser, notifications_enabled: this.notificationsEnabled };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUser = updatedUser;
      },
      error: (error) => {
        // Revertir el cambio si hay error
        this.notificationsEnabled = !this.notificationsEnabled;
        console.error('Error al actualizar notificaciones:', error);
      }
    });
  }

  get nick() { return this.userForm.get('nick'); }
  get nombre() { return this.userForm.get('nombre'); }
  get apellidos() { return this.userForm.get('apellidos'); }
  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }
}
