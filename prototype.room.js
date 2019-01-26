module.exports = function() {

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

    function filterContainer() {
        return {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                _.sum(structure.store) > 0 && (structure.pos.findInRange(FIND_SOURCES, 1).length > 0 || structure.pos.findInRange(FIND_MINERALS, 1).length > 0)
        }
    }

    function selectTarget(energyStorage, resource) {
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

    Room.prototype.defend = function() {
        const towers = this.find(FIND_MY_STRUCTURES, {
            filter: {
                structureType: STRUCTURE_TOWER
            }
        });

        towers.forEach(tower => tower.defend());
    };

    Room.prototype.findGatheringSource = function() {
        const energyStorage = getFilledContainer(this.find(FIND_STRUCTURES, filterContainer()));
        const resource = getGreaterPile(this.find(FIND_DROPPED_RESOURCES));
        return selectTarget(energyStorage, resource);
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
