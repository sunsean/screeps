module.exports = new class Mem {
    
    constructor () {
        this.plugins = [];
    }

    load () {
        global.Memory = JSON.parse(RawMemory.get(), this.parse.bind(this));
        //TODO: wrap all objects with Proxy that listens for sets to re-attach plugins
    }
    
    save () {
        RawMemory.set(JSON.stringify(Memory, this.stringify.bind(this)));
    }
    
    parse (key, value) {
        var val = JSON.stringify(value);
        for (let plugin of this.plugins) {
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
        //TODO: install proxy for adding new shit
        // console.log("Mem.parse", key, val, "=", value, "->", JSON.stringify(value));
        return value;
    }
    
    stringify (key, value) {
        if (value && value.toJSON) { return value.toJSON(); } //fast exit
        var val = JSON.stringify(value);
        for (let plugin of this.plugins) {
            var run = plugin.when ? plugin.when(key, value) : true;
            if (run) {
                if (plugin.save) {
                    // console.log("plugin.save", plugin.save, key, value);
                    // console.log("=", JSON.stringify(plugin.save.bind(plugin, key, value)()));
                    value = plugin.save(key, value);
                }
            }
        }
        // console.log("Mem.stringify", key, val, "=", JSON.stringify(value));
        return value;
    }
    
    plugin (plugin) {
        this.plugins.push(plugin);
    }

}
