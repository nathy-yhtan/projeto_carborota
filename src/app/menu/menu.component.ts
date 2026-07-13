import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  menuAberto = false;

  constructor(
    public usuario: UsuarioService,
    private router: Router,
  ) {}

  abrirFecharMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    this.menuAberto = false;
  }

  sair(): void {
    this.usuario.sair();
    this.menuAberto = false;
    this.router.navigateByUrl('/');
  }
}
