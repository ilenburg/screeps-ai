module.exports = function() {

    this.checkRefillState();

    if (this.memory.refill) {
        if (Game.getObjectById(this.memory.spawnId).room.name === this.room.name) {
            this.moveTo(Game.flags[this.memory.merchantFlagName]);
        } else {
            const target = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            if (target) {
                if (this.harvest(target) === ERR_NOT_IN_RANGE) {
                    if (this.moveTo(target) === ERR_NO_PATH) {
                        this.memory.role = 'idle';
                    }
                }
            }
        }
    } else {
        const storage = Game.getObjectById(this.memory.storageId);
        if (storage) {
            if (this.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(storage);
            }
        } else {
            this.memory.role = 'idle';
        }
    }
};
