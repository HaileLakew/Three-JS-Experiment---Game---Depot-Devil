import levels from "./levels";

export function getKeyLocation(level, keySymbol = 'S'){
    let coordinates;
    level?.forEach((tier, tierIndex)=>{       
        tier.split(' ').forEach((key, index)=>{
            if(!key) return;
            if(key.includes(keySymbol)) {
                coordinates = [index, tierIndex, 0]
            } 
        })
    })

    return coordinates;
}

export function parseRewards(level) {
    return level.map((tier)=>{       
        let rewardAcc = 0;
        
        return tier.split(' ').map((key, index)=>{
            if(!key) return;
            
            let location = index + rewardAcc;
            rewardAcc = rewardAcc + key.length;
            let rewardType;

            if(key.includes('$')) {
                rewardType = 'coin'
                return {
                    xCoord: location, 
                    rewardType
                };
            } 


        }).filter(n => n)
    })
}


export function parsePlatforms(level) {
    return level.map((tier)=>{     
        let prev;
        let xCoord;
        let accumulator;
        let type;

        let platforms = [];
        
        tier.split('').forEach((key, index)=>{
            
            if(prev !== key) {         
                if(type) {
                    if (accumulator > 6) {
                        let amountOfPlatforms = Math.ceil(accumulator / 6)
                        let lengthLeft = accumulator;

                        Array(amountOfPlatforms).fill("").forEach((fill, index)=>{
                            
                            platforms.push({
                                xCoord: xCoord + (index * 6),
                                length: lengthLeft > 6 ? 6 : lengthLeft,
                                platformType: type
                            })

                            lengthLeft = lengthLeft - 6;
                        })

                    } else {
                        platforms.push({
                            xCoord: xCoord,
                            length: accumulator,
                            platformType: type
                        })
                    }
                }
              
                accumulator = 1;
                xCoord = index;

                if(key==='X') {
                    type='shifting'
                } else if(key==='Y') {
                    type='lifting'
                } else if (key === 'O'){
                    type='static'
                } else {
                    type= null;
                }

                prev = key;
            } else {
                accumulator++;
            }
    
        })

        return platforms;
    })
}

export function parseMeshes(models) {
    return {
        // logs: models.scene.children.map( child => console.log(child.name)),
        platforms: models.scene.children.filter( child => child.name.includes(levels["level_001"].tileSets.platforms))[0],
        coin: models.scene.children.filter(child => child.name.includes('Coin003'))[0],
        cloud: models.scene.children.filter( child => child.name.includes('Cloud_1')),
        arrow: models.scene.children.filter( child => child.name.includes('Arrow_Side')),
        tower: models.scene.children.filter( child => child.name.includes('Tower')),
        fence: models.scene.children.filter( child => child.name.includes('Fince_Middle')),
        bush: models.scene.children.filter( child =>  child.name.includes('Bush_Fruit')),
        grass: models.scene.children.filter( child =>  child.name.includes('Grass_2')),
        tree: models.scene.children.filter( child =>  child.name.includes('Tree_Fruit')),
    }
}