// A palavra "classe" define que estamos criando um molde.
// A palavra "export" permite que esse arquivo seja usado por outros arquivos 
// (como o app.ts)
export class Player {
    public name: string; // O nome do jogador (texto)
    public health: number; // A saúde do jogador (número)
    public level: number; // O nível do jogador (número)

    // Construtores (O construtor é um método especial que executado
    // automaticamente quando a classe é instanciada uma unica vez)
    constructor(name: string, health: number = 100, level: number = 1) {
        // A palavra "this" faz referência a própria classe, ou seja:
        // "Pegue o atributo 'name" da classe PLayer e atribua o vlaor
        // do parâmetro 'name' a ele"
        this.name = name;
        this.health = health;
        this.level = level;
    }

    // Métodos (Comportamentos de classe)
    // Métodos são as "funções" que a classe pode executar, ou seja, são os
    // comportamentos de classe
    // O método "attack" é um método que retorna uma string.
    public attack(): string {
        const damage = this.level * 10; // Calcula o dano baseado no nível do jogador
        return '${this.name} atacou e causou ${damage} de dano!';
    }

    //O método "takeDamage" é um método que recebe um número comp parâmetro e 
    // não retorna nada (void).
    public takeDamage (amount: number): string {
        this.health -= amount; //Reduz a 
        // Regra para garantir que a saúde não fique negativa
        if(this.health < 0) {
            this.health = 0; // Garante que a saúde não fique negativa
            return '${this.name} foi derrotado!';
        }

        return '${this.name} recebeu ${amount} de dano e agora tem ${this.health} de saúde.';
    }
}