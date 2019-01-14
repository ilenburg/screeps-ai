module.exports = function() {

    if (this.memory.active && this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
        this.memory.active = false;
    }

    if (!this.memory.active && this.carry[RESOURCE_ENERGY] === 0) {
        this.memory.active = true;
    }

    if (this.memory.active) {
        const target = this.room.findGatheringSource();
        this.collect(target);
    } else {
        const spawn = this.pos.findClosestSpawnOrExtension();
        if (spawn) {
            const container = spawn.pos.findContainerInArea();
            if (container && Memory.shouldRefill) {
                if (this.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            } else {
                if (this.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.moveTo(spawn);
                }
            }
        }
    }
};
