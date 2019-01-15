module.exports = function() {

    this.checkRefillState();

    if (this.memory.refill) {
        this.refill();
    } else {
        if (this.memory.targetId) {
            const target = Game.getObjectById(this.memory.targetId);
            if (target) {
                const actionResult = this.repair(target);
                if (actionResult !== OK || target.hits === target.hitsMax) {
                    if (actionResult === ERR_NOT_IN_RANGE) {
                        this.moveTo(target);
                    } else {
                        this.memory.targetId = null;
                    }
                }
            } else {
                this.memory.targetId = null;
            }
        } else {
            const targets = this.room.findSortedRepairableStructures();
            if (targets.length > 0) {
                this.memory.targetId = targets[0].id;
                if (this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    this.moveTo(targets[0]);
                }
            }
        }
    }
}
