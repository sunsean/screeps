global.Mem = new class Mem {

    load () {
        delete RawMemory._parsed; //hopefully only in simulation
        global.Memory = JSON.parse(RawMemory.get());
        delete Memory.__proto__;
    }
    
    save () {
        RawMemory.set(JSON.stringify(Memory));
    }
    
    plugin (load, save) {
        //TODO: plugin structure of parsing data types
        //      load and save are functions to call on load and save
        //TODO: use JSON.parse(data, reviver) and JSON.stringify(data, replacer)
    }

}