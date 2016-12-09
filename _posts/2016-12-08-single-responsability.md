---
title: "Principio da única responsabilidade.    Suas classes fazem mais de uma coisa ? PT - 1"
layout: post
tag:
    - boas-praticas
    - SOLID
blog: true
---

Este princípio é considerado o mais simples, porém é na verdade bem difícil de implementar na prática.
Ele fala que você deve criar suas classes para que elas tenham apenas uma única razão para mudar, porém o que significa isso?
(uma razão para mudar?). Isto significa que sua classe deve fazer apenas uma unica coisa, ou gerenciar uma única coisa.
Pode ser um controller de uma view que irá apenas delegar chamadas a outros serviços, um serviço de envio de email
que irá apenas enviar e-mail e nada mais, uma rota que apenas registra as rotas da aplicação.
Se a classe faz mais de uma coisa então ela tem mais de uma responsabilidade e você deve dividi-la para alcançar este princípio.

### Mas como saber se a classe tem mais de uma responsabilidade?

De algumas formas, uma delas é o uso de <i>Object Roles Stereotypes</i>(Estereótipos de regras de objetos), que são
um conjunto de regras gerais e pré-estabelecidas que ocorrem frequentemente no uso de arquiteturas orientadas a objetos.
Com essas regras, desenvolvedores podem estabelecer um template para cada classe e assim fica mais fácil para identificar cada responsabilidade de um classe.


Este conceito é abordado no livro por Rebecca Wirfs-Brock e Alan McKean. O livro apresenta os seguintes estereótipos;


- <strong>Information holder</strong> - Um objeto que sabe certas informações e fornece-as para outros objetos
- <strong>Structurer</strong> - Um objeto que mantém relações entre objetos e informações sobre estes relacionamentos
- <strong>Service Provider</strong> - Um objeto que executa uma tarefa específica e oferece serviço para outros sob demanda
- <strong>Controller</strong> - Um objeto que faz decisões e controla uma tarefa complexa
- <strong>Coordinator</strong> - Um objeto que não faz muitas decisões mas, em uma rotina, delega tarefas para outros objetos
- <strong>Interfacer</strong> - Um objeto que transforma informação ou requisições entre partes distintas de um sistema




Não sendo prescritivo, este conjunto de regras de estereótipos, fornece um excelente framework mental para ajudar
no processo de design de um software. Uma vez que você já tem estabelecido essas regras
você irá encontrar mais facilmente grupos de comportamentos dentro de grupos de responsabilidades relacionadas aos objetos.

### Mas por que isso é tão importante manter apenas uma unica responsabilidade para a classe.?

Por vários motivos, se você estiver trabalhando em equipe e com um controle de versão, seja SVN ou GIT,
mais de uma pessoa podem trabalhar na mesma classe, e se ela tiver mais de uma responsabilidade, o controle de versão
irá acusar vários <i>merges</i>(quando existem diversas alterações no mesmo arquivo de origens diferentes) que não podem ser
resolvidos automaticamente(que se dá quando ele não consegue priorizar ou juntar as alterações sem danificar o conteúdo do arquivo no repositório).
Além disso, em linguagens compiladas cada mudança em uma classe irá resultar em o que chamamos de <i>redeploy</i>
e então teremos que fazer um novo <i>build</i>  do projeto para produção e isso custa caro, ainda mais se for apenas um
<i>hot-deploy</i>(quando temos o projeto em produção e temos que consertar um bug inesperado em produção mesmo)
coisa que deve ser feito em apenas último caso, para evitar erros em produção. Classes que tem apenas uma única responsabilidade,
tem apenas um motivo para mudar, e geralmente não mudam, apenas [evoluem](/2016/12/open-closed/), veremos mais da evolução de classes no próximo princípio.


### E como é implementado classes dessa maneira? Exemplos!

Vejamos um exemplo.

Primeiro uma calculadora de área em JS com uma versão longe de seguir o SRP(Single Responsibility Principle)
Veja um preview [aqui](https://embed.plnkr.co/Q8W27qEIkMcLrs0gXOl7/)

```js
//app.js
function Circle(radius) {
    this.radius = radius
}

function Square(length) {
    this.length = length;
}

function AreaCalculator(shapes) {
    this.shapes = shapes;
    this.sum = function () {
        var sums = {
            circle: 0.0,
            square: 0.0
        };
        var circles = [];
        var squares = [];
        for (var i = 0; i < this.shapes.length; i++) {
            var shape = this.shapes[i];
            if (shape instanceof Circle) {
                circles.push(shape);
            }
            if (shape instanceof Square) {
                squares.push(shape);
            }
        }
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];
            sums.circle += Math.PI * circle.radius * circle.radius;
        }
        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];
            sums.square += square.length * square.length;
        }

        return sums.circle + sums.square;
    };
    this.output = function () {
        var p = document.querySelector(".area");
        var node = document.createTextNode(" Soma das areas das formas é : " + this.sum());
        p.appendChild(node);

    }
}

var shapes = [];

var calculadora = new AreaCalculator(shapes);

function addCircle() {
    
    var circleValue = document.querySelector('#circle');
    var radius = parseFloat(circleValue.value);
    var circle = new Circle(radius);
    shapes.push(circle);
    circleValue.value = '';
     
}

function addSquare() {
    
    var squareValue = document.querySelector('#square');
    var length = parseFloat(squareValue.value);
    var square = new Square(length);
    shapes.push(square);
    squareValue.value = '';
    
}

```

Como podemos  ver, é um código grande pra pouca coisa e não muito coeso, principalmente o método <i>sum</i>,
além disso a classe AreaCalculator tem a responsabilidade de mostrar na página o conteúdo da soma,
porém como o próprio nome já diz, ela é apenas uma calculadora. Claramente um Service Provider,
esta classe tem mais de uma responsabilidade, ou seja ela deve ser refatorada.

Na próxima parte veremos como podemos refatorar esta classe, e então ver a versão "evoluída" dela com a nova versão do javascript
ES6.

Nos vemos na próxima e até mais!
