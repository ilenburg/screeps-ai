module.exports = function() {
    if (this.memory.targetContainerId) {
        const target = Game.getObjectById(this.memory.targetContainerId);
        if (!target || this.pos.isEqualTo(target.pos)) {
            this.memory.targetContainerId = null;
        } else {
            this.moveTo(target);
        }
    } else {
        const target = Game.getObjectById(this.memory.targetId);
        if (target) {
            if (this.harvest(target) === ERR_NOT_IN_RANGE) {
                const nearbyContainer = target.pos.findContainerNearby();
                if (nearbyContainer) {
                    this.memory.targetContainerId = nearbyContainer.id;
                    this.moveTo(nearbyContainer);
                } else {
                    this.moveTo(target);
                }
            }
        }
    }
};
