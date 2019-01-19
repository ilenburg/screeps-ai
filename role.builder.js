module.exports = function() {

    function reduceSite(mostProgressSite, nextSite) {
        if (nextSite.progress / nextSite.progressTotal > mostProgressSite.progress / mostProgressSite.progressTotal) {
            return nextSite;
        }
        return mostProgressSite;
    }

    function getMostProgress(sites) {
        return sites.reduce(reduceSite);
    }

    if (this.memory.refill && this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
        this.memory.refill = false;
    }

    if (!this.memory.refill && this.carry[RESOURCE_ENERGY] === 0) {
        this.memory.refill = true;
    }

    if (this.memory.refill) {
        this.refill();
    } else {
        let targetSite;
        if (this.memory.targetId) {
            targetSite = Game.getObjectById(this.memory.targetId);
            if (!targetSite) {
                this.memory.targetId = null;
            }
        } else {
            const constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);
            if (constructionSites.length > 0) {
                targetSite = getMostProgress(constructionSites);
            }
        }
        if (targetSite) {
            if (this.build(targetSite) === ERR_NOT_IN_RANGE) {
                this.moveTo(targetSite);
            }
        } else {
            this.memory.role = 'idle';
        }
    }
};
