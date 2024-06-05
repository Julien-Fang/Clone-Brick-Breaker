import { sys } from 'typescript';
import * as conf from './conf'
import {randomSign} from './index'
import { stat } from 'fs';
type Coord = { x: number; y: number; dx: number; dy: number }
type Ball = { coord: Coord; life: number; invincible?: number; speed: number }
type Size = { height: number; width: number }
export type BonusBall = { coord: Coord; life: number; invincible?: number; speed: number; type: number } // value, pour savoir quel bonus contient la balle

export type Pad = { coord: Coord; life: number; invincible?: number }
export type Square = { coord: Coord; life: number; invincible?: number }
export type State = {
  pos: Array<Ball>
  sq : Array<Square>
  pad :Pad
  size: Size
  endOfGame: boolean
  end : boolean
  life: number
  ref: React.RefObject<any>; 
  score: number
  start: boolean
  directionShotX : number
  directionShotY : number
  cptBall : number
  bonus : Array<BonusBall>
  downSquare : number
  win: boolean
}

const dist2 = (o1: Coord, o2: Coord) =>
  Math.pow(o1.x - o2.x, 2) + Math.pow(o1.y - o2.y, 2)

const distcsq = (x1: number , y1 : number, x2 : number, y2 :number) =>
  Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)




const iterate_pad = (bound: Size, ball: Ball, pad : Pad, ballSpeed : number)  => {
  const invincible = ball.invincible ? ball.invincible - 1 : ball.invincible
  const coord = ball.coord
  let colli_x = 0, colli_y = 0;
  let sq_coord = pad.coord
  if(colli_x == 0)
    colli_x = (((coord.x + conf.RADIUS > sq_coord.x  && coord.x < sq_coord.x && coord.dx>0 || 
    coord.x - conf.RADIUS < sq_coord.x + sq_coord.dx && coord.x > sq_coord.x + sq_coord.dx && coord.dx < 0 )&&
      (sq_coord.y < coord.y && coord.y < sq_coord.y + sq_coord.dy  ))
      || ((distcsq(coord.x, coord.y, sq_coord.x,sq_coord.y) < conf.RADIUS  * conf.RADIUS  
      || distcsq(coord.x, coord.y, sq_coord.x,sq_coord.y+ sq_coord.dy) < conf.RADIUS  * conf.RADIUS  ) 
      && (coord.x + conf.RADIUS > sq_coord.x  && coord.x < sq_coord.x && coord.dx>0 ))
      || ((distcsq(coord.x, coord.y, sq_coord.x + sq_coord.dx,sq_coord.y)  < conf.RADIUS  * conf.RADIUS  
      ||distcsq(coord.x, coord.y, sq_coord.x + sq_coord.dx ,sq_coord.y+ sq_coord.dy) < conf.RADIUS  * conf.RADIUS  )
      && (coord.x - conf.RADIUS < sq_coord.x + sq_coord.dx && coord.x > sq_coord.x + sq_coord.dx && coord.dx < 0 ))
      ? 1
      : 0)
  if(colli_y == 0)
  colli_y = (((coord.y + conf.RADIUS > sq_coord.y  && coord.y < sq_coord.y && coord.dy>0|| 
    coord.y - conf.RADIUS < sq_coord.y +  sq_coord.dy && coord.y > sq_coord.y +  sq_coord.dy && coord.dy < 0)&&
    (sq_coord.x < coord.x && coord.x < sq_coord.x + sq_coord.dx))

    || ((distcsq(coord.x, coord.y, sq_coord.x,sq_coord.y) < conf.RADIUS  * conf.RADIUS  
    || distcsq(coord.x, coord.y, sq_coord.x,sq_coord.y+ sq_coord.dy) < conf.RADIUS  * conf.RADIUS  )
    && coord.y + conf.RADIUS > sq_coord.y  && coord.y < sq_coord.y  && coord.dy>0)
    || ((distcsq(coord.x, coord.y, sq_coord.x + sq_coord.dx,sq_coord.y)  < conf.RADIUS  * conf.RADIUS  
    ||distcsq(coord.x, coord.y, sq_coord.x + sq_coord.dx,sq_coord.y+ sq_coord.dy) < conf.RADIUS  * conf.RADIUS  )
    && coord.y - conf.RADIUS < sq_coord.y +  sq_coord.dy && coord.x > sq_coord.y +  sq_coord.dy && coord.dy < 0)

    ? 1
    : 0)
  let dx_ =
    (coord.x + conf.RADIUS > bound.width || coord.x < conf.RADIUS || colli_x == 1
      ? -coord.dx
      : coord.dx) * conf.FRICTION
  let dy_ =
    (coord.y + conf.RADIUS > bound.height || coord.y < conf.RADIUS || colli_y == 1
      ? -coord.dy
      : coord.dy) * conf.FRICTION
  
  
  const dx = dx_ 
  const dy = dy_
  if (Math.abs(dx) + Math.abs(dy) < conf.MINMOVE)
    return { ...ball, invincible, coord: { ...coord, dx: 0, dy: 0 } }
  return {
    ...ball,
    invincible,
    coord: {
      x: coord.x + dx * ballSpeed ,
      y: coord.y + dy * ballSpeed,
      dx,
      dy,
    },
  }
}




const iterate_bonus = (bound: Size, bonus: BonusBall, pad: Pad, ballSpeed: number) => {
  const invincible = bonus.invincible ? bonus.invincible - 1 : bonus.invincible;
  const coord = bonus.coord;
  let sq_coord = pad.coord;

  // Vérifier s'il y a collision en X
  if (
    coord.x + conf.RADIUS > sq_coord.x &&
    coord.x - conf.RADIUS < sq_coord.x + sq_coord.dx &&
    sq_coord.y < coord.y &&
    coord.y < sq_coord.y + sq_coord.dy
  ) {
    return { ...bonus, invincible, coord: { ...coord, dx: 0, dy: 0 } };
  }

  // Vérifier s'il y a collision en Y
  if (
    coord.y + conf.RADIUS > sq_coord.y &&
    coord.y - conf.RADIUS < sq_coord.y + sq_coord.dy &&
    sq_coord.x < coord.x &&
    coord.x < sq_coord.x + sq_coord.dx
  ) {
    return { ...bonus, invincible, coord: { ...coord, dx: 0, dy: 0 } };
  }

  let dx_ =
    (coord.x + conf.RADIUS > bound.width || coord.x < conf.RADIUS
      ? -coord.dx
      : coord.dx) * conf.FRICTION;
  let dy_ =
    (coord.y + conf.RADIUS > bound.height || coord.y < conf.RADIUS
      ? -coord.dy
      : coord.dy) * conf.FRICTION;
  const dx = dx_;
  const dy = dy_;

  if (Math.abs(dx) + Math.abs(dy) < conf.MINMOVE)
    return { ...bonus, invincible, coord: { ...coord, dx: 0, dy: 0 } };

  return {
    ...bonus,
    invincible,
    coord: {
      x: coord.x + dx * ballSpeed,
      y: coord.y + dy * ballSpeed,
      dx,
      dy,
    },
  };
};



export const click =
  (state: State) =>
  (event: PointerEvent): State => {
    const { offsetX, offsetY } = event
    const target = state.pos.find(
      (p) =>
        dist2(p.coord, { x: offsetX, y: offsetY, dx: 0, dy: 0 }) <
        Math.pow(conf.RADIUS, 2) + 100
    )
    if (target) {
      target.coord.dx += Math.random() * 10
      target.coord.dy += Math.random() * 10
    }
    return state
  }


const collideSq = (coord : Coord, sq_coord: Coord) =>{
  let colli_x = 0; 
  let colli_y =0; 
  if(colli_x == 0)
    colli_x = (((coord.x + conf.RADIUS > sq_coord.x  && coord.x < sq_coord.x && coord.dx>0 || 
    coord.x - conf.RADIUS < sq_coord.x + sq_coord.dx && coord.x > sq_coord.x + sq_coord.dx && coord.dx < 0 )&&
      (sq_coord.y < coord.y && coord.y < sq_coord.y + sq_coord.dy  ))
      || ((distcsq(coord.x, coord.y, sq_coord.x,sq_coord.y) < conf.RADIUS  * conf.RADIUS  
      || distcsq(coord.x, coord.y, sq_coord.x,sq_coord.y+ sq_coord.dy) < conf.RADIUS  * conf.RADIUS  ) 
      && (coord.x + conf.RADIUS > sq_coord.x  && coord.x < sq_coord.x && coord.dx>0 ))
      || ((distcsq(coord.x, coord.y, sq_coord.x + sq_coord.dx,sq_coord.y)  < conf.RADIUS  * conf.RADIUS  
      ||distcsq(coord.x, coord.y, sq_coord.x + sq_coord.dx ,sq_coord.y+ sq_coord.dy) < conf.RADIUS  * conf.RADIUS  )
      && (coord.x - conf.RADIUS < sq_coord.x + sq_coord.dx && coord.x > sq_coord.x + sq_coord.dx && coord.dx < 0 ))
      ? 1
      : 0)
  if(colli_y == 0)
  colli_y = (((coord.y + conf.RADIUS > sq_coord.y  && coord.y < sq_coord.y && coord.dy>0|| 
    coord.y - conf.RADIUS < sq_coord.y +  sq_coord.dy && coord.y > sq_coord.y +  sq_coord.dy && coord.dy < 0)&&
    (sq_coord.x < coord.x && coord.x < sq_coord.x + sq_coord.dx))

    || ((distcsq(coord.x, coord.y, sq_coord.x,sq_coord.y) < conf.RADIUS  * conf.RADIUS  
    || distcsq(coord.x, coord.y, sq_coord.x,sq_coord.y+ sq_coord.dy) < conf.RADIUS  * conf.RADIUS  )
    && coord.y + conf.RADIUS > sq_coord.y  && coord.y < sq_coord.y  && coord.dy>0)
    || ((distcsq(coord.x, coord.y, sq_coord.x + sq_coord.dx,sq_coord.y)  < conf.RADIUS  * conf.RADIUS  
    ||distcsq(coord.x, coord.y, sq_coord.x + sq_coord.dx,sq_coord.y+ sq_coord.dy) < conf.RADIUS  * conf.RADIUS  )
    && coord.y - conf.RADIUS < sq_coord.y +  sq_coord.dy && coord.x > sq_coord.y +  sq_coord.dy && coord.dy < 0)

    ? 1
    : 0)
    return colli_x==1 || colli_y ==1
}



const collideBoingSq = (ball: Coord, square: Coord) => {
  // Calcul de la distance entre le centre de la balle et le centre du carré
  const dx = Math.abs(ball.x - square.x - square.dx / 2)
  const dy = Math.abs(ball.y - square.y - square.dy / 2)

  const distX = dx - square.dx / 2
  const distY = dy - square.dy / 2

  if (distX <= conf.RADIUS && distY <= conf.RADIUS) {// Collision détectée
    const overlapX = conf.RADIUS - distX
    const overlapY = conf.RADIUS - distY

    if (overlapX < overlapY) {
      if (ball.x < square.x + square.dx / 2) {
        // Balle à gauche du carré
        ball.x -= overlapX
      } else {
        // Balle à droite du carré
        ball.x += overlapX
      }
      ball.dx = -ball.dx 
    } else {
      if (ball.y < square.y + square.dy / 2) {
        ball.y -= overlapY
      } else {
        ball.y += overlapY
      }
      ball.dy = -ball.dy // Inversion de la direction verticale
    }
  }
}



const collideSound = new Audio(process.env.PUBLIC_URL + '/sounds/collide.mp3');
collideSound.volume = 0.1;


const doubleBall = (state: State) => {
  const newPos = [...state.pos];
  for (let i = 0; i < state.pos.length; i++) {
     newPos.push({
       life: conf.BALLLIFE,
       speed: state.pos[i].speed,
       coord: {
         x: state.pos[i].coord.x,
         y: state.pos[i].coord.y,
         dx: Math.random() * randomSign(),
         dy: Math.random() * randomSign(),
       },
     });
  }
  state.pos = newPos;
 };
 
const upgradeSizePad = (state: State) => {
  state.pad.coord.dx += 100;
  return state;
}

const addLife = (state: State) => {
  state.life++;
  return state;
}



export const step = (state: State) => {
  state.sq.forEach((square) => {
    state.pos.map((p2) => {
    if(collideSq(p2.coord, square.coord)) { // p2 = balle ; square = brique
      collideSound.play();
      collideBoingSq(p2.coord, square.coord)
      square.life--
      const newBallSpeed = p2.speed + 0.01
      p2.speed= newBallSpeed
      state.sq = state.sq.filter((square) => square.life > 0);

      // Vérifier si square.life est égal à 0
      if (square.life === 0) {
        // Incrémenter state.score
        state.score++; 
        
        if(state.score % (state.downSquare*5) === 0){
          state.sq.map((square) => {
            square.coord.y += state.size.height/30
          })
          state.downSquare++

        }
        if (state.score % (state.cptBall*3) === 0){
          const tmp = Math.floor(Math.random() * 3) //de 0 à 2
          const tmpX = Math.floor(Math.random() * state.size.width)
          const BonusB : BonusBall = {
            type: tmp,
            coord: {
              x: tmpX,
              y: state.size.height/15,
              dx: 0,
              dy: 0.7,
            },
            life: 1,
            speed: 1,
            invincible: 0,
          }
          state.bonus.push(BonusB)
          state.cptBall++
        }

      }
    }
  })
  })
  // Retourner l'état de depart lorsque la balle ne touche pas le pad
  state.pos.map((p2) => {
    if(p2.coord.y + conf.RADIUS > state.size.height){
      if(state.pos.length === 1){
        state.life--
        state.pos[0].coord.y = state.pad.coord.y - conf.RADIUS-5 // state.size.height - conf.RADIUS
        state.pos[0].coord.dy = 0
        state.pos[0].coord.dx = 0
        state.start = false
        state.pos[0].coord.x = state.pad.coord.x + state.pad.coord.dx/2
        state.directionShotX = 0.1
        state.directionShotY = Math.min(-0.1, -Math.sqrt(1 - state.directionShotX ** 2));
        state.pad.coord.dx = state.size.width/10
        state.pos[0].speed = 2
        state.bonus = []

      }
      else{
        state.pos = state.pos.filter((ball) => ball !== p2);
      }
    }
  })
  // Ajouter les bonus qui tombent
  state.bonus.map((bonus) => {
    if (collideSq(bonus.coord, state.pad.coord)){
      if(bonus.type === 0 ){ // 0 : life + 1
        addLife(state)
      }
      if(bonus.type === 1 ){ // 1 : double ball
        doubleBall(state)
      }
      if(bonus.type === 2 ){  // 2 : upgradeSizePad
        upgradeSizePad(state)
      }
      state.bonus = state.bonus.filter((bonustmp) => bonustmp !== bonus);
    }
  })

  if(state.sq.length === 0){
    state.win = true
  }
  if(state.life === 0){
    state.end = true
  }
  
  return {
    ...state,
      pos: state.pos 
      .map(ball => iterate_pad(state.size, ball, state.pad,ball.speed)) // Mettre à jour la position en tenant compte de la collision avec le pad
      .filter(ball => ball.life > 0),

      bonus : state.bonus.map((bonus) => iterate_bonus(state.size, bonus, state.pad, bonus.speed))
      .filter(bonus => bonus.coord.y <= state.pad.coord.y)
    }
}
export const mouseMove =
  (state: State) =>
  (event: PointerEvent): State => {
    return state
  }
export const endOfGame = (state: State): boolean => true





const keysPressed: { [key: string]: boolean } = {};
let pressTimer: ReturnType<typeof setTimeout>;
let acc = 0;

const handleKeyDown = (event: KeyboardEvent) => {
  keysPressed[event.key] = true;
};

const handleKeyUp = (event: KeyboardEvent) => {
  keysPressed[event.key] = false;
  clearTimeout(pressTimer);
  // Réinitialiser acc lorsque la touche est relâchée
  acc = 0;
};

export const handleKeyMovePad = (event: KeyboardEvent, state: State): State => {
  const newState: State = { ...state };

  if (event.repeat) {
    // La touche est maintenue enfoncée
    switch (event.key) {
      case 'ArrowRight':
        newState.pad.coord.x = Math.min(newState.size.width - newState.pad.coord.dx, newState.pad.coord.x + 7 * acc);
        acc = acc < 3 ? acc + 0.25 : acc;
        break;
      case 'ArrowLeft':
        newState.pad.coord.x = Math.max(0, newState.pad.coord.x - 7 * acc);
        acc = acc < 3 ? acc + 0.25 : acc;
        break;
    }
  } else {
    // La touche est pressée une fois
    switch (event.key) {
      case 'ArrowRight':
        newState.pad.coord.x = Math.min(newState.size.width - newState.pad.coord.dx, newState.pad.coord.x + 7);
        break;
      case 'ArrowLeft':
        newState.pad.coord.x = Math.max(0, newState.pad.coord.x - 7);
        break;
      case ' ':
        if (!newState.start) {
          newState.pos[0].coord.dx = newState.directionShotX 
          if (newState.pos[0].coord.dx === 0 ){
            newState.pos[0].coord.dx = 0.1 ;
            newState.directionShotX = newState.pos[0].coord.dx;
          }
          newState.pos[0].coord.dy = Math.min(-0.1, -Math.sqrt(1 - newState.pos[0].coord.dx ** 2));
          newState.directionShotY = newState.pos[0].coord.dy;
          newState.start = true
        }
        break;
    }
  }

  // Gérer le mouvement horizontal avec 'q' et 'd' si le jeu n'a pas encore commencé
  if (!newState.start) {
    if (keysPressed['q']) {
      if ( newState.directionShotX >= 0.1 && newState.directionShotX <= 0.11 ){ // évalue une tranche a cause de la précision des nombres flottants
        newState.directionShotX = -0.1;
        newState.directionShotY = Math.min(-0.1, -Math.sqrt(1 - newState.directionShotX ** 2));
      }
      else {
        newState.directionShotX = Math.max(-0.8, newState.directionShotX - 0.1);
        newState.directionShotY = Math.min(-0.1, -Math.sqrt(1 - newState.directionShotX ** 2));
      }
    } else if (keysPressed['d']) {
      if( newState.directionShotX >= -0.11 && newState.directionShotX <= -0.1){ // évalue une tranche a cause de la précision des nombres flottants
        newState.directionShotX = 0.1;
        newState.directionShotY = Math.min(-0.1, -Math.sqrt(1 - newState.directionShotX ** 2));
      }
      else{
        newState.directionShotX = Math.min(0.8, newState.directionShotX + 0.1);
        newState.directionShotY = Math.min(-0.1, -Math.sqrt(1 - newState.directionShotX ** 2));
      }
    }
  }
  return newState;
};


// Ajouter des écouteurs d'événements pour les touches du clavier
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);