// priority: 92

ServerEvents.recipes((event) => {
	let blacklist = {
		thermal: {
			press: ["iron", "gold", "copper", "netherite", "nickel", "silver", "tin", "lead", "steel", "bronze", "electrum", "invar", "constantan", "signalum", "lumium", "enderium"],
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
				gear: findIngredientItem(`#forge:gears/${name}`, `${global.EE_PACKID}:${name}_gear`),
			};

			if (loadedMods.thermalfoundation && blacklist.thermal.press.includes(name) == false && checkedTypes.gear) {
				event.custom(Thermal.press(processedItems.gear, [`4x #forge:${mat.baseItem}s/${name}`, "thermal:press_gear_die"]).energy(2400)).id(`${global.EE_PACKID}:thermal/press/${name}_gear`);
			}
		}
	);
});
