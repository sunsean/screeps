var Mem = require("mem");

// Game Objects
Mem.plugin({
    when: (key, value) => value && value.id,
    load: (key, value) => Game.getObjectById(value.id),
    save: (key, value) => { return {id: value.id} }
});

// CostMatrix
Mem.plugin({
    when: (key, value) => /Matrix$/.test(key),
    load: (key, value) => PathFinder.CostMatrix.deserialize(value),
    save: (key, value) => value.serialize()
});

// Room
Mem.plugin({
    when: (key, value) => value && value.type == "ROOM",
    load: (key, value) => Game.rooms[value.name]
});
Room.prototype.toJSON = function () {
    return {type:"ROOM", name:this.name};
}

// due to all these complications I suggest directly adding to prototypes
// that will prevent event unsafe saves and hopefully make it easier to reason with
// (id) = Creep, Structure, Source, Resource

module.exports.loop = function () {
    console.log();
    Mem.load();

    // Demonstrates a newly added Game Object will have it's whole object saved in unsafe saves
    delete Memory.spawn;
    Memory.spawn = Game.spawns.Spawn1;
    delete Game.spawns.Spawn1.toJSON;

    // Demonstrates that old values will save correct in unsafe saves
    Memory.source = Game.rooms.sim.find(FIND_SOURCES)[0]

    // Shows that rooms can be saved
    // Memory.room = Game.rooms.sim;

    if (!Memory.count) { Memory.count=0; }
    if (!RawMemory._parsed) console.log(Memory.count++, Memory);
    
    var path = Memory.source.pos.findPathTo(Memory.spawn);
    console.log(Room.serializePath(path));
    
    console.log("Spawn", Memory.spawn);
    console.log("Source", Memory.source);
    console.log("Room", Memory.room);
    // console.log("Memory", Memory);
    console.log("RawMemory (unsaved)", JSON.stringify(Memory));
    Mem.save();
    console.log("RawMemory (saved)", RawMemory.get());
}