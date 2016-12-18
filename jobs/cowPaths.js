const ROOM_SIZE = 50;
const COW_PATH_INCREASE = 10;
const COW_PATH_DECREASE = 1; //decay of cow paths per tick
const COW_PATH_ROAD = 200; //threshold before a road is built

var cowPaths = {

    get: function (paths, x,y) {
        return paths[y*ROOM_SIZE+x];
    },
    
    set: function (paths, x, y, count) {
        paths[y*ROOM_SIZE+x] = count;
    },

    process: function (room) {
        var paths = room.memory.cowPaths;
        if (!paths) {
            paths = [];
            var size = ROOM_SIZE * ROOM_SIZE;
            for (let i=0; i<size; i++) {
                paths[i] = 0;
            }
            room.memory.cowPaths = paths;

            // paths = room.memory.cowPaths = _.times(ROOM_SIZE * ROOM_SIZE, i=>0);
        }
        for (let x=0; x<ROOM_SIZE; x++) {
            for (let y=0; y<ROOM_SIZE; y++) {
                let count = cowPaths.get(paths, x, y);
                if (count > COW_PATH_ROAD) {
                    let pos = new RoomPosition(x, y, room.name);
                    pos.createConstructionSite(STRUCTURE_ROAD); //ignore failures (for now)
                    cowPaths.set(paths, x, y, -1);
                } else {
                    if (count>0) {
                        cowPaths.set(paths, x, y, count - COW_PATH_DECREASE);
                    }
                }
            }
        }
        // console.log( _.filter(paths, count=>count>0) )
    },

    update: function (creep) {
        if (creep.memory.job == "build") {
             //ignore standing positions while building roads
            if (creep.memory.build.target.structureType == STRUCTURE_ROAD) {
                return;
            }
        }
        var paths = creep.room.memory.cowPaths;
        var x = creep.pos.x;
        var y = creep.pos.y;
        var count = cowPaths.get(paths, x, y);
        if (count >= 0) { //roads will decay, we should verify after a while
            cowPaths.set(paths, x, y, count + COW_PATH_INCREASE);
        }
    }


}
    
module.exports = cowPaths;