var Matrix = require("./Matrix");

const loopSpeed = 6;

const COLOR_ROAD      = COLOR_GREY;
const COLOR_HUB       = COLOR_WHITE;
const COLOR_EXTENSION = COLOR_YELLOW;
const COLOR_CONTAINER = COLOR_BLUE;

module.exports.loop = function () {
    logMemory();
    loadTrails();
    if (Game.time % loopSpeed == 0) {
        resetFlags();
        resetMemory();
        Memory.flagCount = 0;
    } else if (Game.time % loopSpeed == 1) {
        var room = _.find(Game.rooms); // simulation room
        addHub(room);
        addController(room.controller);
        _.each(room.find(FIND_MY_SPAWNS), addSpawn);
        _.each(room.find(FIND_SOURCES), addSource);
        addExtensions(room);
    }
    saveTrails();
}

function logMemory () {
    var memory = JSON.stringify(Memory);
    var size = Math.ceil(memory.length/1024);
    console.log(`Memory (${size}kb) ${memory}`);
}

function resetFlags () {
    _.each(Game.flags, flag => flag.remove())
}

function resetMemory () {
    _.keys(Memory).map(key => delete Memory[key]);
    Memory.creeps={};
    Memory.spawns={};
    Memory.rooms={};
    Memory.flags={};
}

//TODO: store room.memory.plan which has all the roads and structures
function loadTrails () {
    function loadRoom (room) {
        if (room.memory.trails) {
            // room.memory.trails = PathFinder.CostMatrix.deserialize(room.memory.trails);
            room.memory.trails = Matrix.load(room.memory.trails);
        }
    }
    _.each(Game.rooms, loadRoom);
}

function saveTrails () {
    function saveRoom (room) {
        if (room.memory.trails) {
            // room.memory.trails = room.memory.trails.serialize();
            room.memory.trails = Matrix.save(room.memory.trails);
        }
    }
    _.each(Game.rooms, saveRoom);
}

function roomTrails (roomName) {
    var room = Game.rooms[roomName];
    if (!room) return; //because we can search beyond where we can see
    if (!room.memory.trails) {
        var matrix = new PathFinder.CostMatrix();
        //TODO: add structures to matrix;
        room.memory.trails = matrix;
    }
    return room.memory.trails;
}

function hubTrail (to, color=COLOR_ROAD) {
    if (to.pos) to = to.pos;
    var trail = findPath(to, Memory.rooms[to.roomName].hub);
    addTrail(trail);
    drawPath(trail, color);
}

function findPath (from, to, range=1) {
    //TODO: if to or from is room use "city center/room hub"
    if (from.pos) from = from.pos;
    if (to.pos) to = to.pos;
    var options = {
        roomCallback: roomTrails,
        plainCost: 2,
        swampCost: 10,
    };
    var result = PathFinder.search(from, {pos:to, range:range}, options);
    //TODO: handle incomplete paths
    return result.path;
}

function addTrail (trail) {
    let roomName;
    let trails;
    for (let pos of trail) {
        if (pos.roomName != roomName) {
            roomName = pos.roomName;
            trails = roomTrails(roomName);
        }
        if (trails) {
            trails.set(pos.x, pos.y, 1);
        }
    }
}

function drawPath (path, color) {
    for (let pos of path) drawFlag(pos, color);
}

function drawFlag (pos, color) {
    pos.createFlag(flagName(++Memory.flagCount), color);
}

// "invisible" names
function flagName (count) {
    var name = "";
    while (count) {
        name += String.fromCharCode(count & 0x1F);
        count >>= 5;
    }
    return name;
}

function addHub (room) {
    var spawn = room.find(FIND_MY_SPAWNS)[0];
    var hub = room.getPositionAt(spawn.pos.x, spawn.pos.y-1);
    room.memory.hub = hub;
    drawFlag(hub, COLOR_HUB);
}

function addController (controller) {
    hubTrail(controller);
    //TODO: add controller container(closest corner location that's not a road)
}

function addSpawn (spawn) {
    hubTrail(spawn);
    //TODO: add container (closest corner location that's not a road)
}

function addSource (source) {
    hubTrail(source);
    //TODO: add road around source
    //TODO: calculate maximum number of miners
    //TODO: calculate "front" of source and place container there
    //TODO: add container (underneath miners, as it's a walkable structure)
    //TODO: test if dropping resources near (range=1) to containers causes them to go inside the container
    //      if so then miner creeps don't need carry parts
    //TODO: I may add an artificial limit of 3 miners to source, because as the miners get more advanced
    //      They will mine the source so quickly it will deplete. Eventually there will only be one miner
    //      and that miner should only have as many work parts as would cause constant depletion with no waste
    //NOTE: Actually at 3000 energy per source regenerated every 300 ticks, that 10 energy per tick.
    //      That means we only need a single work part from the very beginning?
}

function addExtensions (room) {
    var extensionsEntrance = findExtensionsExtrance(room);
    hubTrail(extensionsEntrance);
    //TODO: propagate through all 60 extensions that need adding
}

function findExtensionsExtrance (room) {
    return room.memory.hub;
    //TODO: find largest area in room (consider this spot to be the hub location instead of above the spawn)
}
