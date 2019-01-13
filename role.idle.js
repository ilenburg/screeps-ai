module.exports = function() {
    const spawn = this.pos.findClosestSpawn();
    if (spawn) {
        this.moveTo(spawn);
    }
}
