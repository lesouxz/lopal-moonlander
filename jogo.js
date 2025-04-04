/** @type {HTMLCanvasElement} */
//Vinicius Araújo
// Seleção de modelagem de dados 
let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");

let moduloLunar = {
    posicao: {
        x: 100,
        y: 100
    },
    angulo: -Math.PI/2,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: 0,
        y: 0
    },
    combustivel: 1000,
    combustivelMax: 1000,
    rotacaoAntiHorario: false,
    rotacaoHorario: false,
    
};
let estrelas = []

for(let i =0; i<100; i++){
   estrelas[i] = {
    x: Math.random()* canvas.width,
    y: Math.random()* canvas.height,
    raio: Math.sqrt( 2 * Math.random()),
    brilho: 1.0,
    apagando: true,
    cintilacao: 0.05 * Math.random()
    
    };
}

function desenharModuloLunar() {
    contexto.save();
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5, moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if (moduloLunar.motorLigado) {
        desenharChama();
    }

    contexto.restore();
}

function desenharChama() {
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 15);
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}

function mostrarIndicadores() {
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.fillStyle = "lightgray";
    contexto.fillText(`Velocidade Vertical: ${(10 * moduloLunar.velocidade.y).toFixed(1)}`, 10, 20);
    contexto.fillText(`Velocidade Horizontal: ${(moduloLunar.velocidade.x).toFixed(1)}`, 10, 40);
    contexto.fillText(`Ângulo: ${(moduloLunar.angulo * (180 / Math.PI)).toFixed(1)}°`, 10, 60);
    let combustivelPorcentagem = (moduloLunar.combustivel / moduloLunar.combustivelMax) * 100;
    contexto.fillText(`Combustível: ${combustivelPorcentagem.toFixed(0)}%`, 10, 80);
    let altitude = canvas.height - moduloLunar.posicao.y;
    contexto.fillText(`Altitude: ${altitude.toFixed(0)}m`, 10, 100);
}

function DesenharEstrelas(){
    contexto.save();
    for(let i = 0; i < estrelas.length; i++ ){
        let estrela = estrelas[i];
        contexto.beginPath(); 
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2 * Math.PI);
        contexto.closePath();
        contexto.fillStyle = `rgba(255, 255, 255, ${estrela.brilho } )`;
        contexto.fill();

        if(estrela.apagando){
            estrela.brilho -= estrela.cintilacao;
            if(estrela.brilho <= 0){
                estrela.apagando = false;
            }
        
        }else {
            estrela.brilho += estrela.cintilacao;
            if (estrela.brilho >= 1.0){
                estrela.apagando = true;
            }
        }

    }
    contexto.restore();
}
    
function desenhar() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    mostrarIndicadores();
    atracaoGravitacional();
    desenharModuloLunar();
    DesenharEstrelas();

    if (moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura)) {
        if (moduloLunar.velocidade.y >= 0.5) {
            
            contexto.font = "bold 50px Fantasy";
            contexto.fillStyle = "red";
            contexto.textAlign = "center";
            contexto.fillText("VOCÊ MORREU!", canvas.width / 2, canvas.height / 2);
        } else {
            return mostrarResultaf("Você conseguiu pousar🐔!");
        }
        return;
    }

    requestAnimationFrame(desenhar);
}

document.addEventListener("keydown", teclaPressionada);
function teclaPressionada(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = true;
    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoAntiHorario = true;
    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoHorario = true;
    }
}

document.addEventListener("keyup", teclaSolta);
function teclaSolta(evento) {
    if (evento.keyCode == 38) {
        moduloLunar.motorLigado = false;
    } else if (evento.keyCode == 37) {
        moduloLunar.rotacaoAntiHorario = false;
    } else if (evento.keyCode == 39) {
        moduloLunar.rotacaoHorario = false;
    }
}

let gravidade = 0.01;
function atracaoGravitacional() {
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;
    
    if (moduloLunar.rotacaoAntiHorario) {
        moduloLunar.angulo += Math.PI / 180;
    } else if (moduloLunar.rotacaoHorario) {
        moduloLunar.angulo -= Math.PI / 180;
    }
    
    if(moduloLunar.motorLigado){
        moduloLunar.velocidade.y -= 0.0115 * Math.cos(moduloLunar.angulo);
        moduloLunar.velocidade.x += 0.0115 * Math.sin(moduloLunar.angulo);
    }
    
    if (moduloLunar.motorLigado && moduloLunar.combustivel > 0) {
        moduloLunar.combustivel--;
    } else {
        moduloLunar.motorLigado = false;
    }
    
    moduloLunar.velocidade.y += gravidade;
}


desenhar();