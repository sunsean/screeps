var util = require("util");

var build = {
    
    init: function(creep) {
        if (!creep.carry.energy) { return; }
        var target = build.find(creep);
        if (target) {
            creep.memory.job = "build";
            creep.memory.build = {
                target: util.save(target)
            }
        }
    },
    
    priority: function(creep) {
        if (!creep.carry.energy) { return; }
        var target = build.findRoad(creep);
        if (target) {
            creep.memory.job = "build";
            creep.memory.build = {
                target: util.save(target)
            }
        }
    },
    
    done: function (creep) {
        delete creep.memory.job;
        delete creep.memory.build;
    },

    run: function(creep) {
        var target = util.load(creep.memory.build.target);
        if (!target) { return build.done(creep); }
        var buildError = creep.build(target);
        if (buildError == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (buildError) {
            return build.done(creep);
        }
	},
	
	find: function (creep) {
        return creep.room.find(FIND_MY_CONSTRUCTION_SITES)[0];
	},
	
	findRoad: function (creep) {
	    var filterRoad = structure => structure.structureType == STRUCTURE_ROAD;
        return creep.room.find(FIND_MY_CONSTRUCTION_SITES, {filter:filterRoad})[0];
	}

};

module.exports = build;