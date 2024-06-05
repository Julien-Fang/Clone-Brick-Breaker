import * as conf from './conf'
import { useRef, useEffect, useState } from 'react'
import { State, step, endOfGame, Square, Pad, handleKeyMovePad } from './state' 
import { render, RenderProps } from './renderer'

export const randomSign = () => Math.sign(Math.random() - 0.5)
export const taille_rec = 30;
const initCanvas =
  (iterate: (ctx: CanvasRenderingContext2D) => void) =>
  (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    requestAnimationFrame(() => iterate(ctx))
  }

  interface CanvasProps {
    height: number;
    width: number;
    level: string; // Ajoutez la propriété level dans les props du composant
    handleEnd: () => void;
    handleWin: () => void;
  }
  
  const Canvas: React.FC<CanvasProps> = ({ height, width, level,handleEnd,handleWin }) => {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = ref.current; // Récupérer la référence au canvas
    const context = canvas.getContext('2d'); // Obtenir le contexte 2D du canvas

    if (context) {
      setCtx(context); 
      initCanvas(iterate)(canvas); // Initialiser le canvas
    }
  }, []); 



  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (state.current) {
        state.current = handleKeyMovePad(event, state.current);
        if (!state.current.start){
          state.current.pos[0].coord = {
            x: state.current.pad.coord.x+state.current.pad.coord.dx/2,
            y: padd.coord.y-conf.RADIUS-5,
            dx: 0, 
            dy: 0,
          }
        }
        if (ctx) { 
          render(ctx, {
            pos: posRef.current,
            scale: scaleRef.current,
          })(state.current); // Mettre à jour le rendu après chaque déplacement du pad
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [ctx]); // Effect exécuté à chaque changement de ctx

  height = height; //Ici pour modifier
  width = width/2;

  // Hashmap pour les niveaux et les tableaux de briques
  let mymap : Map<string, Array<Square>> = new Map();
  let tabSqNiv1: Array<Square> = [];
  let tabSqNiv2: Array<Square> = [];
  let tabSqNiv3: Array<Square> = [];
  let tabSqNiv4: Array<Square> = [];

  // Niveau 1
  let tmpYNiv1 = 50;
  let vraiWidth = width - 2*width/15 - 9*10;
  let tmpXNiv1 = width/15 ;
  for ( let y=0; y< 3; y++){
    for ( let x=0; x< 10; x++){
        let life = Math.floor(Math.random() * 3) + 1;
        const rectangle: Square = { life : life,
          coord: {x :tmpXNiv1, y: tmpYNiv1, dx : vraiWidth/10 ,dy : height/30 } };
        tabSqNiv1.push(rectangle);
        tmpXNiv1 += vraiWidth/10 +10;
    }
    tmpYNiv1 += 10 + height/30;
    tmpXNiv1 = width/15;
  }


  // Niveau 2
  let tmpYNiv2 = 50;
  let vraiWidth2 = width - 2*width/15 - 9*10;
  let tmpXNiv2 = width/15 ;
  for ( let y=0; y< 4; y++){
    for ( let x=0; x< 10; x++){
        let life = Math.floor(Math.random() * 3) + 1;
        const rectangle: Square = { life : life,
          coord: {x :tmpXNiv2, y: tmpYNiv2, dx : vraiWidth2/10 ,dy : height/30 } };
        tabSqNiv2.push(rectangle);
        tmpXNiv2 += vraiWidth2/10 +10;
    }
    tmpYNiv2 += 10 + height/30;
    tmpXNiv2 = width/15;
  }

  //les briques qu'on veut invincible ici tout les 5 eme avec une probabilité de 0.5
  for (let i = 0; i < tabSqNiv2.length; i +=5) {
    if (Math.random() < 0.5) {
      tabSqNiv2[i].life = Infinity;
      tabSqNiv2[i].invincible = 1 
   }
  }

  // Niveau 3
  let tmpYNiv3 = 50;
  let vraiWidth3 = width - 2*width/15 - 9*10;
  let tmpXNiv3 = width/15 ;
  for ( let y=0; y< 4; y++){
    for ( let x=0; x< 10; x++){
        let life = Math.floor(Math.random() * 3) + 1;
        const rectangle: Square = { life : life,
          coord: {x :tmpXNiv3, y: tmpYNiv3, dx : vraiWidth3/10 ,dy : height/30 } };
        tabSqNiv3.push(rectangle);
        tmpXNiv3 += vraiWidth3/10 +10;
    }
    tmpYNiv3 += 10 + height/30;
    tmpXNiv3 = width/15;
  }

  //les briques qu'on veut invincible ici tout les 3 eme avec une probabilité de 0.75
  for (let i = 0; i < tabSqNiv3.length; i +=3) {
    if (Math.random() < 0.75) {
      tabSqNiv3[i].life = Infinity;
      tabSqNiv3[i].invincible = 1 
   }
  }


  // Niveau 4
  let tmpYNiv4 = 50;
  let vraiWidth4 = width - 2*width/15 - 9*10;
  let tmpXNiv4 = width/15 ;
  let expert = false;
  for ( let y=0; y< 4; y++){
    for ( let x=0; x< 10; x++){
      if (expert) {
        const rectangle: Square = { life : Infinity,
          coord: {x :tmpXNiv4, y: tmpYNiv4, dx : vraiWidth4/10 ,dy : height/30 },
          invincible: 1
        };
        tabSqNiv4.push(rectangle);
        tmpXNiv4 += vraiWidth4/10 +10;
        expert = false;
    } else {
        let life = Math.floor(Math.random() * 3) + 1;
        const rectangle: Square = { life : life,
          coord: {x :tmpXNiv4, y: tmpYNiv4, dx : vraiWidth4/10 ,dy : height/30 } };
        tabSqNiv4.push(rectangle);
        tmpXNiv4 += vraiWidth4/10 +10;
        expert = true;
      }
    }
    tmpYNiv4 += 10 + height/30;
    tmpXNiv4 = width/15;
  }

  mymap.set("niveau1", tabSqNiv1);
  mymap.set("niveau2", tabSqNiv2);
  mymap.set("niveau3", tabSqNiv3);
  mymap.set("niveau4", tabSqNiv4);



  let padd: Pad = { life : 1,
    coord: {x :400, y: height-60, dx : width/10 ,dy : height/40 },
    invincible: 1000}
  

  const ref = useRef<any>()

  let levelSq = mymap.get(level) ;

  const initialState: State = {
    pos: new Array(1).fill(1).map((_) => ({
      speed: 2,
      life: conf.BALLLIFE,
      coord: {
        x: padd.coord.x+padd.coord.dx/2,
        y: padd.coord.y-conf.RADIUS-5,
        dx: 0, 
        dy: 0, 
      },
    })),
    life: 4,
    sq: levelSq || [], 
    pad:padd  ,
    size: { height, width },
    endOfGame: true,
    end:false,
    win:false,
    ref: ref,
    score: 0,
    start: false,
    directionShotX : 0.1,
    directionShotY : Math.min(-0.1, -Math.sqrt(1 - 0.1 ** 2)),
    cptBall: 1,
    bonus : [], // Array<BonusBall>
    downSquare: 1,
  }
  
  const state = useRef<State>(initialState)
 

  const scaleRef = useRef<number>(1)
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const drag = useRef<boolean>(false)
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const downTS = useRef<number>(Date.now())


  const iterate = (ctx: CanvasRenderingContext2D) => {
    if(!state.current.end && !state.current.win){
      state.current = step(state.current)
      state.current.endOfGame = !endOfGame(state.current)
      render(ctx, {
        pos: posRef.current,
        scale: scaleRef.current,
      })(state.current)
      if (!state.current.endOfGame) requestAnimationFrame(() => iterate(ctx))
    }else{
      if (state.current.end) {
          handleEnd()
      }
      else  {
        handleWin()
      }
  }
  }

  
  useEffect(() => {
  
    initCanvas(iterate)(ref.current)

    return () => {
   
    }
  }, [])



  return (
    <div style={{ position: 'relative' }}>
      <canvas {...{ height, width, ref }} />
    </div>
  );
};

export default Canvas