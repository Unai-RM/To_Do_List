import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // El servicio se inicializa automáticamente y aplica el tema guardado en la cookie
  }
}
