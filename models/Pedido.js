import PedidoDAO from "../DAO/PedidoDAO.js";

export default class Pedido {
  #codigo;
  #nome;
  #telefone;
  #endereco;
  #valorTotal;
  #itensPedido = [];
  constructor(
    codigo = 0,
    nome,
    telefone,
    endereco,
    valorTotal,
    itensPedido = []
  ) {
    this.#codigo = codigo;
    this.#nome = nome;
    this.#telefone = telefone;
    this.#endereco = endereco;
    this.#valorTotal = valorTotal;
    this.#itensPedido = itensPedido;
  }

  get codigo() {
    return this.#codigo;
  }
  set codigo(codigo) {
    this.#codigo = codigo;
  }

  get nome() {
    return this.#nome;
  }
  set nome(nome) {
    this.#nome = nome;
  }

  get telefone() {
    return this.#telefone;
  }
  set telefone(telefone) {
    this.#telefone = telefone;
  }

  get endereco() {
    return this.#endereco;
  }

  set endereco(endereco) {
    this.#endereco = endereco;
  }
  get valorTotal() {
    let valorTotal = 0;
    for (const item of this.#itensPedido) {
      valorTotal += Number(item.servico.valorServico);
    }
    return valorTotal;
  }
  set valorTotal(valorTotal) {
    this.#valorTotal = valorTotal;
  }

  get itensPedido() {
    return this.#itensPedido;
  }

  set itensPedido(itensPedido) {
    this.#itensPedido = itensPedido;
  }

  async gravar() {
    const pedDao = new PedidoDAO();
    await pedDao.gravar(this);
  }
}
