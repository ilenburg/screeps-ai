const configuration = require('configuration');

module.exports = function() {

    function RoleMemory(role, targetId) {
        this.memory = {
            role: role,
            targetId: targetId
        };
    }

    function creepFilter(role) {
        return function(creep) {
            return creep.memory.role === role;
        }
    }

    function sourceFilter(sourceId) {
        return function(creep) {
            return creep.memory.targetId === sourceId;
        }
    }

    function calculateCost(body) {
        let cost = 0;
        body.forEach(bodyPart => cost += BODYPART_COST[bodyPart]);
        return cost;
    }

    function fillWithPart(body, bodyPart) {
        const energyAvailable = this.room.energyAvailable;
        let cost = calculateCost(body);
        while (cost < energyAvailable) {
            if (cost + BODYPART_COST[bodyPart] <= energyAvailable) {
                body.push(bodyPart);
                cost += BODYPART_COST[bodyPart];
            } else {
                break;
            }
        }
    }

    function fillMiner(body) {
        const energyAvailable = this.room.energyAvailable;
        let cost = calculateCost(body);
        while (cost < energyAvailable) {
            if (cost + BODYPART_COST[WORK] <= energyAvailable && body.reduce(reduceWorkBodyPart, 0) < 5) {
                body.push(WORK);
                cost += BODYPART_COST[WORK];
            } else {
                break;
            }
        }
    }

    function balacedFillWithParts(body) {
        const energyAvailable = this.room.energyAvailable;
        let cost = calculateCost(body);
        const bodyParts = [WORK, MOVE, CARRY];
        while (cost < energyAvailable) {
            let fit = false;
            bodyParts.forEach(bodyPart => {
                if (cost + BODYPART_COST[bodyPart] <= energyAvailable) {
                    body.push(bodyPart);
                    cost += BODYPART_COST[bodyPart];
                    fit = true;
                }
            });
            if (!fit) {
                break;
            }
        }
    }

    function reduceWorkBodyPart(accumulator, bodyPart) {
        return (accumulator + ((bodyPart.type === WORK) ? 1 : 0));
    }

    function reduceWorkBody(workPartAcumulator, creep) {
        const workPartCount = creep.body.reduce(reduceWorkBodyPart, 0);
        return workPartAcumulator + workPartCount;
    }

    function findSource(roomCreeps) {
        const sources = this.room.find(FIND_SOURCES);
        for (var i = 0; i < sources.length; i++) {
            const sourceCreeps = _(roomCreeps).filter(sourceFilter(sources[i].id)).value();
            if ((sources[i].getHarvestSlots() > sourceCreeps.length &&
                    sourceCreeps.reduce(reduceWorkBody, 0) < 5) ||
                (sourceCreeps.length === 1 && sourceCreeps[0].ticksToLive < 200)) {
                return sources[i];
            }
        }
        return null;
    }

    const minerFilter = new RoleMemory('miner', null);
    const carrierFilter = new RoleMemory('carrier', null);

    StructureSpawn.prototype.spawnMiner = function(source) {
        if (source) {
            const creepBody = [WORK, WORK, MOVE];
            fillMiner.call(this, creepBody);
            return this.spawnCreep(creepBody, 'Miner' + Game.time, new RoleMemory('miner', source.id));
        }
        return ERR_INVALID_TARGET;
    }

    StructureSpawn.prototype.spawnHarvester = function(source) {
        if (source) {
            const creepBody = [WORK, MOVE, CARRY];
            balacedFillWithParts.call(this, creepBody);
            return this.spawnCreep(creepBody, 'Harvester' + Game.time, new RoleMemory('harvester', source.id));
        }
        return ERR_INVALID_TARGET;
    }

    StructureSpawn.prototype.spawnUpgrader = function() {
        const creepBody = [WORK, CARRY, MOVE];
        balacedFillWithParts.call(this, creepBody);
        return this.spawnCreep(creepBody, 'Upgrader' + Game.time, new RoleMemory('upgrader', null));
    }

    StructureSpawn.prototype.spawnBuilder = function() {
        const creepBody = [WORK, CARRY, MOVE];
        balacedFillWithParts.call(this, creepBody);
        return this.spawnCreep(creepBody, 'Builder' + Game.time, new RoleMemory('builder', null));
    }

    StructureSpawn.prototype.spawnCarrier = function() {
        const creepBody = [CARRY, CARRY, MOVE];
        fillWithPart.call(this, creepBody, CARRY);
        return this.spawnCreep(creepBody, 'Carrier' + Game.time, new RoleMemory('carrier', null));
    }

    StructureSpawn.prototype.spawnRepair = function() {
        const creepBody = [WORK, CARRY, MOVE];
        balacedFillWithParts.call(this, creepBody);
        return this.spawnCreep(creepBody, 'Repairer' + Game.time, new RoleMemory('repair', null));
    }

    StructureSpawn.prototype.kill = function() {
        const idleCreeps = this.pos.findInRange(FIND_MY_CREEPS, 1, {
            filter: creepFilter('idle')
        });
        if (idleCreeps.length > 0) {
            this.recycleCreep(idleCreeps[0]);
        }
    }

    StructureSpawn.prototype.produce = function() {
        const roomCreeps = this.room.find(FIND_MY_CREEPS);
        const source = findSource.call(this, roomCreeps);
        const amount = {
            miner: _(roomCreeps).filter(creepFilter('miner')).size(),
            carrier: _(roomCreeps).filter(creepFilter('carrier')).size(),
            upgrader: _(roomCreeps).filter(creepFilter('upgrader')).size(),
            harvester: _(roomCreeps).filter(creepFilter('harvester')).size(),
            builder: _(roomCreeps).filter(creepFilter('builder')).size(),
            repairer: _(roomCreeps).filter(creepFilter('repair')).size()
        };

        if (this.room.energyAvailable < this.room.energyCapacityAvailable &&
            (source || amount.miner / amount.carrier > configuration.minerToCarrierRatio)) {
            Memory.shouldRefill = false;
        } else {
            Memory.shouldRefill = true;
        }

        if (this.room.energyAvailable === this.room.energyCapacityAvailable) {
            if (amount.miner < 1) {
                if (amount.carrier < 1 && amount.harvester < 1) {
                    this.spawnHarvester(source);
                } else {
                    this.spawnMiner(source);
                }
            } else if (amount.miner / amount.carrier > configuration.minerToCarrierRatio) {
                this.spawnCarrier();
            } else if (source) {
                this.spawnMiner(source);
            } else if (amount.builder < configuration.numberBuilder && this.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                this.spawnBuilder();
            } else if (amount.repairer < configuration.numberRepair && this.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                }).length > 0) {
                this.spawnRepair();
            } else if (amount.upgrader < configuration.numberUpgrader) {
                this.spawnUpgrader();
            }
        }
    }
};
