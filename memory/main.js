require("mem");

module.exports.loop = function () {
    Mem.load();

    if (!Memory.count) { Memory.count=0; }
    if (!RawMemory._parsed) console.log(Memory.count++, Memory);

    Mem.save();
}