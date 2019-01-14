module.exports = function() {

    this.checkRefillState();

    if (this.memory.refill) {
        this.refill();
    } else {
        if (this.upgradeController(this.room.controller) === ERR_NOT_IN_RANGE) {
            this.moveTo(this.room.controller);
        }
    }
};
