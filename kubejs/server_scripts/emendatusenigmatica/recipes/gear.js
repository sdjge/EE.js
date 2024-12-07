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
				gear: isIngredientExist(`#forge:gears/${name}`),
				ingot: isIngredientExist(`#forge:ingots/${name}`),
				gem: isIngredientExist(`#forge:gems/${name}`),
			};
			let processedItems = {
				gear: findIngredientItem(`#forge:gears/${name}`, `emendatusenigmatica:${name}_gear`),
			};

			if (Platform.isLoaded("thermal") && blacklist.thermal.press.includes(name) == false && checkedTypes.gear) {
				e.custom(Thermal.press(processedItems.gear, [`4x #forge:${mat.baseItem}s/${name}`, "thermal:press_gear_die"]).energy(2400)).id(
					`emendatusenigmatica:thermal/press/${name}_gear`
				);
			}
		}
	);
});
