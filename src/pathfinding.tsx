import React, { useState, useRef, useEffect } from 'react';
import { State_map, handleKeyMove ,findOptimalPath} from './state_pathfinding';

export type CanvasProps = {
  width: number;
  height: number;
  onChangeCanvas: () => void;
  level: string;
};

export interface GridSquare {
  x: number;
  y: number;
  size: number;
  obstacle: boolean;
  f: number;
  g: number;
  h: number;
  parent?: GridSquare;
}

const ChessboardCanvas: React.FC<CanvasProps> = ({ width, height, onChangeCanvas,level }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [path, setPath] = useState<GridSquare[] | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const squareSize = width / 8; // Calculer la taille des cases en fonction de la largeur
  const boardSize = squareSize * 8;
  console.log(level)
   const grid: GridSquare[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * squareSize;
      const y = row * squareSize;
      const obstacle = false;
      const square = { x, y, size: squareSize , obstacle,f: 0, g: 0, h: 0, parent: undefined};
      grid.push(square);
    }
  }

  const initialState: State_map =     {
    size: { width, height },
    chara: grid[0]
  };
  let niveau = grid[10];
  if (level === "niveau1") {
   niveau = grid[10]
  }
  if (level === "niveau2") {
    niveau = grid[17]
   }
    if (level === "niveau3") {
      niveau = grid[27]
    }

  const startPoint = initialState.chara;
  function drawPath(path: GridSquare[]) {
    if (!ctx) return; // Vérifier si le contexte 2D est disponible

    ctx.strokeStyle = "red"; // Couleur du chemin
    ctx.lineWidth = 3; // Épaisseur de la ligne

    // Commencer le dessin du chemin
    ctx.beginPath();

    // Dessiner une ligne reliant chaque case dans le chemin
    for (let i = 0; i < path.length; i++) {
        const square = path[i];
        let centerX = square.x + square.size / 2;
        (i==0)? centerX = square.x + square.size-30 : centerX = square.x + square.size / 2;
        let centerY = square.y + square.size / 2;
        if (i === 0 && path[i + 1].y<square.y) {
            centerX = square.x + square.size / 2;
            centerY = square.y+30;
        }
        if (i === 0 && path[i + 1].y>square.y) {
            centerX = square.x + square.size/2;
            centerY = square.y + square.size-30;
        }
        if (i === 0 && path[i + 1].x<square.x) {
            centerX = square.x+30;
            centerY = square.y + square.size / 2;
        }

        if (i === 0) {
            // Déplacer le stylo vers le premier point du chemin
            ctx.moveTo(centerX, centerY);
        } else {
            // Dessiner une ligne vers le point suivant du chemin
            ctx.lineTo(centerX, centerY);
        }
    }

    // Terminer le dessin du chemin
    ctx.stroke();
}


  const checkCharacterPosition = (characterPosition: GridSquare) => {
    // Vérifiez si le personnage atteint une certaine case
    if (characterPosition.x === niveau.x && characterPosition.y === niveau.y) {
      // Déclenchez le changement de canvas
      iterer = false;
      onChangeCanvas(); // À implémenter
      const canvas = canvasRef.current;

    }
  };

  if (path) {
    drawPath(path);
  }
  
  const state = useRef<State_map>(initialState);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (state.current && ctx) {
        state.current = handleKeyMove(event, state.current,obstacles,grid);
        ctx.clearRect(0, 0, width, height);
        render(ctx, state.current,path);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [ctx, width, height,path]);

  useEffect(() => {
    if (canvasRef.current) {
      
      initCanvas(iterate)(canvasRef.current);
      
    const path = findOptimalPath(grid,startPoint,niveau,squareSize);
    setPath(path)
    }
  }, []);
  let iterer = true;
  const iterate = (ctx: CanvasRenderingContext2D) => {
    if (state.current && iterer) {
      render(ctx, state.current,path);
      checkCharacterPosition(state.current.chara); // Vérifiez la position du personnage à chaque itération
      requestAnimationFrame(() => iterate(ctx));
    }
  };
  const obstacles: GridSquare[] = [];
  //je place les obstacles
  grid[8].obstacle = true;
  grid[12].obstacle = true;
  obstacles.push(grid[8]);
  obstacles.push(grid[12]);

  const initCanvas =
    (iterate: (ctx: CanvasRenderingContext2D) => void) =>
    (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    setCtx(ctx); 
    if (!ctx) return
    requestAnimationFrame(() => iterate(ctx))
  };
 
  const render = (ctx: CanvasRenderingContext2D, state: State_map,path: GridSquare[] | null) => {
    const squareSize = width / 8; // Calculer la taille des cases en fonction de la largeur
    const boardSize = squareSize * 8;

    // Dessiner l'image de fond
    const backgroundImage = new Image();
    backgroundImage.src = 'images/background.webp';
    backgroundImage.onload = () => {
      ctx.drawImage(backgroundImage, 0, 0, width, height);
    };
   
    // Dessiner les lignes verticales et horizontales pour créer un quadrillage
    ctx.strokeStyle = '#000';
    for (let i = 0; i <= 8; i++) {
      // Dessiner les lignes verticales
      ctx.beginPath();
      ctx.moveTo(i * squareSize, 0);
      ctx.lineTo(i * squareSize, boardSize);
      ctx.stroke();

      // Dessiner les lignes horizontales
      ctx.beginPath();
      ctx.moveTo(0, i * squareSize);
      ctx.lineTo(boardSize, i * squareSize);
      ctx.stroke();
    }

    // Dessiner les numéros et lettres des colonnes et lignes
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    for (let i = 0; i < 8; i++) {
      ctx.fillText(String.fromCharCode(97 + i), i * squareSize + 20, boardSize + 20);
      ctx.fillText(String.fromCharCode(49 + i), boardSize + 10, i * squareSize + 35);
    }

    //dessiner le chemin optimal
    const path2 = findOptimalPath(grid,startPoint,niveau,squareSize);
    setPath(path2)
    if (path) {
      drawPath(path);
    }

    // Dessiner le personnage sur sa position actuelle
    if (state.chara) {
      const perso = new Image();
      perso.src = 'images/perso.png';
      ctx.drawImage(perso, grid[0].x, grid[0].y, grid[0].size, grid[0].size);
    }

      const niv1 = new Image();
      niv1.src =   `images/galaxy${level.charAt(level.length - 1)}.jpg`;
      ctx.drawImage(niv1,niveau.x,niveau.y, niveau.size, niveau.size);
      ctx.font = '40px arial';
      ctx.fillStyle = 'red';
      ctx.fillText(
        `niveau ${level.charAt(level.length - 1)}`,
        niveau.x +100,
        niveau.y + niveau.size / 2        
      );
      const perso = new Image();
      perso.src = 'images/asteroide.png';
    
    ctx.drawImage(perso, grid[8].x, grid[8].y, grid[8].size, grid[8].size);
    ctx.drawImage(perso, grid[12].x, grid[12].y, grid[12].size, grid[12].size);
  };
  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default ChessboardCanvas;
