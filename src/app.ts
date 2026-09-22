// Importa a biblioteca Express e também o tipo Express
// O Express será utilizado para criar o servidor web
import express from "express";
import type { Express, Request, Response } from "express";
// importa o módulo fs para a manipulação de arquivos
// Importa a classe Player do arquivo Player.ts
import { Player } from "./models/Player.js";

import fs from "fs"

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

// Define o nome do diretório onde os arquivos serão armazenados
const DATA_FILE ="./data/player.json";

/*
Função para garantir que o diretório de dados exista antes de salvar os arquivos.
Se o diretório não existir, ele será criado.
*/ 
function ensureDataFolderExists() {
    const dataFolder = "./data";
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
    }
}

// Chamar a função para garantir que o diretório exista
// antes de qualquer operação de leitura ou escrita de arquivos
ensureDataFolderExists();

//Função para salvar os dados do player em um arquivo JSON
function savePlayerState(player: Player) {
    // Converte o objeto player em uma string JSON
    const data = JSON.stringify(player, null, 2);
    // Salva a string JSON no arquivo definido em DATA_FILE
    fs.writeFileSync(DATA_FILE, data, "utf-8");
}

//Função para carregar os dados do player de um arquivo JSON
function loadPlayerState(): Player {
    // Verifica se o arquivo de dados existe
    if (fs.existsSync(DATA_FILE)) {
        // Lê o conteudo do arquivo e conversa de volta para um objeto Player
        const data = fs.readFileSync(DATA_FILE, "utf-8");
        const playerData = JSON.parse(data);

        /* ATENÇÃO: JSON.parse retorna um objeto "puro" 
        (sem os metodos da classe Player)
        Para que o objeto tenha os métodos de classe Player precisamos criar
        uma nova instância da classe Player e passar os dados carregados
        para o contrutor;
        */
        return new Player(playerData.name, playerData.health, playerData.level);
    }
    // Cria um novo player se não exitir u=com nome "Jogador1", 100 de vida e nível 1
    const newPlayer = new Player ("Jeffinho", 100, 1);
    savePlayerState (newPlayer);
    return newPlayer;
}

// Inicializa o player carregando seu estado do arquivo JSON
let player: Player = loadPlayerState();

// Rota GET para obter informações do jogador
// Quando o usuário acessar a rota "/player" via GET, o servidor responderá com os dados do jogador
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
    // Extrair o valor de dano do corpo da requisição
    const { damage } = req.body;
    // Chamar o método takeDamage() do player e armazenar a mensagem retornada
    const damageMessage = player1.takeDamage(damage);
    // Salvar o estado atual do player no arquivo JSON
    savePlayerState(player);
    res.json({
        // Retornar a mensagem de dano, a vida atual e o nível atual do player
        action: damageMessage,
        // Retornar a vida atual e o nível atual do player
        currentHealth: player1.health,
        // Retornar o nível atual do player
        currentLevel: player1.level
    });
});

// Rota POST para o jogador ser curado
app.post("/player/take-heal", (req: Request, res: Response) => {
    // Extrair o valor de cura do corpo da requisição
    const { healAmount } = req.body;
    // Salvar o estado atual do player no arquivo JSON
    const healMessage = player1.heal(healAmount);
    savePlayerState(player1);
    res.json({
        action: healMessage,
        currentHealth: player1.health,
        currentLevel: player1.level
    });
});

// Rota POST para subir de nível
app.post("/player/level-up", (req: Request, res: Response) => {
    // Incrementa o nível do jogador em 1   
    const levelMessage = player1.upLevel();
    // Salvar o estado atual do player no arquivo JSON
    savePlayerState(player1);
    res.json({
        action: levelMessage,
        currentHealth: player1.health,
        currentLevel: player1.level
    });
});

// Inicializa o servidor utilizando a porta definida
// O método listen() faz o servidor começar a "escutar" requisições HTTP
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log("Rotas disponíveis:");
    console.log(`GET http://localhost:${PORT}/player - Obter informações do jogador`);
    console.log(`POST http://localhost:${PORT}/player/attack - Jogador realiza um ataque`);
    console.log(`POST http://localhost:${PORT}/player/take-damage - Jogador recebe um dano`);
    console.log(`POST http://localhost:${PORT}/player/take-heal - Jogador ganha vida`);
    console.log(`POST http://localhost:${PORT}/player/level-up - Jogador upa de nível`);
});