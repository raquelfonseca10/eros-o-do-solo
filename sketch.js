let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let elementosAmbiente = [];

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);
  inicializarElementosAmbiente();
}

function draw() {
  background(200, 220, 255); // céu

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();

  for (let elem of elementosAmbiente) {
    elem.mover();
    elem.mostrar();
  }

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  inicializarElementosAmbiente();
}

function inicializarElementosAmbiente() {
  elementosAmbiente = [];
  if (tipoSolo === "vegetacao") {
    for (let i = 0; i < 5; i++) {
      elementosAmbiente.push(new Animal());
    }
  } else if (tipoSolo === "urbanizado") {
    for (let i = 0; i < 5; i++) {
      elementosAmbiente.push(new Pessoa());
    }
  }
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
    this.arvores = [];
    this.predios = [];

    if (this.tipo === "vegetacao") {
      this.gerarArvores();
    } else if (this.tipo === "urbanizado") {
      this.gerarPredios();
    }
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.1;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.3;

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") fill(60, 150, 60);
    else if (this.tipo === "exposto") fill(139, 69, 19);
    else if (this.tipo === "urbanizado") fill(120);

    rect(0, this.altura, width, height - this.altura);

    if (this.tipo === "vegetacao") {
      this.mostrarArvores();
    } else if (this.tipo === "urbanizado") {
      this.mostrarPredios();
    }

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }

  gerarArvores() {
    let x = 30;
    while (x < width) {
      let alturaCopa = random(30, 60);
      let larguraCopa = random(30, 50);
      let alturaTronco = random(30, 50);
      this.arvores.push({ x, alturaTronco, larguraCopa, alturaCopa });
      x += random(60, 120);
    }
  }

  mostrarArvores() {
    for (let arvore of this.arvores) {
      fill(101, 67, 33);
      rect(arvore.x - 5, this.altura - arvore.alturaTronco, 10, arvore.alturaTronco);
      fill(20, 100, 20);
      ellipse(arvore.x, this.altura - arvore.alturaTronco, arvore.larguraCopa, arvore.alturaCopa);
    }
  }

  gerarPredios() {
    let x = 20;
    while (x < width) {
      let larguraPredio = random(40, 70);
      let alturaPredio = random(60, 120);
      this.predios.push({ x, larguraPredio, alturaPredio });
      x += larguraPredio + random(20, 50);
    }
  }

  mostrarPredios() {
    for (let predio of this.predios) {
      fill(180);
      rect(predio.x, this.altura - predio.alturaPredio, predio.larguraPredio, predio.alturaPredio);

      fill(255, 255, 100);
      for (let y = this.altura - predio.alturaPredio + 15; y < this.altura - 15; y += 20) {
        for (let jx = predio.x + 5; jx < predio.x + predio.larguraPredio - 10; jx += 20) {
          rect(jx, y, 10, 10);
        }
      }
    }
  }
}

// Classe para animais na vegetação
class Animal {
  constructor() {
    this.x = random(width);
    this.y = solo.altura - random(20, 40);
    this.vel = random(1, 2);
    this.tamanho = random(15, 25);
  }

  mover() {
    this.x += this.vel;
    if (this.x > width + 20) {
      this.x = -20;
      this.y = solo.altura - random(20, 40);
    }
  }

  mostrar() {
    fill(150, 100, 50);
    ellipse(this.x, this.y, this.tamanho, this.tamanho * 0.6);
    ellipse(this.x - this.tamanho / 3, this.y, this.tamanho / 2, this.tamanho / 3);
    fill(0);
    ellipse(this.x + this.tamanho / 4, this.y - this.tamanho / 6, 3, 3);
  }
}

// Classe para pessoas na cidade
class Pessoa {
  constructor() {
    this.x = random(width);
    this.y = solo.altura - random(10, 30);
    this.vel = random(0.8, 1.5);
    this.tamanho = random(15, 20);
  }

  mover() {
    this.x += this.vel;
    if (this.x > width + 20) {
      this.x = -20;
      this.y = solo.altura - random(10, 30);
    }
  }

  mostrar() {
    fill(255, 200, 200);
    ellipse(this.x, this.y - this.tamanho / 2, this.tamanho / 2);
    fill(0, 100, 200);
    rect(this.x - this.tamanho / 4, this.y - this.tamanho / 2, this.tamanho / 2, this.tamanho);
  }
}
