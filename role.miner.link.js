module.exports = function() {
    if (this.memory.targetContainerId) {
        const target = Game.getObjectById(this.memory.targetContainerId);
        if (!target || this.pos.isEqualTo(target.pos)) {
            this.memory.targetContainerId = null;
        } else {
            this.moveTo(target);
        }
    } else {
        if (this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
            const target = Game.getObjectById(this.memory.targetLinkId);
            this.transfer(target, RESOURCE_ENERGY);
        } else {
            const target = Game.getObjectById(this.memory.targetId);
            if (target) {
                if (this.harvest(target) === ERR_NOT_IN_RANGE) {
                    const nearbyContainer = target.pos.findContainerNearby();
                    if (nearbyContainer && !nearbyContainer.pos.isNearMiner()) {
                        this.memory.targetContainerId = nearbyContainer.id;
                        this.moveTo(nearbyLink);
                    } else {
                        this.moveTo(target);
                    }
                }
            }
        }
    }
};
