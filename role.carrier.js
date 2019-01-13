module.exports = function() {

    function reducePile(smallestPile, nextPile) {
        if (nextPile.amount > smallestPile.amount) {
            return nextPile;
        }
        return smallestPile;
    }

    function getGreaterPile(piles) {
        return piles.reduce(reducePile, piles[0]);
    }

    if (this.memory.active && this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
        this.memory.active = false;
    }

    if (!this.memory.active && this.carry[RESOURCE_ENERGY] === 0) {
        this.memory.active = true;
    }

    if (this.memory.active) {
        const resource = getGreaterPile(this.room.find(FIND_DROPPED_RESOURCES));
        if (this.pickup(resource) === ERR_NOT_IN_RANGE) {
            this.moveTo(resource);
        }
    } else {
        const spawn = this.pos.findClosestSpawnOrExtension();
        if (spawn) {
            if (this.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(spawn);
            }
        }
    }
};
