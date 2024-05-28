import { Actor, CollisionType, Color, Text, Engine, vec, Font } from "excalibur"

// 1 - Criar uma instancia de Engine, que representa o jogo
const game = new Engine({
	width: 800,
	height: 600
})

// 2 - Criar barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,
	width: 200,
	height: 20,
	color: Color.Chartreuse,
	name: "Barra"
})

// Define o tipo de colisão da barra
// ColisionType.Fixed = significa que ele não irá se "mexer" quando colidir
barra.body.collisionType = CollisionType.Fixed

// Insere o Actor barra - player, no game
game.add(barra)


// 3 - Movimentar a barra de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	// Faz a posição x da barra, ser igual a posição x do mouse
	barra.pos.x = event.worldPos.x
})


// 4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})


// 5 - Criar movimentação da bolinha
const velocidadeBolinha = vec(700, 700)

// Após 1 segundo (1000 ms), define a velocidade da bolinha em x = 100 e y = 100
setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)


// 6 - Fazer bolinha bater na barra
bolinha.body.collisionType = CollisionType.Passive


// Colisão da bolinha com as extrimidades do quadro azul

bolinha.on("postupdate", () => {
	// Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}
	// Se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x
	}
	// Se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}
	// Se a bolinha colidir com a parte inferior
	// if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	// 	bolinha.vel.y = -velocidadeBolinha.y
	// }
})

// Adiciona o Actor - player bolinha no game
game.add(bolinha)


// 7 - Criar blocos
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas) ;
// const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []


// Rederiza cada linha, renderiza 3 linhas
for(let j = 0; j < linhas; j++){

	// Rederização dos bloquinhos, rederiza 5 bloquinhos
	for(let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})
		)
	}

}

listaBlocos.forEach( bloco => {
	bloco.body.collisionType = CollisionType.Active
	game.add(bloco)
} )

// Adicionando pontuação
let pontos = 0

const textoPontos = new Text({
	text: "Pontos: " + pontos,
	font: new Font({ size: 30, color: Color.White})
})

const textObject = new Actor ({
	x: game.drawWidth - 100,
	y: game.drawHeight - 50
})

textObject.graphics.use(textoPontos)
 game.add(textObject)

let colidindo: boolean = false 

bolinha.on("collisionstart", (event) => {
	// Verificar se a bolinha colidiu com algum bloco destrutivel
	console.log("Colidiu com", event.other)

	// Se o elemento colidido for um bloco da lista de blocos 
	if (listaBlocos.includes(event.other)) {
		event.other.kill()
	}

	// Rebater a bolinha = inverter as direções
	let intersecção = event.contact.mtv.normalize()
	if (!colidindo) {
		colidindo = true
		 
		// Intersecção 
		if ( Math.abs(intersecção.x) > Math.abs(intersecção.y) ){
			// bolinha.vel.x = bolinha.vel.x * -1
			// bolinha.vel.x *= -1
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}
})

bolinha.on("collisionend", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {
	alert("Foi de BASE")
	window.location.reload()
})




// Inicia o game
game.start()