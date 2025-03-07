// priority: 91

ServerEvents.recipes((e) => {
	let blacklist = {
		create: ["iron", "gold", "copper", "zinc", "osmium", "tin", "lead", "uranium"],
		immersiveengineering: {
			hammerCrushing: ["iron", "copper", "gold", "aluminum", "osmium", "lead", "nickel", "silver", "tin", "uranium", "zinc"],
			crusher: ["copper", "aluminum", "lead", "silver", "nickel", "uranium", "constantan", "electrum", "steel", "iron", "gold", "osmium", "tin", "zinc", "silver", "coal_coke", "invar", "bronze", "brass", "fluorite"],
		},
		enderio: {
			sag: ["coal", "iron", "ender_pearl", "gold", "quartz", "lapis", "wood"],
		},
		mekanism: {
			crusher: ["coal", "iron", "copper", "gold", "netherite", "diamond", "emerald", "osmium", "lead", "tin", "uranium", "fluorite", "bronze", "steel", "wood"],
		},
		thermal: {
			pulverizer: ["iron", "gold", "copper", "netherite", "nickel", "silver", "tin", "lead", "steel", "bronze", "electrum", "invar", "constantan", "signalum", "lumium", "enderium", "quartz"],
		},
		occultism: [
			"zinc",
			"ruby",
			"redstone",
			"lead",
			"silver",
			"emerald",
			"diamond",
			"iron",
			"invar",
			"quartz",
			"tin",
			"osmium",
			"cinnabar",
			"end_stone",
			"aluminum",
			"nickel",
			"iesnium",
			"copper",
			"uranium",
			"electrum",
			"netherite",
			"lapis",
			"coal",
			"sapphire",
			"sulfur",
			"enderium",
			"fluorite",
			"bronze",
			"apatite",
			"constantan",
			"signalum",
			"lumium",
			"brass",
			"obisdian",
			"steel",
		],
	};

	global.EE_MATERIALS.forEach(
		/**
		 * @param {EEConfig} mat
		 */
		(mat) => {
			let name = mat.name;
			let oreToDustMultiplier = mat.oreToDustMultiplier || 1;

			let checkedTypes = {
				ore: isIngredientExist(`#forge:ores/${name}`),
				raw: isIngredientExist(`#forge:raw_materials/${name}`),
				rawBlock: isIngredientExist(`#forge:storage_blocks/raw_${name}`),
				ingot: isIngredientExist(`#forge:ingots/${name}`),
				gem: isIngredientExist(`#forge:gems/${name}`),
				block: isIngredientExist(`#forge:storage_blocks/${name}`),
				dust: isIngredientExist(`#forge:dusts/${name}`),
			};
			let processedItems = {
				ingot: findIngredientItem(`#forge:ingots/${name}`, `${global.EE_PACKID}:${name}_ingot`),
				crushed: findIngredientItem(`#create:crushed_raw_materials/${name}`, `${global.EE_PACKID}:crushed_${name}`),
				nugget: findIngredientItem(`#forge:nuggets/${name}`, `${global.EE_PACKID}:${name}_nugget`),
				raw: findIngredientItem(`#forge:raw_materials/${name}`, `${global.EE_PACKID}:raw_${name}`),
				rawBlock: findIngredientItem(`#forge:storage_blocks/raw_${name}`, `${global.EE_PACKID}:raw_${name}_block`),
				dust: findIngredientItem(`#forge:dusts/${name}`, `${global.EE_PACKID}:${name}_dust`),
				gem: findIngredientItem(`#forge:gems/${name}`, `${global.EE_PACKID}:${name}_gem`),
			};

			if (loadedMods.immersiveengineering) {
				if (checkedTypes.ore && mat.baseItem == "ingot") {
					if (!blacklist.immersiveengineering.hammerCrushing.includes(name)) {
						e.custom(ImmersiveEngineering.hammerCrushing(`#forge:dusts/${name}`, `#forge:ores/${name}`)).id(`${global.EE_PACKID}:immersiveengineering/hammercrushing/${name}_ore`);
					}
					if (!blacklist.immersiveengineering.crusher.includes(name)) {
						e.custom(ImmersiveEngineering.crusher(`${2 * oreToDustMultiplier}x #forge:dusts/${name}`, `#forge:ores/${name}`, 6000)).id(`${global.EE_PACKID}:immersiveengineering/crusher/${name}_ore`);
					}
				}
				if (checkedTypes.raw && mat.baseItem == "ingot") {
					if (!blacklist.immersiveengineering.hammerCrushing.includes(name)) {
						e.custom(ImmersiveEngineering.hammerCrushing(`#forge:dusts/${name}`, `#forge:raw_materials/${name}`)).id(`${global.EE_PACKID}:immersiveengineering/hammercrushing/${name}_raw`);
					}
					if (!blacklist.immersiveengineering.crusher.includes(name)) {
						e.custom(ImmersiveEngineering.crusher(`${oreToDustMultiplier}x #forge:dusts/${name}`, `#forge:raw_materials/${name}`, 6000, [`#forge:dusts/${name} 0.33`])).id(
							`${global.EE_PACKID}:immersiveengineering/crusher/${name}_raw`
						);
					}
				}
				if (checkedTypes.rawBlock && mat.baseItem == "ingot") {
					if (!blacklist.immersiveengineering.crusher.includes(name)) {
						e.custom(ImmersiveEngineering.crusher(`${12 * oreToDustMultiplier}x #forge:dusts/${name}`, `#forge:storage_blocks/raw_${name}`, 54000)).id(
							`${global.EE_PACKID}:immersiveengineering/crusher/${name}_raw_block`
						);
					}
				}
				if (checkedTypes.ingot) {
					if (!blacklist.immersiveengineering.crusher.includes(name)) {
						e.custom(ImmersiveEngineering.crusher(`#forge:dusts/${name}`, `#forge:ingots/${name}`, 3000)).id(`${global.EE_PACKID}:immersiveengineering/crusher/${name}_ingot`);
					}
				}
				if (checkedTypes.gem) {
					if (!blacklist.immersiveengineering.crusher.includes(name)) {
						e.custom(ImmersiveEngineering.crusher(`#forge:dusts/${name}`, `#forge:gems/${name}`, 3000)).id(`${global.EE_PACKID}:immersiveengineering/crusher/${name}_gem`);
					}
				}
			}

			if (loadedMods.enderio) {
				if (!blacklist.enderio.sag.includes(name)) {
					e.recipes.enderio.sag_milling([processedItems.dust], `#forge:${mat.baseItem}s/${name}`).energy(2000).id(`${global.EE_PACKID}:enderio/sag_milling/${name}_${mat.baseItem}`);

					if (checkedTypes.ore) {
						if (mat.baseItem == "ingot")
							e.recipes.enderio
								.sag_milling([Item.of(processedItems.dust, oreToDustMultiplier), Item.of(processedItems.dust).withChance(0.33), Item.of("minecraft:cobblestone").withChance(0.15)], `#forge:ores/${name}`)
								.energy(2400)
								.id(`${global.EE_PACKID}:enderio/sag_milling/${name}_ore`);

						if (mat.baseItem == "gem")
							e.recipes.enderio
								.sag_milling(["2x " + processedItems.gem, Item.of(processedItems.gem).withChance(0.25), Item.of("minecraft:cobblestone").withChance(0.15)], `#forge:ores/${name}`)
								.energy(2400)
								.id(`${global.EE_PACKID}:enderio/sag_milling/${name}_ore`);
					}
				}
			}

			if (loadedMods.mekanism) {
				if (!blacklist.mekanism.crusher.includes(name))
					e.custom({
						type: "mekanism:crushing",
						input: { ingredient: { tag: `forge:${mat.baseItem}s/${name}` } },
						output: Item.of(processedItems.dust).toJson(),
					}).id(`${global.EE_PACKID}:mekanism/crushing/${name}_${mat.baseItem}`);
			}

			if (loadedMods.thermalfoundation) {
				if (!blacklist.thermal.pulverizer.includes(name)) {
					if (checkedTypes.ore && mat.baseItem == "ingot") {
						e.custom(
							Thermal.pulverizer([Item.of(processedItems.dust).withChance(2 * oreToDustMultiplier), Item.of("minecraft:gravel").withChance(0.2)], `#forge:ores/${name}`)
								.xp(0.2)
								.energy(4000)
						).id(`${global.EE_PACKID}:thermal/pulverizer/${name}_ore`);
					}
					if (checkedTypes.ore && mat.baseItem == "gem" && checkedTypes.gem) {
						e.custom(
							Thermal.pulverizer([Item.of(processedItems.gem).withChance(2), Item.of("minecraft:gravel").withChance(0.2)], `#forge:ores/${name}`)
								.xp(0.2)
								.energy(4000)
						).id(`${global.EE_PACKID}:thermal/pulverizer/${name}_ore`);
					}
					if (checkedTypes.raw) {
						e.custom(Thermal.pulverizer(Item.of(processedItems.dust).withChance(1.25), `#forge:raw_materials/${name}`).xp(0.1).energy(4000)).id(`${global.EE_PACKID}:thermal/pulverizer/raw_${name}`);
					}
					if (checkedTypes.ingot) {
						e.custom(Thermal.pulverizer(processedItems.dust, `#forge:ingots/${name}`).energy(2000)).id(`${global.EE_PACKID}:thermal/pulverizer/${name}_ingot`);
					}
					if (checkedTypes.plate) {
						e.custom(Thermal.pulverizer(processedItems.dust, `#forge:plates/${name}`).energy(2000)).id(`${global.EE_PACKID}:thermal/pulverizer/${name}_plate`);
					}
					if (checkedTypes.gem) {
						e.custom(Thermal.pulverizer(processedItems.dust, `#forge:gems/${name}`).energy(2000)).id(`${global.EE_PACKID}:thermal/pulverizer/${name}_gem`);
					}
				}
			}
			if (loadedMods.occultism) {
				if (blacklist.occultism.includes(name)) return;
				if (checkedTypes.ingot) {
					e.recipes.occultism.crushing(processedItems.dust, `#forge:ingots/${name}`).id(`${global.EE_PACKID}:occultism/crushing/${name}_ingot`);
				}
				if (checkedTypes.gem) {
					e.recipes.occultism.crushing(processedItems.dust, `#forge:gems/${name}`).id(`${global.EE_PACKID}:occultism/crushing/${name}_gem`);
				}
				if (checkedTypes.raw) {
					e.recipes.occultism.crushing(`2x ${processedItems.dust}`, `#forge:raw_materials/${name}`).id(`${global.EE_PACKID}:occultism/crushing/${name}_raw`);
				}
				if (checkedTypes.rawBlock) {
					e.recipes.occultism.crushing(`18x ${processedItems.dust}`, `#forge:storage_blocks/raw_${name}`).id(`${global.EE_PACKID}:occultism/crushing/${name}_raw_block`);
				}
				if (checkedTypes.ore) {
					e.recipes.occultism.crushing(`4x ${processedItems.dust}`, `#forge:ores/${name}`).id(`${global.EE_PACKID}:occultism/crushing/${name}_ore`);
				}
			}
		}
	);
});
