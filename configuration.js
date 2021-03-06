module.exports = function(spawnName) {

    function isNotEmpty(value) {
        return value !== null && value !== undefined;
    }

    const config = {
        global: {
            numberRepair: 0,
            numberBuilder: 2,
            numberSamurai: 0,
            numberLord: 1,
            numberMerchant: 0,
            minerToCarrierRatio: 0.3,
            minerToConsumerRatio: 0.25,
            attackFlagName: 'Target',
            merchantFlagName: 'Source',
            merchantStorageId: null,
            longRangeBuildTargetId: null
        },
        Spawn2: {
            numberBuilder: 2,
            minerToCarrierRatio: 0.3,
            minerToConsumerRatio: 0.1
        },
        Spawn3: {
            numberBuilder: 4,
            numberMerchant: 2,
            minerToCarrierRatio: 1,
            minerToConsumerRatio: 0.2
        }
    };

    if (config[spawnName]) {
        return {
            numberRepair: isNotEmpty(config[spawnName].numberRepair) ? config[spawnName].numberRepair : config.global.numberRepair,
            numberBuilder: isNotEmpty(config[spawnName].numberBuilder) ? config[spawnName].numberBuilder : config.global.numberBuilder,
            numberSamurai: isNotEmpty(config[spawnName].numberSamurai) ? config[spawnName].numberSamurai : config.global.numberSamurai,
            numberLord: isNotEmpty(config[spawnName].numberLord) ? config[spawnName].numberLord : config.global.numberLord,
            numberMerchant: isNotEmpty(config[spawnName].numberMerchant) ? config[spawnName].numberMerchant : config.global.numberMerchant,
            minerToCarrierRatio: isNotEmpty(config[spawnName].minerToCarrierRatio) ? config[spawnName].minerToCarrierRatio : config.global.minerToCarrierRatio,
            minerToConsumerRatio: isNotEmpty(config[spawnName].minerToConsumerRatio) ? config[spawnName].minerToConsumerRatio : config.global.minerToConsumerRatio,
            attackFlagName: isNotEmpty(config[spawnName].attackFlagName) ? config[spawnName].attackFlagName : config.global.attackFlagName,
            merchantFlagName: isNotEmpty(config[spawnName].merchantFlagName) ? config[spawnName].merchantFlagName : config.global.merchantFlagName,
            merchantStorageId: isNotEmpty(config[spawnName].merchantStorageId) ? config[spawnName].merchantStorageId : config.global.merchantStorageId,
            longRangeBuildTargetId: isNotEmpty(config[spawnName].longRangeBuildTargetId) ? config[spawnName].longRangeBuildTargetId : config.global.longRangeBuildTargetId
        };
    }

    return config.global;
};
