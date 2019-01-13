module.exports = function() {

    function reduceSite(mostProgressSite, nextSite) {
        if (nextSite.amount > mostProgressSite.amount) {
            return nextSite;
        }
        return mostProgressSite;
    }

    function getMostProgress(sites) {
        return sites.reduce(reduceSite, sites[0]);
    }

    if (this.memory.refill && this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
        this.memory.refill = false;
    }

    if (!this.memory.refill && this.carry[RESOURCE_ENERGY] === 0) {
        this.memory.refill = true;
    }

    if (this.memory.refill) {
        const resource = this.pos.findClosestEnergyStorage();
        if (this.withdraw(resource, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(resource);
        }
    } else {
        const constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);
        if (constructionSites.length > 0) {
            const targetSite = getMostProgress(constructionSites);
            if (this.build(targetSite)) {
                this.moveTo(targetSite);
            }
        }
    }
};
