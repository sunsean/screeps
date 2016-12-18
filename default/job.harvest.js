var util = require("util");

var harvest = {
    
    init: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var target = harvest.find(creep);
            if (target) {
                creep.memory.job = "harvest";
                creep.memory.harvest = {
                    target: util.save(target)
                }
            }
        }
    },
    
    done: function (creep) {
        delete creep.memory.job;
        delete creep.memory.harvest;
    },

    run: function(creep) {
        if (creep.carry.energy == creep.carryCapacity) { return harvest.done(creep); }
        var target = util.load(creep.memory.harvest.target);
        if (!target) { return harvest.done(creep); }
        var harvestError = creep.harvest(target);
        if (harvestError == ERR_NOT_IN_RANGE) {
            //TODO: check if target is in total use and if so find another source
            creep.moveTo(target);
        } else if (harvestError) {
            return harvest.done(creep);
        }
	},
	
	find: function (creep) {
        return creep.room.find(FIND_SOURCES, {filter: source => source.energy })[0];
	}

};

module.exports = harvest;
