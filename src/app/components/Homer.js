/* eslint-disable react-hooks/exhaustive-deps */
import { SpriteAnimator, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSphere } from '@react-three/cannon'
import { useEffect, useRef, useState } from "react";
import { MathUtils } from 'three'


export default function Homer({gameState}) {
    const {positions} = gameState;
    const {start, end} = positions;
    
    const velocity = useRef([0, 0, 0])
    const jumpLock = useRef(false);

    const [animation, setIsAnimation] = useState('idle')
    const [isFlipped, setIsFlipped] = useState(false)
    const [toggleBattleHomer, setToggleBattleHomer] = useState(false);
    
    const [sub, get] = useKeyboardControls()
    const [ref, api] = useSphere(() => ({ 
        mass: 1, 
        position: start, 
        // onCollide: () => jumpLock.current = false, 
        onCollide: (collision) => {
            jumpLock.current = false
            // console.log(collision.contact.contactNormal);
            
            // if(collision.body.name === 'shifting') {
                // jumpLock.current = false
                // console.log(collision.body)
                // movingPlatform.current = true;
            // }
        },
        args:[.7] }))
    
    useEffect(() => {
        return sub(
          (state) => state,
          (pressed) => {
            const { left, right, jump } = pressed;

            if (right) {
                setIsAnimation('walk');
                setIsFlipped(false)
            } else if (left) {
                setIsAnimation('walk');
                setIsFlipped(true)
            } else {
                setIsAnimation('idle');
            }

            if(jump) {
                setIsAnimation('jump');
            }

            if(gameState.events.chaseTriggered) {
                setToggleBattleHomer(true)
            }
          }
        )
      }, [])

    useEffect(() => {
        const unsubscribe = api.position.subscribe((p) => (gameState.positions.homer = p))
        return unsubscribe
    }, [])

    useEffect(() => {
        const unsubscribe = api.velocity.subscribe((v) => (velocity.current = v))
        return unsubscribe
    }, [])

    useFrame(( state, delta) => {
        const { left, right, jump } = get()

        // TODO: Worth abstract speed algorithims to new files

        let rightVelocity = right && .5;
        let leftVelocity = left && -.5;

        let horizontalVelocity = leftVelocity + rightVelocity;

        api.applyImpulse([horizontalVelocity, 0, 0],  [0, 0, 0]);

        if(!jumpLock.current && jump) {
            api.velocity.set(0,15,0)
            jumpLock.current = true;
            ref.current.scale.y = MathUtils.damp(ref.current.scale.y, 2, 20, delta)
        } else if(ref.current.scale.y > 1.1) {
            ref.current.scale.y = MathUtils.damp(ref.current.scale.y, 1, 5, delta)
        }
        
        if(gameState.positions.homer[1]< -20 && !gameState.events.chaseTriggered ) {
            api.position.set(...start)
        } else if(gameState.positions.homer[1]< -20) {
            api.position.set(end[0], end[1]*-4-3, 0);
        }

        if(gameState.positions.homer[1] > 2) {
            api.velocity.set(velocity.current[0], -3 , velocity.current[2],)
        }

        if(!left && !right && !jump ){
            if(velocity?.current[0] < 0) {
                api.velocity.set(0,velocity.current[1],0)
            } else if(velocity?.current[0] > 0){
                api.velocity.set(0,velocity.current[1],0) 
            } 
        }  

        if(velocity?.current[0] > 11){
            api.velocity.set(11,velocity.current[1],0)
        } else if(velocity?.current[0] < -11) {
            api.velocity.set(-11,velocity.current[1],0)
        }


        if(gameState.events.chaseTriggered) {
            gameState.events.homerSafe = Math.abs(gameState.positions.homer - start[0] ) < 2 && 
                                        Math.abs(gameState.positions.homer - start[1] ) < 2
        }

        if(gameState.events.homerCaught) {
            api.position.set(end[0], end[1]*-4-3, 0);
        }
    })

    return (
        <group ref={ref} position={start}>
            {/* TODO: Find out why Homer turns pale occasionally*/}
            <group visible={toggleBattleHomer}>
                <SpriteAnimator
                    flipX={!isFlipped}
                    scale={1.3}
                    frameName={animation}
                    animationNames={['walk', 'idle', 'jump']}
                    fps={5}
                    autoPlay={true}
                    loop={true}
                    textureImageURL={'/models/Homer/BattleHomer.png'}
                    textureDataURL={'/models/Homer/BattleHomer.json'}
                />
            </group>

            <group visible={!toggleBattleHomer}>
                <SpriteAnimator
                    flipX={isFlipped}
                    scale={.8}
                    frameName={animation}
                    animationNames={['walk', 'idle', 'jump']}
                    fps={10}
                    autoPlay={true}
                    loop={true}
                    textureImageURL={'/models/Homer/Homer.png'}
                    textureDataURL={'/models/Homer/Homer.json'}
                />
            </group>
        </group>
    )
}