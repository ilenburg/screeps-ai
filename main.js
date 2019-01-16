require('prototype.room.position')();
require('prototype.spawn')();
require('prototype.creep')();
require('prototype.source')();
require('prototype.tower')();
require('prototype.room')();

module.exports.loop = function() {

    const roomSet = new Set();

    for (let name in Game.spawns) {
        roomSet.add(Game.spawns[name].room);
        Game.spawns[name].kill();
        Game.spawns[name].produce();
    }

    for (let name in Game.creeps) {
        Game.creeps[name].executeRole();
    }

    roomSet.forEach(room => room.defend());

    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}
