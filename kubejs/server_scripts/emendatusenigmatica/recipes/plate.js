ServerEvents.recipes((e) => {
	let blacklist = {
		thermal: {
			press: [
				"iron",
				"gold",
				"copper",
				"netherite",
				"nickel",
				"silver",
				"tin",
				"lead",
				"steel",
				"bronze",
				"electrum",
				"invar",
				"constantan",
				"signalum",
				"lumium",
				"enderium",
			],
		},
		adastra: ["iron", "steel", "desh", "ostrum", "calorite"],
	};

	global.EE_MATERIALS.forEach(
		/**
		 * @param {EEConfig} mat
		 */
		(mat) => {
			let name = mat.name;
			let checkedTypes = {
				plate: isIngredientExist(`#forge:plates/${name}`),
				ingot: isIngredientExist(`#forge:ingots/${name}`),
				gem: isIngredientExist(`#forge:gems/${name}`),
			};
			let processedItems = {
				plate: findIngredientItem(`#forge:plates/${name}`, `emendatusenigmatica:${name}_plate`),
			};

			if (Platform.isLoaded("thermal") && blacklist.thermal.press.includes(name) == false && checkedTypes.plate) {
				e.custom(Thermal.press(processedItems.plate, `#forge:${mat.baseItem}s/${name}`).energy(2400)).id(
					`emendatusenigmatica:thermal/press/${name}_plate`
				);
			}
			if (Platform.isLoaded("ad_astra") && !blacklist.adastra.includes(name) && checkedTypes.plate) {
				e.custom({
					type: "ad_astra:compressing",
					cookingtime: 100,
					energy: 20,
					ingredient: {
						tag: `forge:${mat.baseItem}s/${name}`,
					},
					result: {
						count: 1,
						id: processedItems.plate,
					},
				}).id(`emendatusenigmatica:adstra/press/${name}_plate_from_ingots`);
				e.custom({
					type: "ad_astra:compressing",
					cookingtime: 800,
					energy: 20,
					ingredient: {
						tag: `forge:storage_blocks/${name}`,
					},
					result: {
						count: 9,
						id: processedItems.plate,
					},
				}).id(`emendatusenigmatica:adstra/press/${name}_plate_from_blocks`);
			}
		}
	);
});
