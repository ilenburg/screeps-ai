module.exports = function() {

    const roles = {
        miner: require('role.miner'),
        carrier: require('role.carrier'),
        upgrader: require('role.upgrader'),
        idle: require('role.idle'),
        harvester: require('role.harvester'),
        builder: require('role.builder'),
        repair: require('role.repair')
    };

    Creep.prototype.executeRole = function() {
        roles[this.memory.role].call(this);
    }
}
