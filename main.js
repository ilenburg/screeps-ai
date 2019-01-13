require('prototype.room.position')();
require('prototype.spawn')();
require('prototype.creep')();
require('prototype.source')();

module.exports.loop = function() {

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    for (var name in Game.spawns) {
        Game.spawns[name].kill();
        Game.spawns[name].produce();
    }

    for (var name in Game.creeps) {
        Game.creeps[name].executeRole();
    }
}
