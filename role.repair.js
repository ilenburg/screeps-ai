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
        const targets = this.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });

        if (targets.length > 0) {
            targets.sort((a, b) => a.hits - b.hits);
            if (this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets[0]);
            }
        }
    }
}
