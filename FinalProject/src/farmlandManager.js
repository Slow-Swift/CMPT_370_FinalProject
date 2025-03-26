import { createFarmland } from "./farmland.js"

const farmland = {}

export function setupFarmland() {
    const startLand = createFarmland(0,0);
    farmland[[0,0]] = startLand;
    startLand.setParent(applicationData.scene);
    unlockFarmland(startLand);
    console.log(startLand);
}

export function unlockFarmland(farmland) {
    farmland.unlocked = true;
    const [x,y] = farmland.location;
    for (const [lx,ly] of [[x+1,y], [x-1, y], [x, y+1], [x, y-1]]) {
        if ([lx,ly] in farmland) continue;

        const land = createFarmland(lx,ly);
        farmland[[lx,ly]] = land;
        land.setParent(applicationData.scene);
    }
}