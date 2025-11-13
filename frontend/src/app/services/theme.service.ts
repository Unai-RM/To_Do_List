import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Theme {
  id: string;
  name: string;
  gradient: string;
  preview: string;
  isDark: boolean; // true = tema oscuro (texto blanco), false = tema claro (texto negro)
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly COOKIE_NAME = 'app-theme';
  private readonly COOKIE_DAYS = 365;

  // Temas disponibles
  private themes: Theme[] = [
    {
      id: 'purple',
      name: 'Púrpura Místico',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      isDark: true
    },
    {
      id: 'ocean',
      name: 'Océano Profundo',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      preview: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      isDark: true
    },
    {
      id: 'sunset',
      name: 'Atardecer Cálido',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      preview: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      isDark: true
    },
    {
      id: 'forest',
      name: 'Bosque Esmeralda',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      preview: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      isDark: false
    },
    {
      id: 'fire',
      name: 'Fuego Ardiente',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      preview: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      isDark: true
    },
    {
      id: 'night',
      name: 'Noche Estrellada',
      gradient: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
      preview: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
      isDark: true
    },
    {
      id: 'candy',
      name: 'Dulce Caramelo',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      preview: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      isDark: false
    },
    {
      id: 'royal',
      name: 'Realeza Dorada',
      gradient: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
      preview: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
      isDark: true
    },
    {
      id: 'aurora',
      name: 'Aurora Boreal',
      gradient: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
      preview: 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
      isDark: true
    },
    {
      id: 'peach',
      name: 'Melocotón Suave',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      isDark: false
    }
  ];

  private currentThemeSubject: BehaviorSubject<Theme>;
  public currentTheme$: Observable<Theme>;

  constructor() {
    const savedTheme = this.getThemeFromCookie();
    const initialTheme = savedTheme || this.themes[0];
    this.currentThemeSubject = new BehaviorSubject<Theme>(initialTheme);
    this.currentTheme$ = this.currentThemeSubject.asObservable();
    
    // Aplicar tema inicial
    this.applyTheme(initialTheme);
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find(t => t.id === themeId);
    if (theme) {
      this.currentThemeSubject.next(theme);
      this.saveThemeToCookie(theme);
      this.applyTheme(theme);
    }
  }

  private applyTheme(theme: Theme): void {
    // Aplicar el gradiente al body o a una variable CSS
    document.documentElement.style.setProperty('--app-gradient', theme.gradient);
    
    // Aplicar clase según si el tema es oscuro o claro
    if (theme.isDark) {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
      document.documentElement.classList.add('theme-light');
    }
  }

  private saveThemeToCookie(theme: Theme): void {
    const date = new Date();
    date.setTime(date.getTime() + (this.COOKIE_DAYS * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${this.COOKIE_NAME}=${theme.id};${expires};path=/`;
  }

  private getThemeFromCookie(): Theme | null {
    const name = this.COOKIE_NAME + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        const themeId = cookie.substring(name.length);
        return this.themes.find(t => t.id === themeId) || null;
      }
    }
    return null;
  }
}
