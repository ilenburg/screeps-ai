module.exports = function() {
    const targetFlag = Game.flags[this.memory.targetFlagName];
    if (targetFlag) {
        const target = !this.room.controller.my ? this.room.controller : null;
        if (target) {
            if (target.owner) {
                if (this.attackController(target) === ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            } else {
                if (this.claimController(target) === ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
        } else {
            this.moveTo(targetFlag);
        }
    }
};
