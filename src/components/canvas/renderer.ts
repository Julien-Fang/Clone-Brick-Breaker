import * as conf from './conf'
import { State } from './state'
import { useRef, useEffect, useState } from 'react'
import { taille_rec } from '.'
const COLORS = {
  RED: '#ff0000',
  GREEN: '#00ff00',
  BLUE: '#0000ff',
  MAGENTA : '#ff00ff',
  rouge : 'rgb(255, 51, 0)', 
  orange : 'rgb(255, 153, 51)',
  yellow : 'rgb(255, 255, 0)',
}

const toDoubleHexa = (n: number) =>
  n < 16 ? '0' + n.toString(16) : n.toString(16)

export const rgbaTorgb = (rgb: string, alpha = 0) => {
  let r = 0
  let g = 0
  let b = 0
  if (rgb.startsWith('#')) {
    const hexR = rgb.length === 7 ? rgb.slice(1, 3) : rgb[1]
    const hexG = rgb.length === 7 ? rgb.slice(3, 5) : rgb[2]
    const hexB = rgb.length === 7 ? rgb.slice(5, 7) : rgb[3]
    r = parseInt(hexR, 16)
    g = parseInt(hexG, 16)
    b = parseInt(hexB, 16)
  }
  if (rgb.startsWith('rgb')) {
    const val = rgb.replace(/(rgb)|\(|\)| /g, '')
    const splitted = val.split(',')
    r = parseInt(splitted[0])
    g = parseInt(splitted[1])
    b = parseInt(splitted[2])
  }

  r = Math.max(Math.min(Math.floor((1 - alpha) * r + alpha * 255), 255), 0)
  g = Math.max(Math.min(Math.floor((1 - alpha) * g + alpha * 255), 255), 0)
  b = Math.max(Math.min(Math.floor((1 - alpha) * b + alpha * 255), 255), 0)
  return `#${toDoubleHexa(r)}${toDoubleHexa(g)}${toDoubleHexa(b)}`
}

const clear = (ctx: CanvasRenderingContext2D,state:State) => {
  const { height, width } = ctx.canvas;  
  const canvas = state.ref.current;
  const ctxd = canvas.getContext('2d');

  // Charger l'image de fond
  const backgroundImage = new Image();
  backgroundImage.src = 'images/purple_nebula.png';
    
  ctxd.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  return () => {
  };
}



export type RenderProps = {
  pos: { x: number; y: number }
  scale: number
}
const backgroundMusic = new Audio(process.env.PUBLIC_URL + '/sounds/Supersonic.opus');
backgroundMusic.volume = 0.1;

backgroundMusic.loop = true; // pour qu'elle soit en boucle



const drawCirle = (
  ctx: CanvasRenderingContext2D,
  renderProps: RenderProps,
  { x, y }: { x: number; y: number },
  color: string
) => {
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(
    (x + renderProps.pos.x) * renderProps.scale,
    (y + renderProps.pos.y) * renderProps.scale,
    conf.RADIUS * renderProps.scale,
    0,
    2 * Math.PI
  )
  ctx.fill()
}


const drawCircleImage = (
  ctx: CanvasRenderingContext2D,
  renderProps: RenderProps,
  { x, y }: { x: number; y: number },
  image: HTMLImageElement 
) => {
  const circleDiameter = conf.RADIUS * 2 ; 

  ctx.drawImage(
    image,
    (x + renderProps.pos.x) * renderProps.scale - circleDiameter / 2, 
    (y + renderProps.pos.y) * renderProps.scale - circleDiameter / 2,
    circleDiameter, 
    circleDiameter 
  );
};



const drawLineDirection = (
  ctx: CanvasRenderingContext2D,
  { x, y, dx, dy }: { x: number; y: number; dx: number; dy: number },
  directionX : number,
  directionY : number
) => {
  ctx.beginPath()

  ctx.moveTo(
    (x) ,
    (y) 
  )
  ctx.lineTo(
    (x ) + directionX * 100,
    (y ) + directionY * 100 
   
  )
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 5;
  ctx.stroke()
}


const displayGameText = (ctx: CanvasRenderingContext2D) => (state: State) => {
  ctx.font = '40px arial';
  ctx.fillStyle = 'white'; // Changer la couleur du texte à blanc
  ctx.fillText(
    `vie du joueur: ${state.life}`,
    20,
    40  
  );

  ctx.fillText(
    `score: ${state.score}`,
    500,
    40  
  );
};

const image2 = new Image();
  image2.src = 'images/BonusDoubleBall.png';
  
  const image3 = new Image();
  image3.src = 'images/BonusIncreaseSizePad.png';

  const image4 = new Image();
  image4.src = 'images/BonusPlus1.png';


const computeColor = (life: number, maxLife: number, baseColor: string) =>
  rgbaTorgb(baseColor, (maxLife - life) * (1 / maxLife))



const ImageSong =  ((ctx: CanvasRenderingContext2D, width : Number, isMute : boolean) => {
  const son = new Image();
  son.src = isMute ? 'images/unmute.png': 'images/mute2.png';
  son.onload = () => {
    ctx.drawImage(son, 850, 10, 35, 35);
  };
}
);



export const render = (ctx: CanvasRenderingContext2D, props: RenderProps) => (state: State) => {
  clear(ctx,state)

  state.pos.map((c) =>
    drawCirle(
      ctx,
      props,
      c.coord,
      computeColor(c.life, conf.BALLLIFE, COLORS.GREEN)
    ) 
  )

const tenthBlocksIndices: number[] = [];

  for (let i = 9; i < 30; i += 10) {
    tenthBlocksIndices.push(i);
  }
  
  state.sq.forEach((s, index) => {
    if (s.invincible) {
      const shineGradient = ctx.createRadialGradient(
        s.coord.x + s.coord.dx / 2, s.coord.y + s.coord.dy / 2, 0,
        s.coord.x + s.coord.dx / 2, s.coord.y + s.coord.dy / 2, Math.max(s.coord.dx, s.coord.dy) / 2
      );
      shineGradient.addColorStop(0, 'rgba(200, 200, 200, 0.7)');
      shineGradient.addColorStop(0.5, 'rgba(200, 200, 200, 0.3)');
      shineGradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
  
      ctx.fillStyle = shineGradient;
  
      ctx.fillRect(s.coord.x, s.coord.y, s.coord.dx, s.coord.dy);
    } else if (s.life == 1){
      ctx.fillStyle = 'yellow';
      ctx.fillRect(s.coord.x, s.coord.y, s.coord.dx, s.coord.dy);
    }
    else if (s.life == 2){
      ctx.fillStyle = 'orange';
      ctx.fillRect(s.coord.x, s.coord.y, s.coord.dx, s.coord.dy);
    }
    else if (s.life == 3){
      ctx.fillStyle = 'red';
      ctx.fillRect(s.coord.x, s.coord.y, s.coord.dx, s.coord.dy);
    }
    
  });




  state.bonus.map((b) => {
    if (b.type === 0) {
      drawCircleImage(ctx, props, b.coord, image4);
    }
    else if (b.type === 1) {
      drawCircleImage(ctx, props, b.coord, image2);
    }
    else if (b.type === 2) {
      drawCircleImage(ctx, props, b.coord, image3);
    }

  });




  state.pos.map((c) => {
    if (!state.start)
      drawLineDirection(ctx, c.coord , state.directionShotX, state.directionShotY)
  
  })

  

  const image = new Image();
image.src = 'images/pad.png';

 ctx.drawImage(image, state.pad.coord.x-8, state.pad.coord.y-20, state.pad.coord.dx+15, state.pad.coord.dy+40);

  //draw image son
  const son = new Image();
  son.src = 'images/unmute.png';

  //draw image mute
  const mute = new Image();
  mute.src = 'images/mute2.png';

  const canvas = state.ref.current;
 //event click on sound
  const handleCanvasClick = (event: MouseEvent) => {
    const clickX = event.clientX - canvas.offsetLeft;
    const clickY = event.clientY - canvas.offsetTop;

    const soundImageX = state.size.width-200; 
    const soundImageY = 10;
    const soundImageWidth = 35;
    const soundImageHeight = 35;

      const muteImageX = state.size.width-100; 
      const muteImageY = 10;
      const muteImageWidth = 35;
      const muteImageHeight = 35;

    if (
      clickX >= soundImageX &&
      clickX <= soundImageX + soundImageWidth &&
      clickY >= soundImageY &&
      clickY <= soundImageY + soundImageHeight
    ) {
      toggleMute(); // Appel de la fonction pour basculer la sourdine
    }

    if (
      clickX >= muteImageX &&
      clickX <= muteImageX + muteImageWidth &&
      clickY >= muteImageY &&
      clickY <= muteImageY + muteImageHeight
    ) {
      openSound();  
    }
  };

  // Événement pour détecter les clics sur le canvas
  canvas.addEventListener('click', handleCanvasClick);

  // Fonction pour basculer la sourdine
  const toggleMute = () => {
      backgroundMusic.play();
  };

  if (backgroundMusic.paused) {
    ctx.drawImage(son,state.size.width-200,10,35,35);
  } else {
    ctx.drawImage(mute,state.size.width-100,10,35,35);
  }

  const openSound = () => {
      backgroundMusic.pause();
  };

  if (state.life === 0) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
  }


  displayGameText(ctx)(state)
}

