module.exports = function() {

    const roles = {
        miner: require('role.miner'),
        carrier: require('role.carrier'),
        upgrader: require('role.upgrader'),
        idle: require('role.idle'),
        harvester: require('role.harvester'),
        builder: require('role.builder'),
        repair: require('role.repair'),
        samurai: require('role.samurai'),
        lord: require('role.lord')
    };

    Creep.prototype.seekAndAttack = function(target) {
        if (this.attack(target) == ERR_NOT_IN_RANGE) {
            return this.moveTo(target);
        }
    };

    Creep.prototype.collect = function(target) {
        if (target) {
            this.memory.targetId = target.id;
            let actionResult;
            if (target instanceof Resource) {
                actionResult = this.pickup(target);
                if (target.amount < 50) {
                    this.memory.targetId = null;
                }
            } else {
                actionResult = this.withdraw(target, RESOURCE_ENERGY);
                if (target.store[RESOURCE_ENERGY] < 50) {
                    this.memory.targetId = null;
                }
            }

            if (actionResult !== OK) {
                if (actionResult === ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                } else {
                    this.memory.targetId = null;
                }
            }
        } else {
            this.memory.targetId = null;
        }
    };

    Creep.prototype.checkRefillState = function() {
        if (this.memory.refill && this.carry[RESOURCE_ENERGY] === this.carryCapacity) {
            this.memory.refill = false;
        }

        if (!this.memory.refill && this.carry[RESOURCE_ENERGY] === 0) {
            this.memory.refill = true;
        }
    };

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
    };

    Creep.prototype.executeRole = function() {
        roles[this.memory.role].call(this);
    };
};
