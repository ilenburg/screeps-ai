module.exports = function() {

    function Memory(role, targetId) {
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

    function reduceWorkBody(workPartAcumulator, creep) {
        const workPartCount = creep.body.reduce((accumulator, bodyPart) => accumulator + ((bodyPart.type === WORK) ? 1 : 0), 0);
        return workPartAcumulator + workPartCount;
    }

    function findSource(roomCreeps) {
        const sources = this.room.find(FIND_SOURCES);
        for (var i = 0; i < sources.length; i++) {
            const sourceCreeps = _(roomCreeps).filter(sourceFilter(sources[i].id)).value();
            if (sources[i].getHarvestSlots() > sourceCreeps.length &&
                sourceCreeps.reduce(reduceWorkBody, 0) < 5) {
                return sources[i];
            }
        }
        return null;
    }

    const minerFilter = new Memory('miner', null);
    const carrierFilter = new Memory('carrier', null);

    const upgraderNumber = 4;
    const toMinerRatio = 0.5;
    const minerToCarrierRatio = 0.5;

    StructureSpawn.prototype.spawnMiner = function(source) {
        if (source) {
            const creepBody = [WORK, WORK, MOVE];
            fillWithPart.call(this, creepBody, WORK);
            return this.spawnCreep(creepBody, 'Miner' + Game.time, new Memory('miner', source.id));
        }
        return ERR_INVALID_TARGET;
    }

    StructureSpawn.prototype.spawnHarvester = function(source) {
        if (source) {
            const creepBody = [WORK, MOVE, CARRY];
            balacedFillWithParts.call(this, creepBody);
            return this.spawnCreep(creepBody, 'Harvester' + Game.time, new Memory('harvester', source.id));
        }
        return ERR_INVALID_TARGET;
    }

    StructureSpawn.prototype.spawnUpgrader = function() {
        const creepBody = [WORK, CARRY, MOVE];
        balacedFillWithParts.call(this, creepBody);
        return this.spawnCreep(creepBody, 'Upgrader' + Game.time, new Memory('upgrader', null));
    }

    StructureSpawn.prototype.spawnBuilder = function() {
        const creepBody = [WORK, CARRY, MOVE];
        fillWithPart.call(this, creepBody, WORK);
        return this.spawnCreep(creepBody, 'Builder' + Game.time, new Memory('builder', null));
    }

    StructureSpawn.prototype.spawnCarrier = function() {
        const creepBody = [CARRY, CARRY, MOVE];
        fillWithPart.call(this, creepBody, CARRY);
        return this.spawnCreep(creepBody, 'Carrier' + Game.time, new Memory('carrier', null));
    }

    StructureSpawn.prototype.spawnRepair = function() {
        const creepBody = [WORK, CARRY, MOVE];
        balacedFillWithParts.call(this, creepBody);
        return this.spawnCreep(creepBody, 'Repairer' + Game.time, new Memory('repair', null));
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
        if (this.room.energyAvailable === this.room.energyCapacityAvailable) {
            const roomCreeps = this.room.find(FIND_MY_CREEPS);

            const amount = {
                miner: _(roomCreeps).filter(creepFilter('miner')).size(),
                carrier: _(roomCreeps).filter(creepFilter('carrier')).size(),
                upgrader: _(roomCreeps).filter(creepFilter('upgrader')).size(),
                harvester: _(roomCreeps).filter(creepFilter('harvester')).size(),
                builder: _(roomCreeps).filter(creepFilter('builder')).size(),
                repair: _(roomCreeps).filter(creepFilter('repair')).size()
            };

            if (amount.miner < 1) {
                const source = findSource.call(this, roomCreeps);
                if (source) {
                    if (amount.carrier < 1 && amount.harvester < 1) {
                        this.spawnHarvester(source);
                    } else {
                        this.spawnMiner(source);
                    }
                }
            } else if (amount.miner / amount.carrier > minerToCarrierRatio) {
                this.spawnCarrier();
            } else if (amount.miner / amount.builder > toMinerRatio && this.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                this.spawnBuilder();
            } else if (amount.repair < 1) {
                this.spawnRepair();
            } else if (amount.upgrader < upgraderNumber) {
                this.spawnUpgrader();
            } else {
                const source = findSource.call(this, roomCreeps);
                if (source) {
                    this.spawnMiner(source);
                }
            }
        }
    }
};
