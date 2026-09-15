// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";

// Importa a classe Player do arquivo Player.ts
import { Player } from "./models/Player.js";

// Cria uma aplicação Express
// A função express() devolve um objeto que representa o servidor da aplicação
const app: Express = express();

//Middware para garantir que o servidor entenda requisições com corpo em JSON
app.use(express.json());

// Define a porta onde o servidor ficará disponível
// Neste caso, o servidor poderá ser acessado pela porta 8081
const PORT: number = 8081;

//Instalação de um jogador utilizando a classe Player
//Criamos (instanciamos) um novo jogador chamado "Hero" com 100 de saúde e nível 1
// a partir da classe Player que foi importada do arquivo Player.ts
let player1: Player = new Player("Hero", 100, 5);

// Rota GET para obter informações do jogador
// Quando o usuário acessar a rota "/player", o servidor responderá com os dados do jogador
// A função de callback recebe dois primeiros: req (requisição) e res (resposta)
app.get("/player", (req: Request, res: Response) => {
    res.json({
        message: "Informações do jogador",
        player:player1,
    });
});

// Rota POST para o jogador atacar
// Quando o usuário acessar a rota "/player/attack", o servidor chamará o método attack()
// do jogador
// É utilizado para enviar dados ou realizar ações que alteram o estado do servidor, como neste caso, onde o jogador
//realiza uma ação (como acionar um comportamento de ataque).
// que é o método attack() do jogador.
// A função de callback receber dois parâmetros: req (requisição) e res (reposta)
app.post("/player/attack", (req: Request, res: Response) => {
    const attackMessage = player1.attack(); //Chama o método attack() do jogador
    // Retorna uma resposta JSON com a mensagem do ataque
    // para o cliente que faz a requisição
    res.json({
        message: attackMessage,
    });
});

//Rota POST para o jogador receber dano
app.post("/player/take-damage", (req: Request, res: Response) => {
    // Chama o método takeDamage
    const { damage } = req.body;
    const damageMessage = player1.takeDamage(damage);
    res.json({
        action: damageMessage,
        currentHealth: player1.health,
        currentLevel: player1.level
    });
});

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log("Rotas disponíveis:");
    console.log('GET http://localhost:${PORT}/player - Obter informações do jogador');
    console.log('POST http://localhost:${PORT}/player/attack - Jogador realiza um ataque');
    console.log('POST http://localhost:${PORT}/player/take-damage - Jogador recebe um dano');
});