import { useRef, useEffect, useState } from 'react'
import Loader from './components/loader'
import Canvas from './components/canvas'
import './App.css'
import ChessboardCanvas from './pathfinding'; 
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import Loss from './Loss';
import Win from './WinMenu';

type Size = {
  height: number; 
  width: number; 
}


const App = () => {
  const [size, setSize] = useState<Size | null>(null)
  const [niveau, setNiveau] = useState<string>("niveau1") 
  const container = useRef<any>()
  useEffect(() => {
    setTimeout(() => {
      if (container.current) { // Vérifiez si container.current existe avant d'accéder à clientHeight
        setSize({
          height: container.current.clientHeight,
          width: container.current.clientWidth,
        });
      }
    }, 100)
  })
  const navigate = useNavigate(); 

  const handleCanvasChange = () => {
    navigate('/stage'); // Déclenchez la navigation vers '/stage'
  };

  const handlePlay = () => {
    setNiveau("niveau1")
    navigate('/map'); // Déclenchez la navigation vers '/map'
  }
  const handleNiveau2 = () => {
    setNiveau("niveau2")
    navigate('/map'); // Déclenchez la navigation vers '/map'
  }
  const handleNiveau3 = () => {
    setNiveau("niveau3")
    navigate('/map'); // Déclenchez la navigation vers '/map'
  }
  const handleNiveau4 = () => {
    setNiveau("niveau4")
    navigate('/map'); // Déclenchez la navigation vers '/map'
  }
  const handleChangeEnd = () => {
    navigate('/loss'); // Déclenchez la navigation vers  l'ecran de defaite
  }
  const goHome = () => {
    navigate('/'); // Déclenchez la navigation vers '/'
  }

  const niveauSuivant = () => {
    let level =parseInt(niveau.charAt(niveau.length - 1), 10)  +1
    level = level > 4 ? 1 : level
    setNiveau("niveau"+level)
    navigate('/map'); // Déclenchez la navigation vers '/map'
  }
  
  const handleChangeWin = () => {
    navigate('/win'); // Déclenchez la navigation vers l'ecran de victoire
  }
  return (
    
    <div className="App" ref={container}>
    <Routes>changeLevel
        <Route path="/stage" element={size ? <Canvas {...size} level={niveau}  handleEnd={handleChangeEnd} handleWin={handleChangeWin}/> : <Loader />}/> 
         <Route path="/map" element={size ? <ChessboardCanvas {...size} onChangeCanvas={handleCanvasChange} level={niveau} /> : <Loader />}  />
        <Route path="/" element={<Menu onChangePlay={handlePlay} onChangeNiveau2={handleNiveau2} onChangeNiveau3={handleNiveau3}
       onChangeNiveau4={handleNiveau4} />} />
      <Route path="/loss" element={<Loss onChangeCanvas={handleCanvasChange} changeHome={goHome} />} />
      <Route path="/win" element={<Win changeLevel={niveauSuivant} changeHome={goHome} />} />

      </Routes> 

    </div>
  )
}

export default App
