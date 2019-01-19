module.exports = function() {

    RoomPosition.prototype.isNearMiner = function() {
        return this.findInRange(FIND_MY_CREEPS, 1, {
            filter: creep => creep.memory.role === 'miner'
        }).length > 0;
    };

    RoomPosition.prototype.findFleeMovement = function(targetPos) {
        return PathFinder.search(this, {
            pos: targetPos,
            range: 2
        }, {
            flee: true
        }).path[0];
    };

    RoomPosition.prototype.findTomb = function() {
        return this.findClosestByRange(FIND_TOMBSTONES, {
            filter: tomb => tomb.store[RESOURCE_ENERGY] > 0
        });
    };

    RoomPosition.prototype.findClosestHostileSpawn = function() {
        return this.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_SPAWN
        });
    };

    RoomPosition.prototype.findClosestWall = function() {
        return this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_WALL
        });
    };

    RoomPosition.prototype.findContainerInArea = function() {
        const containers = this.findInRange(FIND_STRUCTURES, 6, {
            filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity / 2
        });
        if (containers.length > 0) {
            return containers[0];
        }
        return null;
    };

    RoomPosition.prototype.findFilledContainerInArea = function() {
        const containers = this.findInRange(FIND_STRUCTURES, 6, {
            filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER ||
                structure.structureType === STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > 0
        });

        containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);

        if (containers.length > 0) {
            return containers[0];
        }
        return null;
    };

    RoomPosition.prototype.findContainerNearby = function() {
        const containers = this.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
        });
        if (containers.length > 0) {
            return containers[0];
        }
        return null;
    };

    RoomPosition.prototype.findClosestTower = function() {
        return this.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_TOWER &&
                structure.energy < structure.energyCapacity / 2
        });
    };

    RoomPosition.prototype.findClosestSpawnOrExtension = function() {
        const extension = this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_EXTENSION &&
                structure.energy < structure.energyCapacity
        });

        return extension ? extension : this.findClosestByRange(FIND_MY_SPAWNS, {
            filter: (structure) => structure.energy < structure.energyCapacity
        });
    };

    RoomPosition.prototype.findClosestFilledSpawnOrExtension = function() {
        return this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_EXTENSION) && structure.energy > structure.energyCapacity / 2
        });
    };

    RoomPosition.prototype.findClosestStorage = function() {
        return this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] < structure.storeCapacity
        });
    };

    RoomPosition.prototype.findClosestFilledStorage = function() {
        return this.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0
        });
    };
};
