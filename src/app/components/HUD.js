/* eslint-disable @next/next/no-img-element */
import { Html, Float, Hud, PerspectiveCamera, useGLTF, useVideoTexture, Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";

export default function HUD({gameState}) {
    const {models } = gameState;

    return (
        <Hud>
                <ambientLight/>

                <directionalLight position={[0,0,25]}/>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />

                <TVBox gameState={gameState}/>
                <CoinCount mesh={models.coin} gameState={gameState} />
                <Timer gameState={gameState}/>
        </Hud>
    )
}

function TVBox ({gameState}) {
    const { nodes, materials } = useGLTF('/models/Television/scene.gltf')
    const texture = useVideoTexture('/HomerCam.mp4')

    const tvRef = useRef();
    const messageRef = useRef();

    useFrame(({clock}, delta) => {
        if(clock.getElapsedTime() > 3) {
            messageRef.current.style.display = 'none'
            tvRef.current.scale.set(
                MathUtils.damp(tvRef.current.scale.x, .15, 2, delta),
                MathUtils.damp(tvRef.current.scale.y, .15, 2, delta),
                MathUtils.damp(tvRef.current.scale.z, .15, 2, delta)
            )
            tvRef.current.position.set(
                MathUtils.damp(tvRef.current.position.x, 6, 2, delta),
                MathUtils.damp(tvRef.current.position.y, 2.5, 2, delta),
                MathUtils.damp(tvRef.current.position.z, 0, 2, delta)
            )
            
            tvRef.current.rotation.set(
                MathUtils.damp(tvRef.current.rotation.x, 0, 2, delta),
                MathUtils.damp(tvRef.current.rotation.y, -Math.PI/5, 2, delta),
                MathUtils.damp(tvRef.current.rotation.z, 0, 2, delta)
            )
        }

        if(gameState.events.chaseTriggered) {
            messageRef.current.innerHTML='GET BACK TO TOWER';
            messageRef.current.style.display = 'block'
            messageRef.current.style.fontSize = '100px';

            tvRef.current.scale.set(
                MathUtils.damp(tvRef.current.scale.x, .25, 2, delta),
                MathUtils.damp(tvRef.current.scale.y, .25, 2, delta),
                MathUtils.damp(tvRef.current.scale.z, .25, 2, delta)
            )

            tvRef.current.position.set(
                MathUtils.damp(tvRef.current.position.x, 3, 2, delta),
                MathUtils.damp(tvRef.current.position.y, 0, 2, delta),
                MathUtils.damp(tvRef.current.position.z, 0, 2, delta)
            )

            tvRef.current.rotation.y = tvRef.current.rotation.y  + Math.sin(clock.getElapsedTime())/100
        }

    })

    return (
        <Float rotationIntensity={.2} floatIntensity={2}>
            <group ref={tvRef} position={[0, -3, 0]} scale={.5}>
                <mesh
                    geometry={nodes.TV_low_lambert3_0.geometry}
                    material={materials.lambert3}
                />
                <mesh scale={[12,8,1]} position={[-.5, 5.2, 5]}>
                    <planeGeometry />
                    <meshBasicMaterial map={texture} toneMapped={false} />
                </mesh>

                <Html occlude transform position={[-.5, 5, 5.5]}>
                    <div className="bg-black w-[450px] h-[320px] text-9xl" ref={messageRef}>Get Coins</div>
                </Html>
            </group>
        </Float>
    )
}

function CoinCount ({mesh, gameState}) {
    const coinRef = useRef();
    const coinCountRef = useRef();

    useFrame(({clock})=>{
        coinRef.current.rotation.y = clock.getElapsedTime()

        if(coinCountRef.current) {
            coinCountRef.current.innerHTML=gameState.scores.coins;
        }
    })

    return (
        <group position={[-6,3.5,0]} scale={.6} >
            <Plane scale={[5, 2, 0]} position={[-2, .75, -2]}>
                <meshPhongMaterial color="#000000" opacity={0.1} transparent />
            </Plane>
            <Html position={[-1.7, .5, 0]}>
                <div className="text-7xl font-black" ref={coinCountRef}/>
            </Html>
            <group ref={coinRef}>
                {mesh?.children?.map((child, index)=> <mesh key={index} material={child.material} geometry={child.geometry}/>)}
            </group>
        </group>
    )
}

function Timer ({gameState}) {
    const timeRef = useRef();

    let endTime = 0
    let timeLeft = 0;

    useFrame(({clock})=>{
        if (gameState.events.chaseTriggered && timeRef?.current) {
            
            if(!endTime) { endTime = clock.getElapsedTime() + (60 * 5)}

            if(timeLeft>=0) {
                timeLeft = endTime - clock.getElapsedTime();
                gameState.scores.timeLeft = timeLeft;
            } else {
                gameState.triggerMenu({
                    id: 'Game Over',
                    score: gameState.scores.timeLeft + gameState.scores.coins
                });
            }


            timeRef.current.innerHTML = parseInt(timeLeft / 60) + ':' +  (parseInt(timeLeft % 60) < 10 ? '0' + parseInt(timeLeft % 60) : parseInt(timeLeft % 60));
        }
    })

      return <group position={[-1.25, -3, 0]} visible={gameState.events.chaseTriggered}>
                <Plane scale={[5, 2, 0]} position={[1.5, -1.25, -2]}>
                    <meshPhongMaterial color="#000000" opacity={0.5} transparent />
                </Plane>
                <Html> 
                    <div className="text-9xl text-red-500" ref={timeRef}/> 
                </Html>
            </group>
      
}

useGLTF.preload('/models/Television/scene.gltf')