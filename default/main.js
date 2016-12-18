var job = require("job");
var util = require("util");
var cowPaths = require("cowPaths");

const MAX_CREEPS = 4;
const TIME_SLOW = 100; // every 100 ticks

module.exports.loop = function () {
    if (!Game.time) { //TODO: investigate if this is reliable, or if I should use Memory.initialzed == true
        init();
    } else {
        freeMemory();
        //TODO: loadMemory();
        process();
        //TODO: saveMemory()
    }
}

function init() {
    var spawn = _.values(Game.spawns)[0];
    console.log(`New Game. Initial spawn "${spawn.name}" found at ${spawn.pos}`);
    Memory.initSpawn = util.save(spawn);
    //TODO: once a second spawn has been created, lets "move" this initial human spawn to a more strategic AI driven location.
}

function process() {
    // console.log("Game tick", Game.time);
    _.each(Game.rooms, processRoom);
    _.each(Game.creeps, processCreep);
}

function processRoom(room) {
    //TODO: if no spawns, then create one.
    cowPaths.process(room);
    var numCreeps = _.size(Game.creeps);
    var isCreepNeeded = numCreeps < MAX_CREEPS; //TODO: advance this code
    var isFullEnergy = room.energyAvailable == room.energyCapacityAvailable;
    if (isCreepNeeded && isFullEnergy || !numCreeps) {
        var spawn = room.find(FIND_MY_SPAWNS)[0];
        var body = createBody(room.energyAvailable);
        var newName = spawn.createCreep(body);
        console.log(`Spawning new creep ${newName} with body [${body}]`);
    }
    if (Game.time % TIME_SLOW == 0) {
        // console.log(`Checking room ${room.name} at level ${room.controller.level}`);
        var filterExtensions = structure => structure.structureType == STRUCTURE_EXTENSION;
        var numExtensions = room.find(FIND_MY_STRUCTURES, {filter:filterExtensions}).length;
        var maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
        if (numExtensions < maxExtensions) {
            //TODO: check if we already have the contruction sites in place.
            var numConstructs = room.find(FIND_MY_CONSTRUCTION_SITES, {filter:filterExtensions}).length;
            numExtensions += numConstructs;
            var spawn = room.find(FIND_MY_SPAWNS)[0];
            var pos = spawn.pos;
            var tries = 0;
            while (numExtensions < maxExtensions) {
                if (pos.createConstructionSite(STRUCTURE_EXTENSION) == OK) {
                    numExtensions++;
                    console.log(`Constructed ${STRUCTURE_EXTENSION} in ${room.name}`);
                }
                pos = new RoomPosition(pos.x, pos.y-1, room.name); //TODO: better logic for extension position (next to roads between a source and spawn)
                if (++tries>1000) {break;} //safety net
            }
        }
    }
}

function processCreep(creep) {
    if (creep.spawning) { return; } //fast exit for spawning creeps
    cowPaths.update(creep);
    job.run(creep);
}

function freeMemory() {
    // Remove dead creep memories
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}


var WORKER = [WORK, MOVE, WORK, WORK, MOVE, CARRY];

function createBody(energy) {
    //TODO: create smarter logic for what type of unit is needed
    return createBodyParts(WORKER, energy);
}

function createBodyParts(bodyParts, energy) {
    var parts = [];
    while (energy > 0) {
        let count = parts.length;
        for (let i=bodyParts.length; i-->0;) {
            let bodyPart = bodyParts[i];
            let cost = BODYPART_COST[bodyPart];
            if (energy >= cost) {
                parts.unshift(bodyPart);
                energy -= cost;
            }
        }
        var isMoreParts = count < parts.length;
        if (!isMoreParts) { break; }
    }
    return parts;
}
