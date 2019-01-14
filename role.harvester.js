module.exports = function() {

    this.checkRefillState();

    if (this.memory.refill) {
        const target = Game.getObjectById(this.memory.targetId);
        if (target) {
            if (this.harvest(target) === ERR_NOT_IN_RANGE) {
                if (this.moveTo(target) === ERR_NO_PATH) {
                    this.say('💤');
                    this.memory.role = 'idle';
                }
            }
        }
    } else {
        const spawn = this.pos.findClosestSpawnOrExtension();
        if (spawn) {
            if (this.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(spawn);
            }
        }
    }
};
