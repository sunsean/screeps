const REFRESH = 40;
const ERRORS = [];

module.exports.loop = function () {
    var frame = Game.time % REFRESH;
    log(frame);
    var action = actions[frame];
    if (action) action(frame);
}

function log(frame) {
    var mover = Game.creeps.mover;
    console.log(`Frame (${frame})`+ (mover?` Mover: ${mover.pos} ${mover.fatigue}`:""));
}

function move(frame) {
    var mover = Game.creeps.mover;
    if (mover) var error = mover.move(RIGHT);
    if (error == ERR_TIRED) console.log("Creep tired");
}

var actions = [];
actions[ 0] = frame => _.each(Game.creeps, creep => creep.suicide());
actions[ 1] = frame => _.find(Game.spawns).createCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE], "mover");
actions[20] = move;
actions[21] = move; // should be a waste, but does it cost CPU?
actions[22] = move; // should be a waste, but does it cost CPU?
actions[25] = move;
actions[30] = move;