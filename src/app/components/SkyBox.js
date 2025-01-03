import { Outlines, useVideoTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
export default function SkyBox({gameState}) {
    const skyBox = useRef() 
    const skyBoxMesh = useRef();
    const {models, positions} = gameState;
    const {start} = positions;

    // TODO: Maybe just a blurred image for performance sake
    const texture = useVideoTexture('/Background.mp4')

    useFrame(()=>{ 
        skyBox.current.position.set( gameState.positions.homer[0], gameState.positions.homer[1], -5) 
    })

    return (
        <group>
            {/* TODO: This is not efficient */}
            {Array(20).fill("").map((cloud, index) => {
                const cloudSize = Math.random() + .25 ;

                // TODO: Cloud positioning is not truly random nor even
                return (
                    <group key={index} position={[(Math.random()*index * 5) - 10, Math.random()*index , cloudSize < .25 ? - .5: .5]} scale={cloudSize}>
                        {models?.cloud.map((child, index) => <mesh key={index} geometry={child.geometry}>
                            <Outlines thickness={0.1} />
                        </mesh>)}
                    </group>
                )
            })}

            <group ref={skyBox} position={start} scale={2.5}>
                <mesh scale={[16, 9, 1]} >
                    <planeGeometry />
                    <meshBasicMaterial ref={skyBoxMesh} map={texture} toneMapped={false} />
                </mesh>
            </group>
        </group>
    )
}