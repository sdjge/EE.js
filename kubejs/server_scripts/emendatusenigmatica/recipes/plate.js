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
		}
	);
});
