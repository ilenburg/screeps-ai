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
        if (nextContainer.store[RESOURCE_ENERGY] > filledContainer.store[RESOURCE_ENERGY]) {
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

    function filterContainer(spawn) {
        return {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0 && !spawn.pos.inRangeTo(structure.pos, 5)
        }
    }

    function selectTarget(energyStorage, resource) {
        if (energyStorage) {
            if (resource) {
                return energyStorage.store[RESOURCE_ENERGY] > resource.amount ? energyStorage : resource;
            }
            return energyStorage;
        } else if (resource) {
            return resource;
        }
        return null;
    }

    Room.prototype.findGatheringSource = function() {
        const energyStorage = getFilledContainer(this.find(FIND_STRUCTURES, filterContainer(this.find(FIND_MY_SPAWNS)[0])));
        const resource = getGreaterPile(this.find(FIND_DROPPED_RESOURCES));
        return selectTarget(energyStorage, resource);
    }

    Room.prototype.findSortedRepairableStructures = function() {
        return (this.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
        }).sort((structureA, structureB) => (structureA.hits / structureA.hitsMax) - (structureB.hits / structureB.hitsMax)));
    }
}
