module.exports = function() {

    StructureLink.prototype.work = function() {
        if (this.pos.isNearSource() && this.cooldown === 0 && this.energy === this.energyCapacity) {
            this.transferEnergy(this.room.findDepositLink());
        }
    };
};
