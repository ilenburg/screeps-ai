module.exports = function() {

    const filterContainer = {
        filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
            _.sum(structure.store) > 0 && (structure.pos.findInRange(FIND_SOURCES, 1).length > 0 || structure.pos.findInRange(FIND_MINERALS, 1).length > 0)
    };

    function reducePile(smallestPile, nextPile) {
        if (nextPile.amount > smallestPile.amount) {
            return nextPile;
        }
        return smallestPile;
    }

    function getGreaterPile(piles) {
        if (piles.length > 0) {
            return piles.reduce(reducePile);
        }
        return null;
    }

    function reduceContainer(filledContainer, nextContainer) {
        if (_.sum(nextContainer.store) > _.sum(filledContainer.store)) {
            return nextContainer;
        }
        return filledContainer;
    }

    function getFilledContainer(containers) {
        if (containers.length > 0) {
            return containers.reduce(reduceContainer);
        }
        return null;
    }

    function selectTarget(energyStorage, resource, link) {
        if (!resource && link && energyStorage && _.sum(energyStorage.store) < link.energy) {
            return link;
        }
        if (energyStorage) {
            if (resource) {
                return _.sum(energyStorage.store) / 2 > resource.amount ? energyStorage : resource;
            }
            return energyStorage;
        } else if (resource) {
            return resource;
        }
        return null;
    }

    Room.prototype.findDepositLink = function() {
        const depositLinks = this.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_LINK && !structure.pos.isNearSource()
        });
        if (depositLinks.length > 0) {
            return depositLinks[0];
        }
        return null;
    };

    Room.prototype.manage = function() {
        const towers = this.find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER
            }
        });

        const links = this.find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_LINK
            }
        });

        towers.forEach(tower => tower.defend());
        links.forEach(link => link.work());
    };

    Room.prototype.findGatheringSource = function() {
        const energyStorage = getFilledContainer(this.find(FIND_STRUCTURES, filterContainer));
        const resource = getGreaterPile(this.find(FIND_DROPPED_RESOURCES));
        const links = this.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_LINK && !structure.pos.isNearSource()
        });
        const link = links.length > 0 ? links[0] : null;
        return selectTarget(energyStorage, resource, link);
    };

    Room.prototype.droppedResourceExists = function() {
        const resource = getGreaterPile(this.find(FIND_DROPPED_RESOURCES));
        if (resource && resource.amount > 500) {
            return true;
        }
        return false;
    };

    Room.prototype.findSortedRepairableStructures = function() {
        return (this.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
        }).sort((structureA, structureB) => (structureA.hits / structureA.hitsMax) - (structureB.hits / structureB.hitsMax)));
    };
};
