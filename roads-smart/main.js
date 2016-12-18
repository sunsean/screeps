const loopSpeed = 6;

module.exports.loop = function () {
    loadPaths();
    var spawn = _.values(Game.spawns)[0];
    if (Game.time % loopSpeed == 0) {
        // for (let site of spawn.room.find(FIND_CONSTRUCTION_SITES)) { site.remove() }
        Memory.flagCount = 0;
        _.each(Game.flags, flag=>flag.remove())
    } else if (Game.time % loopSpeed == 1) {
        let sources = spawn.room.find(FIND_SOURCES);
        for (let source of sources) {
            var path = findPath(source, spawn.room.controller);
            console.log(path);
            addPath(path);
            drawPath(path, COLOR_GREEN);
        }
        for (let source of sources) {
            var path = findPath(source, spawn);
            addPath(path);
            drawPath(path, COLOR_BLUE);
        }
    }
    savePaths();
}

//TODO: refer to future roads as trails instead of paths

function loadPaths () {
    function loadRoom (room) {
        if (room.memory.paths) {
            room.memory.paths = PathFinder.CostMatrix.deserialize(room.memory.paths);
        }
    }
    _.each(Game.rooms, loadRoom);
}

function savePaths () {
    function saveRoom (room) {
        if (room.memory.paths) {
            room.memory.paths = room.memory.paths.serialize();
        }
    }
    _.each(Game.rooms, saveRoom);
}

function roomPath (roomName) {
    var room = Game.rooms[roomName];
    if (!room) return; //because we can search beyond where we can see
    if (!room.memory.paths) {
        var matrix = new PathFinder.CostMatrix();
        //TODO: add structures to matrix;
        room.memory.paths = matrix;
    }
    return room.memory.paths;
}

function findPath (from, to, range=1) {
    //TODO: if to or from is room use "city center/room hub"
    if (from.pos) from = from.pos;
    if (to.pos) to = to.pos;
    var options = {
        roomCallback: roomPath,
        plainCost: 2,
        swampCost: 10,
    };
    var result = PathFinder.search(from, {pos:to, range:range}, options);
    //TODO: handle incomplete paths
    return result.path;
}

function addPath (path) {
    let roomName;
    let paths;
    for (let pos of path) {
        if (pos.roomName != roomName) {
            roomName = pos.roomName;
            paths = roomPath(roomName);
        }
        if (paths) {
            paths.set(pos.x, pos.y, 1);
        }
    }
    //TODO: add path to the rooms' cost matrix
}

function drawPath (path, color) {
    for (let pos of path) {
        // room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
        Memory.flagCount++;
        Game.rooms[pos.roomName].createFlag(pos.x, pos.y, Memory.flagCount, color);
    }
}