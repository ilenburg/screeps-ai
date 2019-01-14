module.exports = function() {

    this.checkRefillState();

    if (this.memory.refill) {
        this.refill();
    } else {
        const targets = this.room.findSortedRepairableStructures();

        if (targets.length > 0) {
            if (this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                this.moveTo(targets[0]);
            }
        }
    }
}
