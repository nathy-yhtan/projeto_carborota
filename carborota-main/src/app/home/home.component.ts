import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  slideAtual = 0;
  intervalo: any;
  TEMPO_SLIDE = 4500; // Tempo padrão unificado de 4.5 segundos

  slides = [
    { 
      titulo: 'Emissões veiculares', 
      legenda: 'Cada carro importa no combate ao aquecimento global', 
      imagem: 'carousel-1.png' 
    },
    { 
      titulo: 'Veículo elétrico', 
      legenda: 'Conheça alternativas mais limpas', 
      imagem: 'carousel-2.jpg' 
    },
    { 
      titulo: 'Compensação de carbono', 
      legenda: 'Calcule e compense suas emissões de CO₂', 
      imagem: 'carousel-3.png' 
    },
  ];

  passos = [
    { icone: '1', titulo: 'Informe seus dados', texto: 'Combustível, consumo e distância mensal.' },
    { icone: '2', titulo: 'Calcule as emissões', texto: 'Veja sua emissão mensal e anual de CO₂.' },
    { icone: '3', titulo: 'Compare e reduza', texto: 'Descubra como diminuir seu impacto.' },
    { icone: '4', titulo: 'Compense', texto: 'Saiba quantas árvores plantar.' },
  ];

  ngOnInit(): void {
    this.iniciarTemporizador();
  }

  ngOnDestroy(): void {
    this.pararTemporizador();
  }

  // Cria o temporizador que roda estritamente no tempo definido
  iniciarTemporizador(): void {
    this.pararTemporizador(); // Garante que não existam múltiplos timers rodando
    this.intervalo = setInterval(() => {
      this.slideAtual = (this.slideAtual + 1) % this.slides.length;
    }, this.TEMPO_SLIDE);
  }

  // Limpa o timer atual da memória
  pararTemporizador(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  // Cliques manuais resetam o relógio do zero
  slideAnterior(): void {
    this.slideAtual = (this.slideAtual - 1 + this.slides.length) % this.slides.length;
    this.iniciarTemporizador(); 
  }

  proximoSlide(): void {
    this.slideAtual = (this.slideAtual + 1) % this.slides.length;
    this.iniciarTemporizador();
  }
}