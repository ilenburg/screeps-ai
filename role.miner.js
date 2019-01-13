module.exports = function() {
    const target = Game.getObjectById(this.memory.targetId);
    if (target) {
        if (this.harvest(target) === ERR_NOT_IN_RANGE) {
            if (this.moveTo(target) === ERR_NO_PATH) {
                const source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                if (source) {
                    this.memory.targetId = source.id;
                } else {
                    this.say('💤');
                    this.memory.role = 'idle';
                }
            }
        }
    }
}
