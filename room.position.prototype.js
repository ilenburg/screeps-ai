module.exports = function() {
    
    RoomPosition.prototype.findClosestSpawn = function() {
        return this.findClosestByRange(FIND_MY_SPAWNS);
    }

    RoomPosition.prototype.findClosestSpawnOrExtension = function() {
        return this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity
        });
    }

    RoomPosition.prototype.findClosestFilledSpawnOrExtension = function() {
        return this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_EXTENSION) && structure.energy > 0
        });
    }

    RoomPosition.prototype.findClosestStorage = function() {
        return this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] < structure.storeCapacity
        });
    }

    RoomPosition.prototype.findClosestFilledStorage = function() {
        return this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0
        });
    }

    RoomPosition.prototype.findClosestEnergyStorage = function() {
        const storage = this.findClosestFilledStorage();
        if (storage) {
            return storage;
        }
        return this.findClosestSpawnOrExtension();
    }
}
