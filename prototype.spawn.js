const configuration = require('configuration');

module.exports = function() {

    const filterDamaged = {
        filter: (object) => object.hits < object.hitsMax
    };

    const filterIdle = {
        filter: creepFilter('idle')
    };

    function RoleMemory(role, targetId) {
        this.memory = {
            role: role,
            targetId: targetId
        };
    }

    function AttackerRoleMemory(role, targetFlagName) {
        this.memory = {
            role: role,
            targetFlagName: targetFlagName
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

    function fillWithPart(body, bodyPart, energyAvailable) {
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

    function fillMiner(body, energyAvailable) {
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

    function fillSamurai(body, energyAvailable) {
        let cost = calculateCost(body);
        while (cost < energyAvailable) {
            if (cost + BODYPART_COST[ATTACK] <= energyAvailable) {
                body.push(ATTACK);
                cost += BODYPART_COST[ATTACK];
            } else {
                break;
            }

            if (cost + BODYPART_COST[MOVE] <= energyAvailable) {
                body.push(MOVE);
                cost += BODYPART_COST[MOVE];
            } else {
                break;
            }
        }
    }

    function fillLord(body, energyAvailable) {
        let cost = calculateCost(body);
        while (cost < energyAvailable) {
            if (cost + BODYPART_COST[CLAIM] <= energyAvailable) {
                body.push(CLAIM);
                cost += BODYPART_COST[CLAIM];
            } else {
                break;
            }

            if (cost + BODYPART_COST[MOVE] <= energyAvailable) {
                body.push(MOVE);
                cost += BODYPART_COST[MOVE];
            } else {
                break;
            }
        }
    }

    function fillCarrier(body, energyAvailable) {
        let cost = calculateCost(body);
        while (cost < energyAvailable) {
            if (cost + BODYPART_COST[CARRY] <= energyAvailable) {
                body.push(CARRY);
                cost += BODYPART_COST[CARRY];
            } else {
                break;
            }

            if (cost + BODYPART_COST[CARRY] <= energyAvailable) {
                body.push(CARRY);
                cost += BODYPART_COST[CARRY];
            } else {
                break;
            }

            if (cost + BODYPART_COST[MOVE] <= energyAvailable) {
                body.push(MOVE);
                cost += BODYPART_COST[MOVE];
            } else {
                break;
            }
        }
    }

    function balacedFillWithParts(body, energyAvailable) {
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

    function reduceCreep(accumulator, creep) {
        return accumulator + creep.body.length;
    }

    function reduceWorkBodyPart(accumulator, bodyPart) {
        return (accumulator + ((bodyPart === WORK || bodyPart.type === WORK) ? 1 : 0));
    }

    function reduceWorkBody(workPartAcumulator, creep) {
        return workPartAcumulator + creep.getActiveBodyparts(WORK);
    }

    function filterAvailableSource(roomCreeps, sources) {
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

    StructureSpawn.prototype.spawnMiner = function(source) {
        if (source) {
            const creepBody = [WORK, WORK, MOVE];
            fillMiner(creepBody, this.room.energyAvailable);
            return this.spawnCreep(creepBody, 'Miner' + Game.time, new RoleMemory('miner', source.id));
        }
        return ERR_INVALID_TARGET;
    };

    StructureSpawn.prototype.spawnHarvester = function(source) {
        if (source) {
            const creepBody = [WORK, MOVE, CARRY];
            balacedFillWithParts(creepBody, this.room.energyAvailable);
            return this.spawnCreep(creepBody, 'Harvester' + Game.time, new RoleMemory('harvester', source.id));
        }
        return ERR_INVALID_TARGET;
    };

    StructureSpawn.prototype.spawnUpgrader = function() {
        const creepBody = [WORK, MOVE, CARRY];
        balacedFillWithParts(creepBody, this.room.energyAvailable);
        return this.spawnCreep(creepBody, 'Upgrader' + Game.time, new RoleMemory('upgrader', null));
    };

    StructureSpawn.prototype.spawnBuilder = function() {
        const creepBody = [WORK, MOVE, CARRY];
        balacedFillWithParts(creepBody, this.room.energyAvailable);
        return this.spawnCreep(creepBody, 'Builder' + Game.time, new RoleMemory('builder', null));
    };

    StructureSpawn.prototype.spawnCarrier = function() {
        const creepBody = [CARRY, CARRY, MOVE];
        fillCarrier(creepBody, this.room.energyAvailable);
        return this.spawnCreep(creepBody, 'Carrier' + Game.time, new RoleMemory('carrier', null));
    };

    StructureSpawn.prototype.spawnRepair = function() {
        const creepBody = [WORK, MOVE, CARRY];
        balacedFillWithParts(creepBody, this.room.energyAvailable);
        return this.spawnCreep(creepBody, 'Repairer' + Game.time, new RoleMemory('repair', null));
    };

    StructureSpawn.prototype.spawnSamurai = function(attackFlag) {
        if (attackFlag) {
            const creepBody = [ATTACK, MOVE, ATTACK, MOVE];
            fillSamurai(creepBody, this.room.energyAvailable);
            return this.spawnCreep(creepBody, 'Samurai' + Game.time, new SamuraiRoleMemory('samurai', attackFlag.name));
        }
        return ERR_INVALID_TARGET;
    };

    StructureSpawn.prototype.spawnLord = function(attackFlag) {
        if (attackFlag) {
            const creepBody = [CLAIM, MOVE];
            fillLord(creepBody, this.room.energyAvailable);
            return this.spawnCreep(creepBody, 'Lord' + Game.time, new AttackerRoleMemory('lord', attackFlag.name));
        }
        return ERR_INVALID_TARGET;
    };

    StructureSpawn.prototype.kill = function() {
        const idleCreeps = this.pos.findInRange(FIND_MY_CREEPS, 1, filterIdle);
        if (idleCreeps.length > 0) {
            this.recycleCreep(idleCreeps[0]);
        }
    };

    StructureSpawn.prototype.produce = function() {
        const room = this.room;
        const roomCreeps = room.find(FIND_MY_CREEPS);
        const source = filterAvailableSource(roomCreeps, room.find(FIND_SOURCES));
        const attackFlag = Game.flags[configuration.attackFlagName];
        const amount = {
            miner: _(roomCreeps).filter(creepFilter('miner')).size(),
            carrier: _(roomCreeps).filter(creepFilter('carrier')).size(),
            upgrader: _(roomCreeps).filter(creepFilter('upgrader')).size(),
            harvester: _(roomCreeps).filter(creepFilter('harvester')).size(),
            builder: _(roomCreeps).filter(creepFilter('builder')).size(),
            repairer: _(roomCreeps).filter(creepFilter('repair')).size(),
            samurai: _(Game.creeps).filter(creepFilter('samurai')).size(),
            lord: _(Game.creeps).filter(creepFilter('lord')).size()
        };

        const parts = {
            miner: _(roomCreeps).filter(creepFilter('miner')).reduce(reduceCreep, 0),
            carrier: _(roomCreeps).filter(creepFilter('carrier')).reduce(reduceCreep, 0)
        };

        if (room.energyAvailable < room.energyCapacityAvailable &&
            (source || parts.miner / parts.carrier > configuration.minerToCarrierRatio)) {
            Memory.shouldRefill = false;
        } else {
            Memory.shouldRefill = true;
        }

        if (this.energy === this.energyCapacity && amount.miner < 1 && amount.harvester < 1) {
            this.spawnHarvester(source);
        }

        if (room.energyAvailable === room.energyCapacityAvailable) {
            if (amount.miner < 1) {
                if (amount.carrier < 1 && amount.harvester < 1) {
                    this.spawnHarvester(source);
                } else {
                    this.spawnMiner(source);
                }
            } else if (parts.miner / parts.carrier > configuration.minerToCarrierRatio) {
                this.spawnCarrier();
            } else if (source) {
                this.spawnMiner(source);
            } else if (false && attackFlag && amount.samurai < configuration.numberSamurai) {
                this.spawnSamurai(attackFlag);
            } else if (attackFlag && amount.lord < configuration.numberLord) {
                this.spawnLord(attackFlag);
            } else if (amount.repairer < configuration.numberRepair && room.find(FIND_STRUCTURES, filterDamaged).length > 0) {
                this.spawnRepair();
            } else if (amount.builder < configuration.numberBuilder && room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                this.spawnBuilder();
            } else if (amount.upgrader < configuration.numberUpgrader) {
                this.spawnUpgrader();
            }
        }
    };
};
