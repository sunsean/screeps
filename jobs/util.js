var util = {
    //TODO: move to RawMemory deserialization/serialization
    //      to enable storing of full game objects automatically
    save: function (object) {
        return {id:object.id};
    },
    load: function (object) {
        return Game.getObjectById(object.id);
    }
};

module.exports = util;