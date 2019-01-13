module.exports = function() {

    if (this.memory.refill && this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
        this.memory.refill = false;
    }

    if (!this.memory.refill && this.carry[RESOURCE_ENERGY] === 0) {
        this.memory.refill = true;
    }

    if (this.memory.refill) {
        const resource = this.pos.findClosestFilledSpawnOrExtension();
        if (this.withdraw(resource, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(resource);
        }
    } else {
        if (this.upgradeController(this.room.controller) === ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller);
        }
    }
};
