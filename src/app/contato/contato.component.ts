import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuarioService } from '../usuario.service';

interface ComunidadePost {
  id: string;
  nome: string;
  titulo: string;
  autorEmail: string;
  curtidas: number;
  curtidasPor: string[];
  data: string;
}

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.css',
})
export class ContatoComponent implements OnInit {
  private readonly CHAVE_COMUNIDADE = 'carborota_comunidade_posts';

  nome = '';
  email = '';
  mensagem = '';
  enviado = false;

  novoPostNome = '';
  novoPostTexto = '';

  posts: ComunidadePost[] = [];

  private readonly postsIniciais: ComunidadePost[] = [
    {
      id: 'seed-ana',
      nome: 'Ana Souza',
      titulo: 'Troquei de carro e reduzi emissões',
      autorEmail: '',
      curtidas: 24,
      curtidasPor: [],
      data: '2026-01-15T10:00:00.000Z',
    },
    {
      id: 'seed-carlos',
      nome: 'Carlos Lima',
      titulo: 'Uso mais transporte público',
      autorEmail: '',
      curtidas: 17,
      curtidasPor: [],
      data: '2026-01-20T14:30:00.000Z',
    },
    {
      id: 'seed-mariana',
      nome: 'Mariana Costa',
      titulo: 'Plantei 10 árvores',
      autorEmail: '',
      curtidas: 41,
      curtidasPor: [],
      data: '2026-02-01T09:15:00.000Z',
    },
  ];

  constructor(private usuario: UsuarioService) {}

  ngOnInit(): void {
    this.carregarPosts();
  }

  enviarContato(form: NgForm): void {
    if (form.valid) {
      this.enviado = true;
      form.resetForm();

      setTimeout(() => {
        this.enviado = false;
      }, 4000);
    }
  }

  adicionarComentario(form: NgForm): void {
    const autorEmail = this.usuario.getUsuarioAtual();
    if (!form.valid || !autorEmail) {
      return;
    }

    this.posts.unshift({
      id: crypto.randomUUID(),
      nome: this.novoPostNome.trim(),
      titulo: this.novoPostTexto.trim(),
      autorEmail,
      curtidas: 0,
      curtidasPor: [],
      data: new Date().toISOString(),
    });

    this.persistirPosts();
    form.resetForm();
  }

  curtir(post: ComunidadePost): void {
    const email = this.usuario.getUsuarioAtual();
    if (!email) {
      return;
    }

    const jaCurtiu = post.curtidasPor.includes(email);

    if (jaCurtiu) {
      post.curtidasPor = post.curtidasPor.filter((e) => e !== email);
      post.curtidas = Math.max(0, post.curtidas - 1);
    } else {
      post.curtidasPor = [...post.curtidasPor, email];
      post.curtidas += 1;
    }

    this.persistirPosts();
  }

  excluirPost(post: ComunidadePost): void {
    if (!this.ehMeuPost(post)) {
      return;
    }

    this.posts = this.posts.filter((item) => item.id !== post.id);
    this.persistirPosts();
  }

  ehMeuPost(post: ComunidadePost): boolean {
    const email = this.usuario.getUsuarioAtual();
    return !!email && post.autorEmail === email;
  }

  curtidoPorMim(post: ComunidadePost): boolean {
    const email = this.usuario.getUsuarioAtual();
    return !!email && post.curtidasPor.includes(email);
  }

  private carregarPosts(): void {
    const dados = localStorage.getItem(this.CHAVE_COMUNIDADE);

    if (dados) {
      this.posts = JSON.parse(dados);
      return;
    }

    this.posts = [...this.postsIniciais];
    this.persistirPosts();
  }

  private persistirPosts(): void {
    localStorage.setItem(this.CHAVE_COMUNIDADE, JSON.stringify(this.posts));
  }
}
