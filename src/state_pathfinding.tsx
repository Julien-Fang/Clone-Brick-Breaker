import {CanvasProps, GridSquare} from './pathfinding'; 
export type State_map = {  size: Size; chara : GridSquare }
export type Size = { height: number; width: number }


function calculateDistance(s: number,d: number, end: GridSquare): number {
  // Distance de Manhattan
  return Math.abs(s - end.x) + Math.abs(d - end.y);
}
function findNearestGridSquare(s: number,d: number, grid: GridSquare[]): GridSquare  {
  let nearestSquare: GridSquare = grid[0];
  let minDistance = Number.MAX_VALUE;
  for (const square of grid) {
      const distance = calculateDistance(s,d, square);
      if (distance < minDistance) {
          minDistance = distance;
          nearestSquare = square;
      }
  }
  return nearestSquare;
}

export const handleKeyMove = (event: KeyboardEvent, state: State_map,obstacles: GridSquare [],grid: GridSquare []): State_map => {
    // Créer une copie de l'état actuel
    const squareSize = state.size.width / 8;
    const newState: State_map = { ...state };
    switch (event.key) {
      case "d":
        let f = findNearestGridSquare(newState.chara.x + squareSize,newState.chara.y, grid)
        if(obstacles.includes(f)){
          break;
        }
        if (newState.chara.x + newState.chara.size + 10  > newState.size.width 
          ) {
          newState.chara.x = newState.size.width - newState.chara.size;
        }
        else {
          newState.chara.x  += squareSize;
        }
        break;
      case "q":
        let a = findNearestGridSquare(newState.chara.x - squareSize,newState.chara.y, grid)
        if(obstacles.includes(a)){
          break;
        }
        if (newState.chara.x - 10 < 0) {
          newState.chara.x = 0;
        }
        else {
          newState.chara.x -= squareSize;
        }
        break;
      case "z":
        let near = findNearestGridSquare(newState.chara.x ,newState.chara.y- squareSize, grid)
        if(obstacles.includes(near)){
          break;
        }
        if (newState.chara.y - 10 < 0) {
          newState.chara.y = 0;
        }
        else {
          newState.chara.y -= squareSize;
        }
        break;
      case "s":
        let nearsquare = findNearestGridSquare(newState.chara.x ,newState.chara.y+ squareSize, grid)
        if(obstacles.includes(nearsquare)){
          break;
        }
        if (newState.chara.y + newState.chara.size + 10 > newState.size.height) {
          break;
        }
        else {
          newState.chara.y += squareSize;
        }
        break;

    }
    return newState;
  }

export function findOptimalPath(grid: GridSquare[],start: GridSquare, end: GridSquare,squareSize: any): GridSquare[] | null {
  
  // Fonction pour calculer la distance entre deux points (heuristique)
  function calculateDistance(start: GridSquare, end: GridSquare): number {
      // Distance de Manhattan
      return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  }

  // Fonction pour trouver le chemin optimal en utilisant l'algorithme A*
  function findPath(start: GridSquare, end: GridSquare): GridSquare[] | null {
    const openList: GridSquare[] = [start];
    const closedList: GridSquare[] = [];

    while (openList.length > 0) {
        // Sélection de la case avec le coût total le plus bas
        const currentSquare = openList.reduce((prev, curr) => (curr.f < prev.f ? curr : prev));
        if(currentSquare.x == grid[14].x && currentSquare.y == grid[14].y){
        }  
        // Déplacer cette case de la liste ouverte à la liste fermée
        openList.splice(openList.indexOf(currentSquare), 1);
        closedList.push(currentSquare);

        // Si on atteint la case d'arrivée, reconstruire et retourner le chemin
        if (currentSquare === end) {
            const path: GridSquare[] = [];
            let current: GridSquare | undefined = currentSquare;
            while (current) {
                path.unshift(current);
                current = current.parent;
            }
            return path;
        }

        // Définir les positions des cases voisines (haut, bas, gauche, droite)
        const neighbors: GridSquare[] = [
          grid.find(square => square.x === currentSquare.x && square.y === currentSquare.y - squareSize), // Case au-dessus
          grid.find(square => square.x === currentSquare.x && square.y === currentSquare.y + squareSize), // Case en dessous
          grid.find(square => square.x === currentSquare.x - squareSize && square.y === currentSquare.y), // Case à gauche
          grid.find(square => square.x === currentSquare.x + squareSize && square.y === currentSquare.y) // Case à droite
        ].filter((neighbor): neighbor is GridSquare => !!neighbor);

        // Parcourir les cases voisines
        for (const neighbor of neighbors) {
          // Vérifier si la case voisine existe et n'est pas un obstacle
          if (neighbor && !neighbor.obstacle) {
              // Vérifier si la case voisine n'est pas déjà dans la liste des cases fermées
              if (!closedList.includes(neighbor)) {
                  const g = currentSquare.g + 150; // Coût de déplacement
      
                  // Si la case n'est pas dans la liste ouverte, l'ajouter
                  if (!openList.includes(neighbor)) {
                      neighbor.g = g;
                      neighbor.h = calculateDistance(neighbor, end);
                      neighbor.f = neighbor.g + neighbor.h;
                      neighbor.parent = currentSquare;
                      openList.push(neighbor);
                  } else if (g < neighbor.g) {
                      // Si le nouveau coût total est inférieur à l'ancien, mettre à jour
                      neighbor.g = g;
                      neighbor.f = neighbor.g + neighbor.h;
                      neighbor.parent = currentSquare;
                    }
              } 
          }
      }
    }

    // Aucun chemin trouvé
    return null;
  }
  // Ajouter les propriétés nécessaires pour l'algorithme A* à chaque case
  for (const square of grid) {
      square.f = 0;
      square.g = 0;
      square.h = 0;
      square.parent = undefined;
  }

  // Appel de la fonction pour trouver le chemin optimal
  return findPath(start, end);
}