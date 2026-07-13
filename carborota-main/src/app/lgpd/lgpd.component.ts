import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lgpd',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lgpd.component.html',
  styleUrl: './lgpd.component.css',
})
export class LgpdComponent {
  topicos = [
    {
      titulo: '1. Introdução',
      texto: 'O CarboRota respeita a Lei Geral de Proteção de Dados (LGPD).',
    },
    {
      titulo: '2. Dados coletados',
      texto: 'Coletamos nome, e-mail, dados do veículo e mensagens de contato.',
    },
    {
      titulo: '3. Finalidade',
      texto: 'Os dados são usados para calcular emissões, login e comunicação.',
    },
    {
      titulo: '4. Seus direitos',
      texto: 'Você pode pedir correção ou exclusão dos seus dados pelo contato.',
    },
  ];
}
