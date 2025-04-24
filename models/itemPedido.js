export default class ItemPedido {
  #servico;
  #quantidade;
  #valorUnitario;
  constructor(servico, quantidade, valorUnitario) {
    this.#servico = servico;
    this.#quantidade = quantidade;
    this.#valorUnitario = valorUnitario;
  }

  get servico() {
    return this.#servico;
  }

  set servico(servico) {
    this.#servico = servico;
  }

  get quantidade() {
    return this.#quantidade;
  }

  set quantidade(quantidade) {
    this.#quantidade = quantidade;
  }

  get valorUnitario() {
    return this.#valorUnitario;
  }

  set valorUnitario(valorUnitario) {
    this.#valorUnitario = valorUnitario;
  }
}
