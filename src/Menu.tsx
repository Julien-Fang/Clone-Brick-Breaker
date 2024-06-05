import { useState } from 'react'
import './Menu.css'
export type CanvasProps = {
    onChangeNiveau2: () => void;
    onChangePlay: () => void;
    onChangeNiveau3: () => void;
    onChangeNiveau4: () => void;
  };
const Menu:  React.FC<CanvasProps> = ({ onChangePlay,onChangeNiveau2,onChangeNiveau3,onChangeNiveau4} )=> {
    const [showLevels, setShowLevels] = useState(true);
  return (
    <div className = "background">
    <div className="container d-flex justify-content-center align-items-center h-100">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""></script>
        { showLevels ? (
      <div className="text-center">
      <button className="btn btn-primary btn-lg mb-3" onClick={onChangePlay}>Jouer</button>
      <br />
      <button className="btn btn-primary btn-lg mb-3" onClick={ () => setShowLevels(false)}>Selectionner un niveau</button>
    </div>)
    :  (
        <div className="text-center">
        <button className="btn btn-primary btn-lg mb-3" onClick={onChangePlay}>Levels 1 </button>
        <br />
        <button className="btn btn-primary btn-lg mb-3"onClick={onChangeNiveau2}>Levels 2</button>
        <br />
        <button className="btn btn-primary btn-lg mb-3"onClick={onChangeNiveau3}>Levels 3</button>
        <br />
        <button className="btn btn-primary btn-lg mb-3"onClick={onChangeNiveau4}>Levels 4</button>
      </div>
    )
    }
    </div>
    </div>
  );
  
};
export default Menu;