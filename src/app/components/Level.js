import { useBox } from "@react-three/cannon";
import { useFrame } from '@react-three/fiber'

import { parsePlatforms } from "../utils";
import { Outlines } from "@react-three/drei";
import { useState } from "react";

export default function Level({level, gameState}) {
    const {models, positions, events} = gameState;
    const {start} = positions;

    // TODO: Look into making sure Homer doesnt move in z index
    useBox(() => ({ args:[10000, 10000, 1], position: [0, 0, -1.35]}))
    useBox(() => ({ args:[10000, 10000, 1], position: [0, 0, 1.35] }))

    let Platforms = parsePlatforms(level.platforms);

    return (
        <>
            <DangerCoin gameState={gameState}/>
   
            <StartingTower models={models} startPosition={start}/>
            
            {Platforms.map((tier, yCoord)=>[
                tier.map((platform)=>{
                    const {xCoord, length: size, platformType} = platform;

                    return <Platform 
                        key={`[${xCoord}, ${yCoord}] - ${platformType}`} 
                        meshes={models.platforms} 
                        position={[xCoord, (yCoord*-4), 0]} 
                        size={size} 
                        platformType={platformType}
                        platformDecorations={models}
                        />
                })
            ])}
        </>
    )
}


function Platform({meshes, position, size, platformType, platformDecorations}){
    const [ref, api] = useBox(() => ({ args:[size*1.2, 2, 3], position: position }))

    const platformDecorationsMeshes = {
        grass: {
            mesh: platformDecorations?.grass,
            positions: [Math.random()  * (Math.round(Math.random()) * 2 - 1), .5, 0],
            treshold: 2
        },
        moreGrass: {
            mesh: platformDecorations?.grass,
            positions: [Math.random()  * (Math.round(Math.random()) * 5 - 1), -.5, 0],
            treshold: 5
        },
        fences: {
            mesh: platformDecorations?.fence[0]?.children,
            positions: [Math.floor(Math.random() * 2) * (Math.round(Math.random()) * 2 - 1), 1, 1],
            treshold: 5
        },
        bushLocation: {
            mesh: platformDecorations?.bush[0]?.children,
            positions: [Math.floor(Math.random() * 2)  * (Math.round(Math.random()) * 2 - 1), 1, -1],
            treshold: 5
        },
        trees: {
            mesh: platformDecorations?.tree[0]?.children,
            positions: [Math.random()  * 3 * (Math.round(Math.random()) * 2 - 1), 1, 1],
            treshold: 6
        }
    }


    useFrame(({clock})=>{
        if(!!platformType) {
            // TODO: Shifting platforms should move Homer
            api.position.set(
                position[0] + (Math.sin(clock.getElapsedTime() * 2) * (+ !!(platformType === 'shifting'))), 
                position[1] + (Math.sin(clock.getElapsedTime() * 2) * (+ !!(platformType === 'lifting'))), 
                0)
        }

    })

    return(
        <group position={position} ref={ref} name={platformType}>
            {Object.values(platformDecorationsMeshes).map((decoration, index)=>{
                    const { mesh, positions, treshold} = decoration;

                    return  <group key={index} position={positions} scale={.5} visible={treshold <= size && !!(Math.round(Math.random())-1)}>
                                {mesh.map((child, index) => <mesh key={index} material={child.material} geometry={child.geometry}>
                                    <Outlines thickness={0.01}/>
                                </mesh>)}
                            </group>})}

            <group scale={[size/2, 1, 1]}>
                {meshes?.children?.map((child, index)=> <mesh key={index} material={child.material} geometry={child.geometry}>
                    <Outlines thickness={0.011}/>
                </mesh>)}
            </group>
        </group>

    )
}

function DangerCoin({gameState}) {
    const {models, positions, events} = gameState;

    const [visible, setIsVisible] = useState(true)

    const [ref, api] = useBox(() => ({ 
        args:[1, 1, 1], 
        onCollide: (e) =>  {
            setIsVisible(false)
            // TODO: Need to find a proper way of removing coins
            api.position.set(0, 0, -1000)
            gameState.events.chaseTriggered = true;
        },
        position: [positions.end[0], positions.end[1]*-4-2, 0] }))

        useFrame(({clock}, delta)=>{
            api.rotation.set(0, clock.getElapsedTime() * 5, 0, 'XYZ')
        })

    return (<>
                <group ref={ref} visible={visible} position={[positions.end[0], positions.end[1]*-4-2, 0]}>
                    {models?.coin?.children?.map((child, index)=> <mesh key={index} material={child.material} geometry={child.geometry}>
                        <Outlines thickness={0.1} color="red" />
                    </mesh>)}
                </group>
                <group position={[positions.end[0]-1.5, positions.end[1]*-4-3, -.5]} scale={.5}>
                    {models?.arrow[0].children.map((child, index)=> <mesh key={index} material={child.material} geometry={child.geometry}>
                            <Outlines thickness={0.01}/>
                        </mesh>)}
                </group>
                <group position={[positions.end[0]+1.5, positions.end[1]*-4-3, -.5]} rotation={[ 0, Math.PI , 0]} scale={.5}>
                    {models?.arrow[0].children.map((child, index)=> <mesh key={index} material={child.material} geometry={child.geometry}>
                            <Outlines thickness={0.01}/>
                        </mesh>)}
                </group>
            </>)
}

function StartingTower({models, startPosition}) {
    console.log(startPosition)

    return(
        <group position={[startPosition[0], startPosition[1]*-4-3, -.5]} scale={.5}>
            {models?.tower[0].children.map((child, index)=> <mesh key={index} material={child.material} geometry={child.geometry}>
                <Outlines thickness={0.01}/>
            </mesh>)}
        </group>
    )
}