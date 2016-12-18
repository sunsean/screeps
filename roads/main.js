const loopSpeed = 6;

module.exports.loop = function () {
    var spawn = _.values(Game.spawns)[0];
    if (Game.time % loopSpeed == 0) {
        // for (let site of spawn.room.find(FIND_CONSTRUCTION_SITES)) { site.remove() }
        Memory.flagCount = 0;
        _.each(Game.flags, flag=>flag.remove())
    } else if (Game.time % loopSpeed == 1) {
        for (let source of spawn.room.find(FIND_SOURCES)) {
            drawPath(spawn.room, source.pos.findPathTo(spawn), COLOR_GREEN);
            drawPath(spawn.room, source.pos.findPathTo(spawn.room.controller), COLOR_BLUE);
            //TODO: define method to combine paths (slight loss of efficiency, but less cost to maintain);
        }
    }
}

function drawPath(room, path, color) {
    for (let pos of path) {
        // room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
        Memory.flagCount++;
        room.createFlag(pos.x, pos.y, Memory.flagCount, color);
    }
}