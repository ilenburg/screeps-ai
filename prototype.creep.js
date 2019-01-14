module.exports = function() {

    const roles = {
        miner: require('role.miner'),
        carrier: require('role.carrier'),
        upgrader: require('role.upgrader'),
        idle: require('role.idle'),
        harvester: require('role.harvester'),
        builder: require('role.builder'),
        repair: require('role.repair')
    };

    Creep.prototype.collect = function(target) {
        if (target) {
            if (target instanceof Resource) {
                if (this.pickup(target) === ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            } else {
                if (this.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                }
            }
        }
    }

    Creep.prototype.checkRefillState = function() {
        if (this.memory.refill && this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
            this.memory.refill = false;
        }

        if (!this.memory.refill && this.carry[RESOURCE_ENERGY] === 0) {
            this.memory.refill = true;
        }
    }

    Creep.prototype.refill = function() {
        const resource = this.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (resource) {
            const container = resource.pos.findFilledContainerInArea();
            if (container) {
                if (this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            } else {
                if (Memory.shouldRefill) {
                    if (this.withdraw(resource, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.moveTo(resource);
                    }
                }
            }
        }
    }

    Creep.prototype.executeRole = function() {
        roles[this.memory.role].call(this);
    }
}
