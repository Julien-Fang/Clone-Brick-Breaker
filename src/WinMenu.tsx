import { useRef, useEffect, useState } from 'react'
import Loader from './components/loader'
import Canvas from './components/canvas'
import ChessboardCanvas from './pathfinding'; // Import the ChessboardCanvas component
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import './Menu.css'
export type CanvasProps = {
    changeLevel: () => void;
    changeHome: () => void;
  };
const Win:  React.FC<CanvasProps> = ({ changeLevel,changeHome} )=> {
    const [showLevels, setShowLevels] = useState(true);
  return (
    <div className = "background">
    <div className="container d-flex justify-content-center align-items-center h-100">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""></script>
       
      <div className="text-center">
      <button className="btn btn-primary btn-lg mb-3" onClick={changeLevel}>Niveau suivant</button>
      <br />
      <button className="btn btn-primary btn-lg mb-3" onClick={ changeHome}>Menu Principal</button>
    </div>
  
    </div>
    </div>
  );
  
};
export default Win;