import { obterCardsServicos } from "../funcoesDFLOW/funcoes.js";
import Pedido from "../models/Pedido.js";
import Servico from "../models/Servico.js";
import ItemPedido from "../models/itemPedido.js";

export default class DialogFlowController {
  async processarIntencoes(requisicao, resposta) {
    if (requisicao.method == "POST") {
      const dados = requisicao.body;
      const nomeIntencao = dados.queryResult.intent.displayName;
      const origem = dados?.originalDetectIntentRequest?.source;
      if (nomeIntencao == "Default Welcome Intent") {
        if (origem) {
          obterCardsServicos("custom")
            .then((cards) => {
              let respostaDF = {
                fulfillmentMessages: [],
              };
              respostaDF.fulfillmentMessages.push({
                text: {
                  text: [
                    "Bem vindo a Duarte Outlet! \n",
                    "Esses são os nossos produtos: \n",
                  ],
                },
              });
              respostaDF.fulfillmentMessages.push(...cards);
              respostaDF.fulfillmentMessages.push({
                text: {
                  text: ["Qual produto você deseja?"],
                },
              });
              resposta.status(200).json(respostaDF);
            })
            .catch((erro) => {
              let respostaDF = {
                fulfillmentMessages: [],
              };
              respostaDF.fulfillmentMessages.push({
                text: {
                  text: [
                    "Bem vindo a Duarte Outlet! \n",
                    "Não foi possível recuperar a lista de produtos. \n",
                    "O sistema está com problemas. \n",
                  ],
                },
              });
              resposta.status(200).json(respostaDF);
            });
        } else {
          obterCardsServicos("messenger")
            .then((cards) => {
              let respostaDF = {
                fulfillmentMessages: [],
              };
              respostaDF.fulfillmentMessages.push({
                payload: {
                  richContent: [
                    [
                      {
                        type: "description",
                        title: "Bem vindo a Duarte Outlet!",
                        text: [
                          "Estamos muito felizes em ter você por aqui!",
                          "Esses são nossos produtos: \n",
                        ],
                      },
                    ],
                  ],
                },
              });
              respostaDF.fulfillmentMessages[0].payload.richContent[0].push(
                ...cards
              );
              respostaDF.fulfillmentMessages[0].payload.richContent[0].push({
                type: "description",
                title: "Qual produto você deseja?",
                text: [],
              });
              resposta.json(respostaDF);
            })
            .catch((erro) => {
              let respostaDF = {
                fulfillmentMessages: [],
              };
              respostaDF.fulfillmentMessages.push({
                payload: {
                  richContent: [
                    [
                      {
                        type: "description",
                        title: "Bem vindo a Duarte Outlet!",
                        text: [
                          "Estamos muito felizes em ter você por aqui!",
                          "Infelizmente não foi possível recuperar a lista de produtos. \n",
                          "O sistema está com problemas. \n",
                        ],
                      },
                    ],
                  ],
                },
              });
              resposta.status(200).json(respostaDF);
            });
        }
      } else if (nomeIntencao == "ColetarDemanda") {
        console.log("ColetarDemanda");
        if (!global.demanda) {
          global.demanda = {};
        }
        const sessaoUsuario = dados.session.split("/")[4];
        if (!global.demanda[sessaoUsuario]) {
          global.demanda[sessaoUsuario] = {
            servicos: [],
            quantidades: [],
          };
        }

        const servicosJaColetados = global.demanda[sessaoUsuario].servicos;
        const qtdsJaColetadas = global.demanda[sessaoUsuario].quantidades;
        const novosServicos = dados.queryResult.parameters.servico;
        const novasQuantidades = dados.queryResult.parameters.number;
        global.demanda[sessaoUsuario].servicos = [
          ...servicosJaColetados,
          ...novosServicos,
        ];
        global.demanda[sessaoUsuario].quantidades = [
          ...qtdsJaColetadas,
          ...novasQuantidades,
        ];
      } else if (nomeIntencao == "confirmaAtendimento") {
        console.log("confirmaAtendimento");
        const nomeUsuario =
          dados.queryResult.outputContexts[0].parameters["person.original"];
        const telefoneUsuario =
          dados.queryResult.outputContexts[0].parameters["phone-number"];
        const enderecoUsuario =
          dados.queryResult.outputContexts[0].parameters[
            "street-address.original"
          ];
        //const sessaoUsuario = dados.queryResult.intent.name.split("/")[4];
        const sessaoUsuario = dados.session.split("/")[4];
        const listaItens = [];
        for (
          let i = 0;
          i < global.demanda[sessaoUsuario].servicos.length;
          i++
        ) {
          const servico = new Servico();
          const servicoSelecionado = await servico.consultarTitulo(
            global.demanda[sessaoUsuario].servicos[i]
          );
          const qtd = global.demanda[sessaoUsuario].quantidades[i];
          const itemPedido = new ItemPedido(
            servicoSelecionado[0],
            qtd,
            servicoSelecionado.valorServico
          );
          listaItens.push(itemPedido);
        }

        const pedido = new Pedido(
          0,
          nomeUsuario,
          telefoneUsuario,
          enderecoUsuario,
          0,
          listaItens
        );
        pedido
          .gravar()
          .then(() => {
            if (origem) {
              let respostaDF = {
                fulfillmentMessages: [],
              };
              respostaDF.fulfillmentMessages.push({
                text: {
                  text: [
                    "Seu pedido foi registrado com sucesso! \n",
                    "Pedido nº " + pedido.codigo + ". \n",
                    "Obrigado pela preferência. \n",
                  ],
                },
              });
              resposta.status(200).json(respostaDF);
            } else {
              let respostaDF = {
                fulfillmentMessages: [],
              };
              respostaDF.fulfillmentMessages.push({
                payload: {
                  richContent: [
                    [
                      {
                        type: "description",
                        title: "Pedido gravado com sucesso!",
                        text: [
                          "Pedido nº " + pedido.codigo + ". \n",
                          "Obrigado pela preferência. \n",
                        ],
                      },
                    ],
                  ],
                },
              });
              resposta.status(200).json(respostaDF);
            }
          })
          .catch((erro) => {
            if (origem) {
              let respostaDF = {
                fulfillmentMessages: [],
              };
              respostaDF.fulfillmentMessages.push({
                text: {
                  text: [
                    "Não foi possível registrar o seu pedido! \n",
                    "Entre em contato conosco pelo whatsapp. \n",
                    "Erro: " + erro.message,
                  ],
                },
              });
              resposta.status(200).json(respostaDF);
            } else {
              let respostaDF = {
                fulfillmentMessages: [],
              };
              respostaDF.fulfillmentMessages.push({
                payload: {
                  richContent: [
                    [
                      {
                        type: "description",
                        title: "Não foi possível registrar seu pedido!",
                        text: [
                          "Entre com contato conosco pelo whatsapp! \n",
                          "Erro: " + erro.message,
                        ],
                      },
                    ],
                  ],
                },
              });
              resposta.status(200).json(respostaDF);
            }
          });
      }
    }
  }
}
