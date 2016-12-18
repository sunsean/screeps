/*Mem.plugin({
    name: "FLAG",
    type: Flag,
    load: (value) => Game.flags[value],
    save: (value) => value.name
});
*/

module.exports = new class Mem {
    
    constructor () {
        this.plugins = {};
    }

    load () {
        global.Memory = JSON.parse(RawMemory.get(), this.parse.bind(this));
    }
    
    save () {
        RawMemory.set(JSON.stringify(Memory)); // same as in engine, so it's safe
    }
    
    parse (key, value) {
        var val = JSON.stringify(value);
        console.log("Mem.parse", key, value, val);
        if (this.plugins[key]) { //restore via plugin step
            console.log("I would restore this");
        } else if (value && this.plugins[value.TYPE]) { //elevate step
            console.log("I found one jimmy");
        }
/*        for (let plugin of this.plugins) {
            var run = plugin.when ? plugin.when(key, value) : true;
            if (run) {
                if (plugin.load) {
                    console.log("plugin.load", plugin.load, key, JSON.stringify(value));
                    console.log("=", plugin.load(key, value));
                    value = plugin.load(key, value);
                }
                if (plugin.save && value != null) {
                    // console.log("plugin.save", plugin.save, key, value);
                    // console.log("=", JSON.stringify(plugin.save.bind(plugin, key, value)()));
                    value.toJSON = plugin.save.bind(plugin, key, value);
                }
            }
        }
*/        // console.log("Mem.parse", key, val, "=", value, "->", JSON.stringify(value));
        return value;
    }
    
    plugin (plugin) {
        console.log("Install", plugin.name);
        this.plugins[plugin.name] = plugin.load;
        function toJSON () { return plugin.save(this); }
        // _.each(plugin.type, type => type.prototype.toJSON = toJSON);
        _.each(_.flatten([plugin.type]), type => console.log("each",type.prototype))
    }

}
