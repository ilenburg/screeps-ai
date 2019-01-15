module.exports = function() {

    RoomPosition.prototype.findContainerInArea = function() {
        const containers = this.findInRange(FIND_STRUCTURES, 6, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] < structure.storeCapacity / 2
        });
        if (containers.length > 0) {
            return containers[0];
        }
        return null;
    }

    RoomPosition.prototype.findFilledContainerInArea = function() {
        const containers = this.findInRange(FIND_STRUCTURES, 6, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0
        });
        if (containers.length > 0) {
            return containers[0];
        }
        return null;
    }

    RoomPosition.prototype.findContainerNearby = function() {
        const containers = this.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
        });
        if (containers.length > 0) {
            return containers[0];
        }
        return null;
    }

    RoomPosition.prototype.findClosestSpawnOrExtension = function() {
        const extension = this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_EXTENSION &&
                structure.energy < structure.energyCapacity
        });

        return extension ? extension : this.findClosestByRange(FIND_MY_SPAWNS, {
            filter: (structure) => structure.energy < structure.energyCapacity
        });
    }

    RoomPosition.prototype.findClosestFilledSpawnOrExtension = function() {
        return this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_EXTENSION) && structure.energy > structure.energyCapacity / 2
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
}
