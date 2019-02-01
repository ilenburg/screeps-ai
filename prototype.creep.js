module.exports = function() {

    function getResource(containerStore) {
        for (let resource in containerStore) {
            if (containerStore.hasOwnProperty(resource) && containerStore[resource] > 0) {
                return resource;
            }
        }
    }

    function getMineral(containerStore) {
        for (let resource in containerStore) {
            if (containerStore.hasOwnProperty(resource) && resource !== RESOURCE_ENERGY) {
                return resource;
            }
        }
    }

    function randomDirection() {
        return Math.floor((Math.random() * 8) + 1);
    }

    const roles = {
        miner: require('role.miner'),
        carrier: require('role.carrier'),
        upgrader: require('role.upgrader'),
        idle: require('role.idle'),
        harvester: require('role.harvester'),
        builder: require('role.builder'),
        repair: require('role.repair'),
        samurai: require('role.samurai'),
        lord: require('role.lord'),
        merchant: require('role.merchant'),
        linkMiner: require('role.miner.link')
    };

    Creep.prototype.transferMineral = function(target) {
        return this.transfer(target, getMineral(this.carry));
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
            } else if (target instanceof StructureLink) {
                actionResult = this.withdraw(target, RESOURCE_ENERGY);
            } else {
                actionResult = this.withdraw(target, getResource(target.store));
                if (_.sum(target.store) < 50) {
                    this.memory.targetId = null;
                }
            }

            if (actionResult !== OK) {
                if (actionResult === ERR_NOT_IN_RANGE) {
                    actionResult = this.moveTo(target);
                } else {
                    this.memory.targetId = null;
                }
            }
            return actionResult;
        } else {
            this.memory.targetId = null;
            return ERR_INVALID_TARGET;
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
        const resource = Game.getObjectById(this.memory.spawnId);
        if (resource) {
            const container = resource.pos.findFilledContainerInArea();
            if (container) {
                if (this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            } else {
                if (this.room.memory.shouldRefill && resource.energy > resource.energyCapacity / 2) {
                    if (this.withdraw(resource, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        this.moveTo(resource);
                    }
                } else {
                    this.move(randomDirection());
                }
            }
        }
    };

    Creep.prototype.executeRole = function() {
        roles[this.memory.role].call(this);
    };
};
