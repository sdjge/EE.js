// priority: 93
//requires: featurejs
let globalOreGenConfig = {
	size: 10,
	chance: 0,
	count: 20,
	aboveBottom: -60,
	belowTop: 150,
};

/**
 *
 * @todo maybe i need to add more config?
 * @todo need to fix only vanila ores in end/nether!!
 *
 */
global.EE_MATERIALS.forEach(
	/**
	 * @param {EEConfig} mat
	 */
	(mat) => {
		let featureConfigured = (nameF, size, chance, target, state) => {
			try {
				FeatureEvents.configured((event) => {
					event
						.create(nameF)
						.type("minecraft:ore")
						.oreConfiguration((properties) => {
							properties.size(size).chance(chance);
							properties.addTarget(target, state);
						});
				});
			} catch (err) {
				console.error(err);
				console.error(`feature ${state} ${target} configured err`);
			}
		};
		let featurePlaced = (nameF, feature, count, aboveBottom, belowTop) => {
			try {
				FeatureEvents.placed((event) => {
					let modifiers = event.getPlacementModifiers();
					event
						.create(nameF)
						.feature(feature)
						.placement(modifiers.count(count), modifiers.inSquare(), modifiers.heightRangeUniform(VerticalAnchor.aboveBottom(aboveBottom), VerticalAnchor.belowTop(belowTop)), modifiers.biomeFilter());
				});
			} catch (err) {
				console.error(err);
				console.error(`feature ${nameF} ${feature} placed err`);
			}
		};
		let featureModifier = (biome, nameF) => {
			try {
				FeatureEvents.biomeModifier((event) => {
					event.addFeatures(biome, nameF, "underground_ores");
				});
			} catch (err) {
				console.error(err);
				console.error(`feature ${nameF} ${biome} modifier err`);
			}
		};

		let strata = mat.strata;
		if (!strata) return;

		let name = mat.name;
		let genConfig = mat.genConfig;
		let EE_STRATAS = global.EE_STRATAS;

		strata.forEach((s) => {
			if (genConfig) {
				featureConfigured(`${global.EE_PACKID}:${name}_configured_${s}`, genConfig.size, genConfig.chance, `${EE_STRATAS[s].fill}`, `${global.EE_PACKID}:${name}_ore_${s}`);
				featurePlaced(`${global.EE_PACKID}:${name}_placed_${s}`, `${global.EE_PACKID}:${name}_configured_${s}`, genConfig.count, genConfig.bottom, genConfig.top);
				featureModifier(genConfig.biome, `${global.EE_PACKID}:${name}_placed_${s}`);
				// in nether
				if (genConfig.disableNether != true) {
					featureModifier("#is_nether", `${global.EE_PACKID}:${name}_placed_${s}`);
				}
				// in end
				if (genConfig.disableEnd != true) {
					featureModifier("#is_end", `${global.EE_PACKID}:${name}_placed_${s}`);
				}
			} else {
				featureConfigured(`${global.EE_PACKID}:${name}_configured_${s}`, globalOreGenConfig.size, globalOreGenConfig.chance, `${EE_STRATAS[s].fill}`, `${global.EE_PACKID}:${name}_ore_${s}`);
				featurePlaced(`${global.EE_PACKID}:${name}_placed_${s}`, `${global.EE_PACKID}:${name}_configured_${s}`, globalOreGenConfig.count, globalOreGenConfig.aboveBottom, globalOreGenConfig.belowTop);
				featureModifier("#minecraft:is_overworld", `${global.EE_PACKID}:${name}_placed_${s}`);
				featureModifier("#is_nether", `${global.EE_PACKID}:${name}_placed_${s}`);
				featureModifier("#is_end", `${global.EE_PACKID}:${name}_placed_${s}`);
			}
		});
	}
);
