module.exports = function() {

    StructureTower.prototype.defend = function() {
        if (this.energy > 0) {
            if (this.attackNearestHostile() !== OK) {
                if (this.healNearestDamagedCreep() !== OK) {
                    this.repairNearestStructure();
                }
            }
        }
    };

    StructureTower.prototype.attackNearestHostile = function() {
        const hostile = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            return this.attack(hostile);
        }
        return ERR_INVALID_TARGET;
    };

    StructureTower.prototype.healNearestDamagedCreep = function() {
        const damagedCreep = this.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: creep => creep.hits < creep.hitsMax
        });
        if (damagedCreep) {
            return this.heal(damagedCreep);
        }
        return ERR_INVALID_TARGET;
    };

    StructureTower.prototype.repairNearestStructure = function() {
        const damagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure => structure.hits < structure.hitsMax &&
                structure.structureType !== STRUCTURE_WALL
        });
        if (damagedStructure) {
            return this.repair(damagedStructure);
        }
        return ERR_INVALID_TARGET;
    };
};
