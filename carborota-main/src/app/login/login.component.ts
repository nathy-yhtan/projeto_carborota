import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  senha = '';
  confirmarSenha = '';
  cadastro = false;
  aceiteLgpd = false;

  constructor(
    private usuario: UsuarioService,
    private router: Router,
  ) {}

  entrar(): void {
    if (!this.cadastro && (!this.email || !this.senha)) {
      alert('Preencha e-mail e senha.');
      return;
    }

    if (this.cadastro && (!this.email || !this.senha || !this.confirmarSenha)) {
      alert('Preencha todos os campos.');
      return;
    }

    const regexDominios = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|icloud)\.com$/i;
    if (!regexDominios.test(this.email)) {
      alert('Use um e-mail válido (Gmail, Hotmail, Outlook, Yahoo ou iCloud).');
      return;
    }

    if (this.senha.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (this.cadastro) {
      if (this.senha !== this.confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
      }
      if (!this.aceiteLgpd) {
        alert('Aceite a política de privacidade.');
        return;
      }

      if (this.usuario.cadastrar(this.email, this.senha)) {
        alert('Cadastro realizado com sucesso! Faça login para entrar.');
        this.cadastro = false; // JA VAI PRA ENTRAR
        this.senha = '';
        this.confirmarSenha = '';
      } else {
        alert('Este e-mail já está cadastrado ou a senha é inválida.');
      }
      return;
    }

    //LOGIN SEGURO
    const loginSucesso = this.usuario.entrar(this.email, this.senha);

    if (loginSucesso) {
      this.router.navigateByUrl('/calcular');
    } else {
      alert('Usuário não cadastrado ou senha incorreta.');
    }
  }
}