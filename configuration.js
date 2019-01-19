module.exports = function(spawnName) {

    function notEmpty(value) {
        return value !== null && value !== undefined;
    }

    const config = {
        global: {
            numberRepair: 0,
            numberBuilder: 1,
            numberSamurai: 0,
            numberLord: 0,
            numberMerchant: 1,
            minerToCarrierRatio: 0.15,
            minerToConsumerRatio: 0.15,
            attackFlagName: 'Target',
            merchantFlagName: 'Source',
            merchantStorageId: '5c3ec5abca6284463c4fcf44',
            longRangeBuildTargetId: null
        },
        Spawn2: {
            numberBuilder: 6,
            numberMerchant: 0,
            minerToCarrierRatio: 0.3,
            minerToConsumerRatio: 0.3,
            numberRepair: 1
        }
    };

    if (config[spawnName]) {
        return {
            numberRepair: notEmpty(config[spawnName].numberRepair) ? config[spawnName].numberRepair : config.global.numberRepair,
            numberBuilder: notEmpty(config[spawnName].numberBuilder) ? config[spawnName].numberBuilder : config.global.numberBuilder,
            numberSamurai: notEmpty(config[spawnName].numberSamurai) ? config[spawnName].numberSamurai : config.global.numberSamurai,
            numberLord: notEmpty(config[spawnName].numberLord) ? config[spawnName].numberLord : config.global.numberLord,
            numberMerchant: notEmpty(config[spawnName].numberMerchant) ? config[spawnName].numberMerchant : config.global.numberMerchant,
            minerToCarrierRatio: notEmpty(config[spawnName].minerToCarrierRatio) ? config[spawnName].minerToCarrierRatio : config.global.minerToCarrierRatio,
            minerToConsumerRatio: notEmpty(config[spawnName].minerToConsumerRatio) ? config[spawnName].minerToConsumerRatio : config.global.minerToConsumerRatio,
            attackFlagName: notEmpty(config[spawnName].attackFlagName) ? config[spawnName].attackFlagName : config.global.attackFlagName,
            merchantFlagName: notEmpty(config[spawnName].merchantFlagName) ? config[spawnName].merchantFlagName : config.global.merchantFlagName,
            merchantStorageId: notEmpty(config[spawnName].merchantStorageId) ? config[spawnName].merchantStorageId : config.global.merchantStorageId,
            longRangeBuildTargetId: notEmpty(config[spawnName].longRangeBuildTargetId) ? config[spawnName].longRangeBuildTargetId : config.global.longRangeBuildTargetId
        };
    }

    return config.global;
};
