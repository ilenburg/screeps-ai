module.exports = function() {

    if (this.memory.targetId) {
        const target = Game.getObjectById(this.memory.targetId);
        if (target) {
            this.seekAndAttack(target);
        } else {
            this.memory.targetId = null;
        }
    } else {
        const targetFlag = Game.flags[this.memory.targetFlagName];
        if (targetFlag) {
            let target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                if (this.seekAndAttack(target) === ERR_NO_PATH) {
                    target = this.pos.findClosestWall();
                    this.seekAndAttack(target);
                    this.memory.targetId = target.id;
                }
            } else {
                target = this.pos.findClosestHostileSpawn();
                if (target) {
                    this.seekAndAttack(target);
                } else {
                    this.moveTo(targetFlag);
                }
            }
        }
    }
};
