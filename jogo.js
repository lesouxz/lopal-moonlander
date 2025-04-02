/** @type {HTMLCanvasElement} */

//Seção de Modelagem de dados
let canvas = document.querySelector("#jogo");
let contexto = canvas.getContext("2d");

let x;
let velocidadeX;
let angulo;

if(Math.round(Math.random()) == 0){
    x = 100;
    velocidadeX = 2;
    angulo = Math.PI/2;
} else{
    x = 700;
    velocidadeX = -2;
    angulo = Math.PI/2;
}

let moduloLunar = {
    posicao: {
        x: x,
        y: 100
    },
    angulo: angulo,
    largura: 20,
    altura: 20,
    cor: "lightgray",
    motorLigado: false,
    velocidade: {
        x: velocidadeX,
        y: 0
    },
    combustivel: 1000,
    rotacaoAntiHorario: false,
    rotacaoHorario: false
}

let estrelas = [];
    for(let i = 0; i < 500; i++){
    estrelas[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        raio: Math.sqrt(Math.random() * 2 ),
        transparencia: 1.0,
        diminuicao: true,
        razaoDeCintilacao: Math.random() * 0.05
    };
}

//Seção de visualização
function desenharModuloLunar(){
    contexto.save();
    contexto.beginPath();
    contexto.translate(moduloLunar.posicao.x, moduloLunar.posicao.y);
    contexto.rotate(moduloLunar.angulo);
    contexto.rect(moduloLunar.largura * -0.5, moduloLunar.altura * -0.5,
         moduloLunar.largura, moduloLunar.altura);
    contexto.fillStyle = moduloLunar.cor;
    contexto.fill();
    contexto.closePath();

    if(moduloLunar.motorLigado){
        desenharChama();
        consumoCombustivel();
    }
    
    contexto.restore();
}

function desenharChama(){
    contexto.beginPath();
    contexto.moveTo(moduloLunar.largura * -0.5, moduloLunar.altura * 0.5);
    contexto.lineTo(moduloLunar.largura * 0.5, moduloLunar.altura * 0.5);
    //Determina o tamanho da chama
    contexto.lineTo(0, moduloLunar.altura * 0.5 + Math.random() * 35 );
    contexto.closePath();
    contexto.fillStyle = "orange";
    contexto.fill();
}

function mostrarVelocidadeVertical(){
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let velocidade = Velocidade (vertical): ${(10 * moduloLunar.velocidade.y).toFixed(2)};
    contexto.fillText(velocidade, 150, 60);
}
function mostrarVelocidadeHorizontal(){
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let velocidade = Velocidade (horizontal): ${(10 * moduloLunar.velocidade.x).toFixed(2)};
    contexto.fillText(velocidade, 150, 80);
}


function mostrarCombustivel(){
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let combustivelTotal = 100;
    let porcentagemCombustivel = (moduloLunar.combustivel / combustivelTotal) * 10;
    let combustivel = Combustível: ${porcentagemCombustivel.toFixed(0)}%;
    contexto.fillText(combustivel, 100, 100);
}
function mostrarAltitude(){
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let altitude = Altitude: ${(canvas.height - moduloLunar.posicao.y - 10).toFixed(2)} m;
    contexto.fillText(altitude, 400, 60);
}
function mostrarAngulo(){
    contexto.font = "bold 18px Arial";
    contexto.textAlign = "center";
    contexto.textBaseLine = "middle";
    contexto.fillStyle = "lightgray";
    let angulo = Ângulo: ${(10 * moduloLunar.angulo).toFixed(0)}°;
    contexto.fillText(angulo, 400, 80);
}

function desenharEstrelas(){
    for (let i = 0; i < estrelas.length;){
        let estrela = estrelas[i];
        contexto.beginPath();
        contexto.arc(estrela.x, estrela.y, estrela.raio, 0, 2 * Math.PI);
        contexto.closePath();
        contexto.fillStyle = "rgba(255, 255, 255, " + estrela.transparencia + ")";
        contexto.fill();
        contexto.restore();
    }
}


function desenhar(){
    //limpar a tela
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    //Esta função atualiza a posição do módulo lunar em função da gravidade
    
    atracaoGravitacional();
    desenharModuloLunar();
    mostrarVelocidadeVertical();
    mostrarVelocidadeHorizontal();
    mostrarAngulo();
    mostrarCombustivel();
    mostrarAltitude();
    desenharEstrelas();
    //Esta função repete a execução da função desenhar a cada quadro
    if(moduloLunar.posicao.y >= (canvas.height - 0.5 * moduloLunar.altura )){
        
        if(moduloLunar.velocidade.y >= 0.5 ||
            moduloLunar.velocidade.x >= 0.5 ||
            5 < moduloLunar.angulo ||
            moduloLunar.angulo < -5
        )
        {
            contexto.font = "bold 40px Arial";
            contexto.textAlign = "center";
            contexto.textBaseLine = "middle";
            contexto.fillStyle = "cyan";
            return contexto.fillText("Você morreu na queda!", canvas.width/2, canvas.height/2);

        } else{contexto.font = "bold 40px Arial";
            contexto.textAlign = "center";
            contexto.textBaseLine = "middle";
            contexto.fillStyle = "cyan";
            return contexto.fillText("Você pousou com sucesso!", canvas.width/2, canvas.height/2);
        }
    }
    requestAnimationFrame(desenhar);
}


//Seção de controle


//Pressionando a seta para cima para ligar o motor
document.addEventListener("keydown", teclaPressionada);
function teclaPressionada(evento){
    if(evento.keyCode == 38 && moduloLunar.combustivel > 0){
        moduloLunar.motorLigado = true;
    } else if(evento.keyCode == 39){
        moduloLunar.rotacaoAntiHorario = true;
    } else if(evento.keyCode == 37){
        moduloLunar.rotacaoHorario = true    
    }
}
//Soltando a seta para cima para desligar o motor
document.addEventListener("keyup", teclaSolta);
function teclaSolta(evento){
    if(evento.keyCode == 38){
        moduloLunar.motorLigado = false;
    } else if(evento.keyCode == 39){
        moduloLunar.rotacaoAntiHorario = false;
    } else if(evento.keyCode == 37){
        moduloLunar.rotacaoHorario = false;
    }
}

function consumoCombustivel(){
    if(moduloLunar.combustivel > 0){
        moduloLunar.combustivel--;
    }else{
        moduloLunar.combustivel = 0;
        moduloLunar.motorLigado = false;
    }
}

let gravidade = 0.01;
function atracaoGravitacional(){
    moduloLunar.posicao.x += moduloLunar.velocidade.x;
    moduloLunar.posicao.y += moduloLunar.velocidade.y;
    if(moduloLunar.rotacaoAntiHorario){
        moduloLunar.angulo += Math.PI/180;
    } else if(moduloLunar.rotacaoHorario){
        moduloLunar.angulo -= Math.PI/180;
   }
    if(moduloLunar.motorLigado){
        moduloLunar.velocidade.y -= 0.0115 * Math.cos(moduloLunar.angulo);
        moduloLunar.velocidade.x += 0.0115 * Math.sin(moduloLunar.angulo);
        
    }
    moduloLunar.velocidade.y += gravidade;
    
   
    
}
desenhar();