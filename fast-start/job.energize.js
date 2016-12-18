var util = require("util");

var energize = {
    
    init: function(creep) {
        if (!creep.carry.energy) { return; }
        var target = energize.find(creep);
        if (target) {
            creep.memory.job = "energize";
            creep.memory.energize = {
                target: util.save(target)
            }
        }
    },
    
    done: function (creep) {
        delete creep.memory.job;
        delete creep.memory.energize;
    },

    run: function(creep) {
        if (creep.carry.energy == 0) { return energize.done(creep); }
        var target = util.load(creep.memory.energize.target);
        if (!target || target.energy == target.energyCapacity) {
            var target = energize.find(creep);
            if (target) {
                creep.memory.energize.target = util.save(target);
            } else {
                return energize.done(creep);
            }
        }
        var transferError = creep.transfer(target, RESOURCE_ENERGY);
        if (transferError == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (transferError) {
            return energize.done(creep);
        }
	},
	
	find: function (creep) {
	    function validStructure(structure) {
	        return energize.structures[structure.structureType];
	    }
	    function needsEnergy(structure) {
	        return structure.energy < structure.energyCapacity;
	    }
	    var filter = structure => validStructure(structure) && needsEnergy(structure);
        return creep.room.find(FIND_MY_STRUCTURES, {filter:filter})[0];
        //TODO: move extensions into a priority
	},

    structures: {
        [STRUCTURE_EXTENSION]: true,
        [STRUCTURE_SPAWN]: true
    }
};

module.exports = energize;