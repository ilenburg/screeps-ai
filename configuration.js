module.exports = function(spawnName) {

    const config = {
        global: {
            numberRepair: 0,
            numberBuilder: 2,
            numberSamurai: 0,
            numberLord: 1,
            numberMerchant: 1,
            minerToCarrierRatio: 0.2,
            minerToConsumerRatio: 0.15,
            attackFlagName: 'Target',
            merchantFlagName: 'Source',
            merchantStorageId: '5c3ec5abca6284463c4fcf44',
            longRangeBuildTargetId: '5c4252d8e2e5d869306bfa38'
        }
    };

    if (config[spawnName]) {
        return {
            numberRepair: config[spawnName].numberRepair ? config[spawnName].numberRepair : config.global.numberRepair,
            numberBuilder: config[spawnName].numberBuilder ? config[spawnName].numberBuilder : config.global.numberBuilder,
            numberSamurai: config[spawnName].numberSamurai ? config[spawnName].numberSamurai : config.global.numberSamurai,
            numberLord: config[spawnName].numberLord ? config[spawnName].numberLord : config.global.numberLord,
            numberMerchant: config[spawnName].numberMerchant ? config[spawnName].numberMerchant : config.global.numberMerchant,
            minerToCarrierRatio: config[spawnName].minerToCarrierRatio ? config[spawnName].minerToCarrierRatio : config.global.minerToCarrierRatio,
            minerToConsumerRatio: config[spawnName].minerToConsumerRatio ? config[spawnName].minerToConsumerRatio : config.global.minerToConsumerRatio,
            attackFlagName: config[spawnName].attackFlagName ? config[spawnName].attackFlagName : config.global.attackFlagName,
            merchantFlagName: config[spawnName].merchantFlagName ? config[spawnName].merchantFlagName : config.global.merchantFlagName,
            merchantStorageId: config[spawnName].merchantStorageId ? config[spawnName].merchantStorageId : config.global.merchantStorageId,
            longRangeBuildTargetId: config[spawnName].longRangeBuildTargetId ? config[spawnName].longRangeBuildTargetId : config.global.longRangeBuildTargetId
        };
    }

    return config.global;
};
