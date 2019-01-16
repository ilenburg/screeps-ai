module.exports = function() {
    const targetFlag = Game.flags[this.memory.targetFlagName];
    if (targetFlag) {
        const target = this.pos.findClosestOtherController();
        if (target) {
            const atkResult = this.attackController(target);
            if (atkResult === ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
        } else {
            this.moveTo(targetFlag);
        }
    }
};
