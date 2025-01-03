import { Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function LoadScreen ({gameState}) {
    const loadScreen = useRef();
    
    useFrame(({clock})=>{
        if(loadScreen.current.material.opacity > 0 ) {
            console.log('render')
            loadScreen.current.material.opacity = loadScreen.current.material.opacity - .01;
        }

        loadScreen.current.position.set( gameState.positions.homer[0], gameState.positions.homer[1], 5) 
    })

    return (
        <Image ref={loadScreen} scale={[5.5, 3.1, 1]} alt="loading screen" url={"/LoadScreen.jpeg"} transparent />
    )
}