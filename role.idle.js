module.exports = function() {
    const spawn = this.pos.findClosestByRange(FIND_MY_SPAWNS);
    if (spawn) {
        this.moveTo(spawn);
    }
};
