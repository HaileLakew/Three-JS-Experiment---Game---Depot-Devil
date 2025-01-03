import {motion} from 'framer';

export default function GameOver({currentLevel}) {

    if(!currentLevel?.state) {
        return;
    }

    return (
        <motion.div 
            initial={{ opacity: 0,}}
            animate={{ opacity: 1 }}
            transition={{duration: 1}}
            className={`h-screen w-screen bg-black absolute top-0 z-10 text-9xl`}
        >
            <motion.div 
                className="h-screen w-full bg-cover bg-center" 
                style={{ backgroundImage: `url("/GameOver.jpeg")`}}/>

            <div className="absolute top-3/4 left-3/4 text-7xl bg-black">
                Score: {Math.round(currentLevel?.score)}
                <div>{currentLevel?.state}</div>
                <div>To be Continued...</div>
            </div>
        </motion.div>
    )
}