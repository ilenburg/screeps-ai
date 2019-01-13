module.exports = function() {
    Source.prototype.getHarvestSlots = function() {
        const sourcePos = this.pos;
        const terrain = new Room.Terrain(this.room.name);
        let harvestSlots = 0;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                if (terrain.get(sourcePos.x + i, sourcePos.y + j) != TERRAIN_MASK_WALL) {
                    ++harvestSlots;
                }
            }
        }
        return harvestSlots;
    }
}
