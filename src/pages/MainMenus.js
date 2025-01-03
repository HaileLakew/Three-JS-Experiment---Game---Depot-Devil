/* eslint-disable @next/next/no-img-element */
import {motion} from 'framer';

export default function MainMenu({currentLevel, handlePlayButton}) {

    if(currentLevel) {
        return;
    }

    return (
        <motion.div className={`h-screen w-screen bg-white absolute top-0 z-10 text-9xl ${currentLevel && 'hidden'}`}>

            <img alt="MainMenu" src="/MainMenu.png"/>

            <motion.button 
                initial={{ opacity: 1, y: '-175%' }}
                animate={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 2 }}
                onClick={handlePlayButton} 
                className="text-9xl text-black"> Press Play</motion.button>
       
        </motion.div>
    )
}