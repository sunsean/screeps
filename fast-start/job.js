var job = {};

job.build    = require("job.build");
job.energize = require("job.energize");
job.upgrade  = require("job.upgrade");
job.harvest  = require("job.harvest");
//TODO: consider a sleeping job to reduce CPU cycles

job.jobs = [
    // job.upgrade.priority,
    // job.build.priority, //TODO: consider renaming job.build.road
    // job.energize.init,
    // job.build.init,     //TODO: consider renaming to job.build.all or job.build.rest
    job.upgrade.init,
    job.harvest.init
];

job.find = function (creep) {
    for (var i=0; i<job.jobs.length; i++) {
        var fn = job.jobs[i];
        if (typeof fn === "function") {
            fn(creep);
        } else {
            console.log(`Error: job.jobs[${i}] is ${typeof fn}`)
        }
        job.jobs[i](creep);
        if (creep.memory.job) { break; }
    }
}

job.run = function (creep) {
    function run() {
        if (creep.memory.job) {
            job[creep.memory.job].run(creep);
        }
        return creep.memory.job;
    }
    function find() {
        job.find(creep);
        if (creep.memory.job) {
            creep.say(creep.memory.job);
        }
        return creep.memory.job;
    }
    run() || find() && run();
}

module.exports = job;