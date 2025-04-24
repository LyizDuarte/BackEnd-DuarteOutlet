import express from "express";
import routeServico from "./routes/servicoRoute.js";
import routeDialogFlow from "./routes/dialogFlowRoute.js";

const app = express();
const host = "0.0.0.0";
const port = 3000;
app.use(express.json());
app.use("/", express.static("./public"));
app.use("/webhook", routeDialogFlow);
app.use("/servico", routeServico);

app.listen(port, host, () => {
  console.log(
    "Backend outlet iniciado no host: " + host + " e porta: " + port + "."
  );
});
