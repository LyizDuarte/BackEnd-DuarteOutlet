import ServicoDAO from "../DAO/ServicoDAO.js";

export default class Servico {
  #codigo;
  #titulo;
  #descricao;
  #valorServico;
  #urlImagem;
  constructor(codigo, titulo, descricao, valorServico, urlImagem) {
    this.#codigo = codigo;
    this.#titulo = titulo;
    this.#descricao = descricao;
    this.#valorServico = valorServico;
    this.#urlImagem = urlImagem;
  }

  get codigo() {
    return this.#codigo;
  }
  set codigo(codigo) {
    this.#codigo = codigo;
  }

  get titulo() {
    return this.#titulo;
  }
  set titulo(titulo) {
    this.#titulo = titulo;
  }

  get descricao() {
    return this.#descricao;
  }
  set descricao(descricao) {
    this.#descricao = descricao;
  }

  get valorServico() {
    return this.#valorServico;
  }

  set valorServico(valorServico) {
    this.#valorServico = valorServico;
  }
  get urlImagem() {
    return this.#urlImagem;
  }
  set urlImagem(urlImagem) {
    this.#urlImagem = urlImagem;
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      titulo: this.#titulo,
      descricao: this.#descricao,
      valorServico: this.#valorServico,
      urlImagem: this.#urlImagem,
    };
  }
  async gravar() {
    const servDAO = new ServicoDAO();
    await servDAO.gravar(this);
  }
  async alterar() {
    const servDAO = new ServicoDAO();
    await servDAO.alterar(this);
  }
  async excluir() {
    const servDAO = new ServicoDAO();
    await servDAO.excluir(this);
  }
  async consultar() {
    const servDAO = new ServicoDAO();
    return await servDAO.consultar(this);
  }
  async consultarTitulo(titulo) {
    const servDAO = new ServicoDAO();
    return await servDAO.consultarTitulo(titulo);
  }
}
