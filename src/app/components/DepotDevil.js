import { Gltf } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils } from "three";

export function DepotDevil({gameState}) {
    const devilRef = useRef();
    const {positions} = gameState;
    const {start, end} = positions;

    useFrame(({clock}, delta) => {

        if(gameState.events.homerSafe) {
            gameState.triggerMenu({
                state: 'Game Won',
                score: (gameState.scores.timeLeft/2 + gameState.scores.coins*2) - (clock.getElapsedTime()/2)
            });
        }

        if(gameState.scores.coins < 0) {
            gameState.triggerMenu({
                state: 'Game Over',
                score: (gameState.scores.timeLeft/2 + gameState.scores.coins*2) - (clock.getElapsedTime()/2)
            });
        }

        if(gameState.events.homerCaught) {
            devilRef.current.position.set(start[0], start[1]*-4-3, 0)
            gameState.scores.coins = gameState.scores.coins - 1;
            gameState.events.homerCaught = false;
        }

        if(gameState.events.chaseTriggered) {
            if(!gameState.events.homerCaught) {
                devilRef.current.position.set(
                    MathUtils.damp(devilRef.current.position.x, gameState.positions.homer[0], 1, delta),
                    MathUtils.damp(devilRef.current.position.y, gameState.positions.homer[1], 1, delta),
                    0
                );
            } 
            
            if(gameState.positions.homer[0] < devilRef.current.position.x ) {
                devilRef.current.rotation.y = MathUtils.damp(devilRef.current.rotation.y, -Math.PI/2, 5, delta)
            } else {
                devilRef.current.rotation.y = MathUtils.damp(devilRef.current.rotation.y, Math.PI/2, 5, delta)
            }

            gameState.events.homerSafe = Math.abs(gameState.positions.homer[0] - start[0] ) < 1 && 
                                        Math.abs(gameState.positions.homer[1] - start[1] ) < 3

            gameState.events.homerCaught = Math.abs(gameState.positions.homer[0] - devilRef.current.position.x ) < 1 && 
                                        Math.abs(gameState.positions.homer[1] - devilRef.current.position.y ) < 1

            gameState.events.chaseTriggered = !gameState.events.homerSafe;

        }
    })

    return <Gltf ref={devilRef} src="/models/AngryHammer/scene.gltf" position={[-50, 50, 0]} rotation={[0, Math.PI/2, 0]} scale={40}/>;
}