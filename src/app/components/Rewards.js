import { useState } from "react";
import { parseRewards } from "../utils";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Outlines } from "@react-three/drei";


export default function Rewards({level, gameState}) {
    const {models} = gameState;

    let Rewards = parseRewards(level.platforms);

    return (
        <>
            {Rewards.map((tier, yCoord)=>[
                tier.map((platform)=>{
                    const {xCoord, rewardType} = platform;

                    return <Coin 
                        key={`[${xCoord}, ${yCoord}] - ${rewardType}`} 
                        meshes={models.coin} 
                        position={[xCoord, (yCoord*-3), 0]} 
                        gameState={gameState}
                        rewardType={rewardType}
                        />
                })
            ])}
        </>
    )
}

function Coin({meshes, position, gameState}){        
    const [visible, setIsVisible] = useState(true)

    const [ref, api] = useBox(() => ({ 
        args:[1, 1, 1], 
        onCollide: (e) =>  {
            setIsVisible(false)
            // TODO: Need to find a proper way of removing coins
            api.position.set(0, 0, -1000)
            gameState.scores.coins = gameState.scores.coins + 1;
        },
        position: position }))
    
    useFrame(({clock})=>{ api.rotation.set(0, clock.getElapsedTime(), 0, 'XYZ')})

    return(
        <group visible={visible} ref={ref} position={position} scale={.8}>
            {meshes?.children?.map((child, index)=> <mesh key={index} material={child.material} geometry={child.geometry}>
                <Outlines thickness={0.015} color="yellow" />
            </mesh>)}
        </group>
    )
}