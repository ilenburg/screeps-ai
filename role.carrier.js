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

    function filterContainer() {
        return {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0
        }
    }

    function collect(target) {
        if (target) {
            if (target instanceof Resource) {
                if (this.pickup(target) === ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            } else {
                console.log(target);
                if (this.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
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

    if (this.memory.active && this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
        this.memory.active = false;
    }

    if (!this.memory.active && this.carry[RESOURCE_ENERGY] === 0) {
        this.memory.active = true;
    }

    if (this.memory.active) {
        const energyStorage = getFilledContainer(this.room.find(FIND_STRUCTURES, filterContainer()));
        const resource = getGreaterPile(this.room.find(FIND_DROPPED_RESOURCES));
        const target = selectTarget(energyStorage, resource);

        collect.call(this, target);
    } else {
        const spawn = this.pos.findClosestSpawnOrExtension();
        if (spawn) {
            if (this.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(spawn);
            }
        }
    }
};
