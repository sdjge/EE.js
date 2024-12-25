// priority: 93

// require featureJS！
if (Platform.isLoaded("featurejs")) {
	/**
	 *
	 * @todo more config!!!
	 * @todo end gen fix!
	 *
	 */
	global.EE_MATERIALS.forEach(
		/**
		 * @param {EEConfig} mat
		 */
		(mat) => {
			let featureConfigured = (nameF, size, chance, target, state) => {
				FeatureEvents.configured((event) => {
					event
						.create(nameF)
						.type("minecraft:ore")
						.oreConfiguration((properties) => {
							properties.size(size).chance(chance);
							properties.addTarget(target, state);
						});
				});
			};
			let featurePlaced = (nameF, feature, count, aboveBottom, belowTop) => {
				FeatureEvents.placed((event) => {
					let modifiers = event.getPlacementModifiers();
					event
						.create(nameF)
						.feature(feature)
						.placement(
							modifiers.count(count),
							modifiers.inSquare(),
							modifiers.heightRangeUniform(VerticalAnchor.aboveBottom(aboveBottom), VerticalAnchor.belowTop(belowTop)),
							modifiers.biomeFilter()
						);
				});
			};
			let featureModifier = (biome, nameF) => {
				FeatureEvents.biomeModifier((event) => {
					event.addFeatures(biome, nameF, "underground_ores");
				});
			};

			let strata = mat.strata;
			if (!strata) return;

			let name = mat.name;
			let genConfig = mat.genConfig;
			let EE_STRATAS = global.EE_STRATAS;
			strata.forEach((s) => {
				if (genConfig) {
					featureConfigured(
						`emendatusenigmatica:${name}_configured_${s}`,
						genConfig.size,
						genConfig.chance,
						`${EE_STRATAS[s].fill}`,
						`emendatusenigmatica:${name}_ore_${s}`
					);
					featurePlaced(
						`emendatusenigmatica:${name}_placed_${s}`,
						`emendatusenigmatica:${name}_configured_${s}`,
						genConfig.count,
						genConfig.bottom,
						genConfig.top
					);
					/* featurePlaced(
						`emendatusenigmatica:${name}_placed_end_stone_in_end`,
						`emendatusenigmatica:${name}_configured_end_stone`,
						genConfig.count,
						-60,
						150
					); */
					featureModifier(genConfig.biome, `emendatusenigmatica:${name}_placed_${s}`);
					if (genConfig.disableNether != true) {
						featureModifier("#is_nether", `emendatusenigmatica:${name}_placed_${s}`);
					}
					/* if (genConfig.disableEnd != true) {
						featureModifier("#is_end", `emendatusenigmatica:${name}_placed_end_stone_in_end`);
					} */
				} else {
					featureConfigured(
						`emendatusenigmatica:${name}_configured_${s}`,
						10,
						0,
						`${EE_STRATAS[s].fill}`,
						`emendatusenigmatica:${name}_ore_${s}`
					);
					featurePlaced(`emendatusenigmatica:${name}_placed_${s}`, `emendatusenigmatica:${name}_configured_${s}`, 20, -60, 200);
					featurePlaced(
						`emendatusenigmatica:${name}_placed_end_stone_in_end`,
						`emendatusenigmatica:${name}_configured_${s}`,
						20,
						-60,
						150
					);
					featureModifier("#minecraft:is_overworld", `emendatusenigmatica:${name}_placed_${s}`);
					featureModifier("#is_nether", `emendatusenigmatica:${name}_placed_${s}`);
					/* featureModifier("#is_end", `emendatusenigmatica:${name}_placed_end_stone_in_end`); */
				}
			});
		}
	);
}
