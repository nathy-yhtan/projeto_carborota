import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario.service';

interface HistoricoCalculo {
  id: string;
  modelo: string;
  combustivel: string;
  combustivelNome: string;
  consumo: number;
  distancia: number;
  emissaoMensal: number;
  emissaoAnual: number;
  arvores: number;
  data: string;
}

interface ComparativoLinha {
  veiculo: string;
  detalhe?: string;
  emissaoMensal: number;
  emissaoAnual: number;
  diferenca: number;
}

@Component({
  selector: 'app-calcular',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calcular.component.html',
  styleUrl: './calcular.component.css',
})
export class CalcularComponent implements OnInit {
  private readonly CHAVE_HISTORICO_GLOBAL = 'carborota_historico_calculos';
  private readonly PREFIXO_HISTORICO_USUARIO = 'carborota_historico_';
  private readonly INTERVALO_DUPLICATA_MS = 60_000;

  modelo = '';
  combustivel = 'gasolina';
  consumo = '';
  distancia = '';

  modeloResultado = '';
  emissaoMensal = 0;
  emissaoAnual = 0;
  arvores = 0;
  mostrarResultado = false;
  comparativo: ComparativoLinha[] = [];

  historicoAberto = false;
  historico: HistoricoCalculo[] = [];
  filtroTexto = '';
  filtroCombustivel = 'todos';
  filtroDataInicio = '';
  filtroDataFim = '';

  listaCombustiveis = [
    { valor: 'gasolina', nome: 'Gasolina' },
    { valor: 'etanol', nome: 'Etanol' },
    { valor: 'diesel', nome: 'Diesel' },
    { valor: 'gnv', nome: 'GNV' },
  ];

  // KG DE CO2 POR LITRO
  fatores: Record<string, number> = {
    gasolina: 2.31,
    etanol: 1.55,
    diesel: 2.68,
    gnv: 1.96,
  };

  private readonly perfisComparativo = [
    { veiculo: 'Carro compacto a gasolina', consumo: 12.5, combustivel: 'gasolina' },
    { veiculo: 'Carro híbrido', consumo: 18.8, combustivel: 'gasolina' },
    { veiculo: 'Carro elétrico', eletrico: true, detalhe: 'Emissão direta zero' },
    { veiculo: 'Média nacional (gasolina)', consumo: 10.4, combustivel: 'gasolina' },
  ];

  constructor(private usuario: UsuarioService) {}

  ngOnInit(): void {
    this.carregarHistorico();
  }

  get historicoFiltrado(): HistoricoCalculo[] {
    const texto = this.filtroTexto.trim().toLowerCase();

    return this.historico.filter((item) => {
      const combinaCombustivel =
        this.filtroCombustivel === 'todos' || item.combustivel === this.filtroCombustivel;

      const combinaTexto =
        !texto ||
        item.modelo.toLowerCase().includes(texto) ||
        item.combustivelNome.toLowerCase().includes(texto);

      const combinaPeriodo = this.itemDentroDoPeriodo(item.data);

      return combinaCombustivel && combinaTexto && combinaPeriodo;
    });
  }

  calcular(): void {
    const consumoNum = Number(this.consumo);
    const distanciaNum = Number(this.distancia);
    const fator = this.fatores[this.combustivel];

    const litrosPorMes = distanciaNum / consumoNum;
    this.modeloResultado = this.modelo.trim();
    this.emissaoMensal = litrosPorMes * fator;
    this.emissaoAnual = this.emissaoMensal * 12;
    this.arvores = Math.ceil(this.emissaoAnual / 166.67);
    this.mostrarResultado = true;
    this.comparativo = this.gerarComparativo(distanciaNum);

    this.salvarNoHistorico(consumoNum, distanciaNum);
  }

  alternarHistorico(): void {
    this.historicoAberto = !this.historicoAberto;
  }

  excluirDoHistorico(id: string): void {
    this.historico = this.historico.filter((item) => item.id !== id);
    this.persistirHistorico();
  }

  limparHistorico(): void {
    this.historico = [];
    this.persistirHistorico();
  }

  formatar(numero: number): string {
    return numero.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  }

  formatarAnual(numero: number): string {
    return numero.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  }

  formatarDiferenca(valor: number): string {
    const sinal = valor > 0 ? '+' : '';
    return `${sinal}${this.formatar(valor)}`;
  }

  formatarData(dataIso: string): string {
    return new Date(dataIso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private gerarComparativo(distancia: number): ComparativoLinha[] {
    return this.perfisComparativo.map((perfil) => {
      let emissaoMensal = 0;

      if (!perfil.eletrico && perfil.consumo && perfil.combustivel) {
        const litros = distancia / perfil.consumo;
        emissaoMensal = litros * this.fatores[perfil.combustivel];
      }

      const emissaoAnual = emissaoMensal * 12;

      return {
        veiculo: perfil.veiculo,
        detalhe: perfil.detalhe,
        emissaoMensal,
        emissaoAnual,
        diferenca: emissaoMensal - this.emissaoMensal,
      };
    });
  }

  private salvarNoHistorico(consumoNum: number, distanciaNum: number): void {
    if (this.ehDuplicataRecente(consumoNum, distanciaNum)) {
      return;
    }

    const combustivelNome =
      this.listaCombustiveis.find((item) => item.valor === this.combustivel)?.nome ?? this.combustivel;

    const registro: HistoricoCalculo = {
      id: crypto.randomUUID(),
      modelo: this.modelo.trim(),
      combustivel: this.combustivel,
      combustivelNome,
      consumo: consumoNum,
      distancia: distanciaNum,
      emissaoMensal: this.emissaoMensal,
      emissaoAnual: this.emissaoAnual,
      arvores: this.arvores,
      data: new Date().toISOString(),
    };

    this.historico = [registro, ...this.historico];
    this.persistirHistorico();
  }

  private ehDuplicataRecente(consumoNum: number, distanciaNum: number): boolean {
    const modeloNormalizado = this.modelo.trim().toLowerCase();
    const agora = Date.now();

    return this.historico.some((item) => {
      const tempoDecorrido = agora - new Date(item.data).getTime();

      if (tempoDecorrido > this.INTERVALO_DUPLICATA_MS) {
        return false;
      }

      return (
        item.modelo.trim().toLowerCase() === modeloNormalizado &&
        item.combustivel === this.combustivel &&
        item.consumo === consumoNum &&
        item.distancia === distanciaNum
      );
    });
  }

  private itemDentroDoPeriodo(dataIso: string): boolean {
    if (!this.filtroDataInicio && !this.filtroDataFim) {
      return true;
    }

    const dataItem = new Date(dataIso);

    if (this.filtroDataInicio) {
      const inicio = new Date(`${this.filtroDataInicio}T00:00:00`);
      if (dataItem < inicio) {
        return false;
      }
    }

    if (this.filtroDataFim) {
      const fim = new Date(`${this.filtroDataFim}T23:59:59.999`);
      if (dataItem > fim) {
        return false;
      }
    }

    return true;
  }

  private carregarHistorico(): void {
    const email = this.usuario.getUsuarioAtual();
    if (!email) {
      this.historico = [];
      return;
    }

    const chaveUsuario = this.obterChaveHistorico(email);
    const dados = localStorage.getItem(chaveUsuario);

    if (dados) {
      this.historico = JSON.parse(dados);
      return;
    }

    const dadosGlobais = localStorage.getItem(this.CHAVE_HISTORICO_GLOBAL);
    if (dadosGlobais) {
      this.historico = JSON.parse(dadosGlobais);
      localStorage.setItem(chaveUsuario, dadosGlobais);
      localStorage.removeItem(this.CHAVE_HISTORICO_GLOBAL);
      return;
    }

    this.historico = [];
  }

  private persistirHistorico(): void {
    const email = this.usuario.getUsuarioAtual();
    if (!email) {
      return;
    }

    localStorage.setItem(this.obterChaveHistorico(email), JSON.stringify(this.historico));
  }

  private obterChaveHistorico(email: string): string {
    return `${this.PREFIXO_HISTORICO_USUARIO}${email.toLowerCase()}`;
  }
}