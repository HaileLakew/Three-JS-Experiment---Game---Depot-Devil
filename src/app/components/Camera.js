import { useFrame } from "@react-three/fiber";

export default function Camera ({gameState}) {

    useFrame(({camera}) => {
        camera.position.set( gameState.positions.homer[0], gameState.positions.homer[1], 7);
    })
}