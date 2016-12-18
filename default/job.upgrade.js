var util = require("util");

const DOWNGRADE_THRESHOLD = 1000;

var upgrade = {
    
    init: function(creep) {
        if (!creep.carry.energy) { return; }
        creep.memory.job = "upgrade";
    },
    
    priority: function(creep) {
        if (creep.room.controller.ticksToDowngrade < DOWNGRADE_THRESHOLD) {
            console.log(creep.room.controller.ticksToDowngrade);
            upgrade.init(creep);
        }
    },
    
    done: function (creep) {
        delete creep.memory.job;
    },

    run: function(creep) {
        if (creep.carry.energy == 0) { return upgrade.done(creep); }
        var upgradeError = creep.upgradeController(creep.room.controller);
        if (upgradeError == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        } else if (upgradeError) {
            return upgrade.done(creep);
        }
	}
	//TODO: prioritize upgrade when in danger of downgrade
};

module.exports = upgrade;