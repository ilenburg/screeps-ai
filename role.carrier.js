module.exports = function() {

    if (this.memory.active && this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
        this.memory.active = false;
    }

    if (!this.memory.active && this.carry[RESOURCE_ENERGY] === 0) {
        this.memory.active = true;
    }

    if (this.memory.active) {
        let actionResult;
        if (this.memory.targetId) {
            const target = Game.getObjectById(this.memory.targetId);
            actionResult = this.collect(target);
        } else {
            const target = this.room.findGatheringSource();
            actionResult = this.collect(target);
        }
        if (actionResult !== OK) {
            this.moveTo(Game.getObjectById(this.memory.spawnId));
        }
    } else {
        const tower = this.pos.findClosestTower();
        if (tower && Memory.shouldRefill) {
            if (this.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(tower);
            }
        } else {
            let spawn = this.pos.findClosestSpawnOrExtension();

            if (!spawn) {
                spawn = this.pos.findClosestByRange(FIND_MY_SPAWNS);
            }

            if (spawn) {
                const container = spawn.pos.findContainerInArea();
                if (container && Memory.shouldStore) {
                    if (this.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.moveTo(container);
                    }
                } else {
                    if (this.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.moveTo(spawn);
                    }
                }
            } else {
                this.moveTo(Game.getObjectById(this.memory.spawnId));
            }
        }
    }
};
