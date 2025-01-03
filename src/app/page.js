'use client'

import { KeyboardControls, Stats} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { Physics, Debug } from '@react-three/cannon';
import Scene from "./scenes/Scene";
import { Suspense, useRef, useState } from "react";
import { getKeyLocation, parseMeshes } from "./utils";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import levels from "./utils/levels";
import MainMenu from "@/pages/MainMenus";
import GameOver from "@/pages/GameOver";
import LoadScreen from "./components/LoadScreen";

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState();

  const gameState = useRef({
    models: {},
    positions: { start: [0, 0, 0], end: [0, 0, 0], homer: [0, 0, 0] },
    scores: { coins: 0, timeLeft: 0 },
    events: { chaseTriggered: false, homerCaught: false, homerSafe: false},
    triggerMenu: (event)=>{setCurrentLevel(event)}
  })

  function handlePlayButton() {
    let chosenLevel = 'level_001';

    gameState.current.positions = {
      start: getKeyLocation(levels[chosenLevel]?.platforms, 'S') || [0, 0, 0],
      end: getKeyLocation(levels[chosenLevel]?.platforms, 'E') || [0, 0, 0],
      homer: getKeyLocation(levels[chosenLevel]?.platforms, 'S') || [0, 0, 0]
    }

    setCurrentLevel(chosenLevel)
  }

  return (
    <main >
      <MainMenu currentLevel={currentLevel} handlePlayButton={handlePlayButton}/>
      <GameOver currentLevel={currentLevel} handlePlayButton={handlePlayButton}/>

      {
        levels[currentLevel] && 
        <div className="h-screen w-screen absolute top-0">
            {/* TODO: Implment true window resizing */}
          <KeyboardControls
            map={[
              { name: "left", keys: ["ArrowLeft", "a", "A"] },
              { name: "right", keys: ["ArrowRight", "d", "D"] },
              { name: "jump", keys: ["Space","ArrowUp", "w", "W"] },
            ]}
          >
            {/* TODO: Implement some throttling for weaker CPUS */}
            <Canvas>
              <Physics gravity = {[0, -9.81 * 2 , 0]}>
                {/* <Debug> */}
                  <Scene gameState={gameState} level={levels[currentLevel]}/>
                {/* </Debug> */}
              </Physics>
            </Canvas>
          </KeyboardControls>
        </div>
      }

    </main>
  );
}
