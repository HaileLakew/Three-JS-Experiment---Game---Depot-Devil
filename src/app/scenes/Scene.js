/* eslint-disable @next/next/no-img-element */
import Homer from "../components/Homer";
import Level from "../components/Level";
import Rewards from "../components/Rewards";

import SkyBox from '../components/SkyBox';
import Camera from '../components/Camera';
import HUD from '../components/HUD';
import { OrbitControls, Stats } from '@react-three/drei';
import { DepotDevil } from '../components/DepotDevil';
import { parseMeshes } from "../utils";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import LoadScreen from "../components/LoadScreen";

export default function Scene ({gameState, level}) {

    // TODO: Load proper level assets
    gameState.current.models = parseMeshes( useLoader(GLTFLoader, '/scenes/CenteredScene.gltf'))
    
    if(!level && !gameState.models) return;

    return(
        <>
            <ambientLight/>
            <directionalLight position={[0,0,25]}/>

            {/* <OrbitControls/> */}
            <Camera gameState={gameState.current}/>

            <HUD gameState={gameState.current}/>

            <SkyBox gameState={gameState.current}/>

            <Homer gameState={gameState.current}/>

            <DepotDevil gameState={gameState.current}/>            

            <Level level={level} gameState={gameState.current}/>

            <Rewards level={level} gameState={gameState.current}/>
            
            <LoadScreen gameState={gameState.current}/>

            <Stats/>
        </>
    )
}
