import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  logado = false;
  private CHAVE_STORAGE = 'carborota_usuarios_lista';
  private CHAVE_EMAIL = 'carborota_usuario_email';

  constructor() {
    // LOGIN MESMO SE RECARREGAR
    this.logado = sessionStorage.getItem('carborota_logado') === 'true';
  }

  getUsuarioAtual(): string | null {
    if (!this.logado) {
      return null;
    }

    return sessionStorage.getItem(this.CHAVE_EMAIL);
  }

  // CADASTRADOS EM BANCO LOCAL
  private obterUsuariosDoStorage(): any[] {
    const dados = localStorage.getItem(this.CHAVE_STORAGE);
    return dados ? JSON.parse(dados) : [];
  }

  existe(email: string): boolean {
    const usuarios = this.obterUsuariosDoStorage();
    return usuarios.some(u => u.email.toLowerCase() === email.toLowerCase());
  }

  entrar(email: string, senha: string): boolean {
    if (!email || !senha) {
      return false;
    }

    const usuarios = this.obterUsuariosDoStorage();

    const contaValida = usuarios.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    );

    if (contaValida) {
      this.logado = true;
      sessionStorage.setItem('carborota_logado', 'true');
      sessionStorage.setItem(this.CHAVE_EMAIL, email.toLowerCase());
      return true;
    }
    
    return false; //SO ENTRA QUEM TEM CADASTRO E SENHA CORRETA
  }

  cadastrar(email: string, senha: string): boolean {
    if (!email || !senha || senha.length < 8) {
      return false;
    }

    if (this.existe(email)) {
      return false;
    }

    const usuarios = this.obterUsuariosDoStorage();
    
    // NOVO USUARIO
    usuarios.push({ email, senha });
    localStorage.setItem(this.CHAVE_STORAGE, JSON.stringify(usuarios));
    
    return true;
  }

  sair(): void {
    this.logado = false;
    sessionStorage.removeItem('carborota_logado');
    sessionStorage.removeItem(this.CHAVE_EMAIL);
  }
}

// PROTEGER PORQUE TEM LOGIN
export const precisaLogin: CanActivateFn = () => {
  const usuario = inject(UsuarioService);
  const router = inject(Router);

  if (usuario.logado) {
    return true;
  }

  return router.createUrlTree(['/login']);
};