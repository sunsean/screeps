var Mem = require("mem");

Mem.plugin({
    name: "ROOM",
    type: Room,
    load: (value) => Game.rooms[value],
    save: (value) => value.name
});
Mem.plugin({
    name: "ID",
    type: [Creep, Source, Resource, Mineral, Structure, ConstructionSite, Nuke],
    load: (value) => Game.getObjectById(value),
    save: (value) => value.id
});
Mem.plugin({
    name: "MATRIX",
    type: PathFinder.CostMatrix,
    load: (value) => PathFinder.CostMatrix.deserialize(value),
    save: (value) => value.serialize()
}); //TODO: add custom compression to matrix
Mem.plugin({
    name: "FLAG",
    type: Flag,
    load: (value) => Game.flags[value],
    save: (value) => value.name
});
//TODO: PATH

/*
Mem.plugin({
    ROOM: (value) => Game.rooms[value]
});
Room.prototype.toJSON = function () {
    return {ROOM:this.name};
}
*/

// PATH: Path (a new object I need to construct to wrap all paths)

module.exports.loop = function () {
    console.log();
    Mem.load();

    // Demonstrates a newly added Game Object will have it's whole object saved in unsafe saves
    delete Memory.spawn;
    Memory.spawn = _.find(Game.spawns);
    delete Memory.spawn.toJSON;

    // Demonstrates that old values will save correct in unsafe saves
    Memory.source = Game.rooms.sim.find(FIND_SOURCES)[0]

    // Shows that rooms can be saved
    Memory.room = Game.rooms.sim;

    if (!Memory.count) { Memory.count=0; }
    if (!RawMemory._parsed) console.log(Memory.count++, Memory);
    
    console.log("Spawn", Memory.spawn);
    console.log("Source", Memory.source);
    console.log("Room", Memory.room);
    // console.log("Memory", Memory);
    console.log("RawMemory (unsaved)", JSON.stringify(Memory));
    Mem.save();
    console.log("RawMemory (saved)", RawMemory.get());
}