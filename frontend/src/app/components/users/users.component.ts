import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User, CreateUserData } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  currentUser: any;
  users: User[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  userForm!: FormGroup;
  editingUser: User | null = null;
  userToDelete: User | null = null;
  pageTitle: string = 'Gestión de Usuarios';
  
  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  itemsPerPageOptions: number[] = [5, 10, 25, 50, 100];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.initForm();
    this.loadUsers();
    this.updatePageTitle();
  }

  updatePageTitle(): void {
    // Si es superadmin (rol 0), cambiar título a "Empresas"
    if (this.currentUser && this.currentUser.role === 0) {
      this.pageTitle = 'Gestión de Empresas';
    } else {
      this.pageTitle = 'Gestión de Usuarios';
    }
  }

  initForm(): void {
    this.userForm = this.fb.group({
      nick: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      company_name: [''],
      is_manager: [false]
    });
  }

  loadUsers(): void {
    this.loading = true;
    
    // Si es superadmin (rol 0), solo cargar usuarios con rol empresa (1)
    if (this.currentUser && this.currentUser.role === 0) {
      this.userService.getUsersByRole(1, this.currentUser.id).subscribe({
        next: (users) => {
          this.users = users;
          this.calculateTotalPages();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar empresas:', error);
          this.errorMessage = 'Error al cargar las empresas';
          this.loading = false;
        }
      });
    } else {
      // Para otros roles, cargar todos los usuarios de su empresa
      this.userService.getAllUsers(this.currentUser.id).subscribe({
        next: (users) => {
          this.users = users;
          this.calculateTotalPages();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
          this.errorMessage = 'Error al cargar los usuarios';
          this.loading = false;
        }
      });
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.users.slice(startIndex, endIndex);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onItemsPerPageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
    this.currentPage = 1; // Resetear a la primera página
    this.calculateTotalPages();
  }

  openModal(): void {
    this.editingUser = null;
    this.userForm.reset();
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    
    // Si es superadmin creando empresa, company_name es requerido
    if (this.currentUser && this.currentUser.role === 0) {
      this.userForm.get('company_name')?.setValidators([Validators.required]);
      this.userForm.get('company_name')?.updateValueAndValidity();
    }
    
    this.showModal = true;
    this.errorMessage = '';
  }

  openEditModal(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue({
      nick: user.nick,
      name: user.name,
      surname: user.surname,
      password: '',
      company_name: user.company_name || '',
      is_manager: user.role === 2
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    
    // Si es empresa, company_name es opcional en edición
    if (user.role === 1) {
      this.userForm.get('company_name')?.clearValidators();
      this.userForm.get('company_name')?.updateValueAndValidity();
    }
    
    this.showModal = true;
    this.errorMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUser = null;
    this.userForm.reset();
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.editingUser) {
      // Actualizar usuario existente
      const updateData: Partial<User> = {
        nick: this.userForm.value.nick,
        name: this.userForm.value.name,
        surname: this.userForm.value.surname
      };

      // Solo incluir password si se proporcionó uno nuevo
      if (this.userForm.value.password) {
        updateData.password = this.userForm.value.password;
      }

      // Si es empresa, incluir company_name
      if (this.editingUser.role === 1 && this.userForm.value.company_name) {
        updateData.company_name = this.userForm.value.company_name;
      }

      // Si es gestor o usuario, actualizar rol según checkbox
      if (this.editingUser.role === 2 || this.editingUser.role === 3) {
        updateData.role = this.userForm.value.is_manager ? 2 : 3;
      }

      this.userService.updateUser(this.editingUser.id, updateData).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.loading = false;
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          this.errorMessage = error.error?.message || 'Error al actualizar';
          this.loading = false;
        }
      });
    } else {
      // Crear nuevo usuario
      let role = 3; // Por defecto usuario
      if (this.currentUser.role === 0) {
        role = 1; // Superadmin crea empresas
      } else if (this.userForm.value.is_manager) {
        role = 2; // Empresa/Gestor crea gestor
      }

      const newUserData: CreateUserData = {
        nick: this.userForm.value.nick,
        password: this.userForm.value.password,
        name: this.userForm.value.name,
        surname: this.userForm.value.surname,
        role: role,
        creatorId: this.currentUser.id, // ID del usuario que está creando
        company_name: this.userForm.value.company_name || undefined
      };

      this.userService.createUser(newUserData).subscribe({
        next: (newUser) => {
          this.users.push(newUser);
          this.calculateTotalPages();
          this.loading = false;
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear:', error);
          this.errorMessage = error.error?.message || 'Error al crear usuario';
          this.loading = false;
        }
      });
    }
  }

  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (!this.userToDelete) return;

    this.loading = true;
    this.userService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.userToDelete!.id);
        this.calculateTotalPages();
        this.loading = false;
        this.closeDeleteModal();
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this.errorMessage = error.error?.message || 'Error al eliminar';
        this.loading = false;
        this.closeDeleteModal();
      }
    });
  }

  getRoleName(role: number): string {
    const roles: { [key: number]: string } = {
      0: 'Superadmin',
      1: 'Empresa',
      2: 'Gestor',
      3: 'Usuario'
    };
    return roles[role] || 'Desconocido';
  }

  get nick() { return this.userForm.get('nick'); }
  get password() { return this.userForm.get('password'); }
  get name() { return this.userForm.get('name'); }
  get surname() { return this.userForm.get('surname'); }
  get company_name() { return this.userForm.get('company_name'); }
  get is_manager() { return this.userForm.get('is_manager'); }
}
