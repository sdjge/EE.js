// priority: -1

LootJS.modifiers((e) => {
	/**
	 * @param {string} tag
	 * @param {string} search
	 * @returns
	 */
	let isIngredientExist = (tag, search) => {
		if (search == undefined) return !Ingredient.of(tag).getItemIds().length == 0;
		// If it includes 'minecraft:barrier', the requested tag not exist valid item
		else return Ingredient.of(tag).getItemIds().toString().includes(search);
	};

	global.EE_MATERIALS.forEach(
		/**
		 * @param {EEConfig} material
		 */
		(material) => {
			if (material.name && isIngredientExist(`#forge:ores/${material.name}`)) {
				if (material.drop == undefined) return;
				console.log(
					`Modifying loot for ${material.name}: ${
						Ingredient.of(`#forge:ores/${material.name}`).getItemIds().length
					} ores`
				);
				Ingredient.of(`#forge:ores/${material.name}`)
					.getItemIds()
					.forEach((item) => {
						e.addBlockLootModifier(item)
							.removeLoot(Ingredient.all)
							.addAlternativesLoot(
								LootEntry.of(item).when((c) => {
									c.customCondition({
										condition: "minecraft:match_tool",
										predicate: {
											enchantments: [
												{
													enchantment: "minecraft:silk_touch",
													levels: {
														min: 1,
													},
												},
											],
										},
									});
								}),
								LootEntry.of(material.drop.item)
									.limitCount([material.drop.min, material.drop.max])
									.applyOreBonus("minecraft:fortune")
									.simulateExplosionDecay()
							)
							.matchMainHand(ItemFilter.hasEnchantment("miniutilities:molten_head"))
							.smeltLoot();
					});
			}
		}
	);
});
