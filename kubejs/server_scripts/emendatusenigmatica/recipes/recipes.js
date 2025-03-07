// priority: 95

/**
 * @param {boolean} boolean
 */
let recipesSwich = {
	create: true,
	cca: true, // Create Crafts & Additions
	thermal: true,
	mekanism: true,
	immersiveengineering: true, // Immersive Engineering
	bloodmagic: true,
	enderio: true,
	adastra: true,
	integrateddynamics: true, // Integrated Dynamics
};

ServerEvents.recipes((e) => {
	/**
	 *
	 * @param {boolean} small
	 * @param {Internal.Item_ | string} item1
	 * @param {Internal.TagEntry | string} tag1
	 * @param {Internal.Item_ | string} item2
	 * @param {Internal.TagEntry | string} tag2
	 */
	let compactRecipe = (small, item1, tag1, item2, tag2) => {
		let resultId = item1.split(":")[1];
		let inputId = item2.split(":")[1];
		if (small) {
			e.shaped(item1, ["ii", "ii"], { i: tag2 }).id(`${global.EE_PACKID}:${resultId}_from_${inputId}`);
			e.shapeless(`4x ${item2}`, tag1).id(`${global.EE_PACKID}:${inputId}_from_${resultId}`);
		} else {
			e.shaped(item1, ["iii", "iii", "iii"], { i: tag2 }).id(`${global.EE_PACKID}:${resultId}_from_${inputId}`);
			e.shapeless(`9x ${item2}`, tag1).id(`${global.EE_PACKID}:${inputId}_from_${resultId}`);
		}
	};

	/**
	 *
	 * @param {string[] | string} outputs
	 * @param {Internal.Ingredient} input
	 */

	let blacklist = {
		create: ["iron", "gold", "copper", "zinc", "osmium", "tin", "lead", "uranium"],
		thermal: {
			press: ["iron", "gold", "copper", "netherite", "nickel", "silver", "tin", "lead", "bronze", "electrum", "invar", "constantan", "signalum", "lumium", "enderium", "coal_coke"],
		},
		immersiveengineering: {
			metalPress: ["iron", "copper", "gold", "osmium", "lead", "nickel", "silver", "tin", "uranium", "zinc", "electrum", "invar", "constantan", "bronze", "brass"],
			hammerCraft: ["desh", "ostrum", "calorite", "iron", "copper", "gold", "aluminum", "lead", "nickel", "silver", "uranium", "electrum", "constantan", "steel"],
			hammerCrushing: ["iron", "copper", "gold", "aluminum", "osmium", "lead", "nickel", "silver", "tin", "uranium", "zinc"],
			crusher: ["copper", "aluminum", "lead", "silver", "nickel", "uranium", "constantan", "electrum", "steel", "iron", "gold", "osmium", "tin", "zinc", "silver", "coal_coke", "invar", "bronze", "brass", "fluorite"],
		},
	};

	global.EE_MATERIALS.forEach(
		/**
		 * @param {EEConfig} mat
		 */
		(mat) => {
			/**
			 * @type {ProcessedType[]} types
			 */
			let types = mat.processedTypes;
			let isSmallBlock = mat.smallStorageBlock;
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
				gear: isIngredientExist(`#forge:gears/${name}`),
				rod: isIngredientExist(`#forge:rods/${name}`),
				plate: isIngredientExist(`#forge:plates/${name}`),
				coin: isIngredientExist(`forge:coins/${name}`),
			};
			let processedItems = {
				ingot: findIngredientItem(`#forge:ingots/${name}`, `${global.EE_PACKID}:${name}_ingot`),
				crushed: findIngredientItem(`#create:crushed_raw_materials/${name}`, `${global.EE_PACKID}:crushed_${name}`),
				nugget: findIngredientItem(`#forge:nuggets/${name}`, `${global.EE_PACKID}:${name}_nugget`),
				raw: findIngredientItem(`#forge:raw_materials/${name}`, `${global.EE_PACKID}:raw_${name}`),
				rawBlock: findIngredientItem(`#forge:storage_blocks/raw_${name}`, `${global.EE_PACKID}:raw_${name}_block`),
				gear: findIngredientItem(`#forge:gears/${name}`, `${global.EE_PACKID}:${name}_gear`),
				rod: findIngredientItem(`#forge:rods/${name}`, `${global.EE_PACKID}:${name}_rod`),
				plate: findIngredientItem(`#forge:plates/${name}`, `${global.EE_PACKID}:${name}_plate`),
				dust: findIngredientItem(`#forge:dusts/${name}`, `${global.EE_PACKID}:${name}_dust`),
			};

			console.log(`Registering recipes for: ${name}`);

			if (types.includes("nugget") && types.includes("ingot")) {
				compactRecipe(false, `${global.EE_PACKID}:${name}_ingot`, `#forge:ingots/${name}`, `${global.EE_PACKID}:${name}_nugget`, `#forge:nuggets/${name}`);
			}
			if (isIngredientExist(`#forge:ingots/${name}`)) {
				if (isIngredientExist(`#forge:nuggets/${name}`) && loadedMods.thermalfoundation) {
					if (recipesSwich.thermal && blacklist.thermal.press.includes(name) == false) {
						e.recipes.thermal.press(processedItems.ingot, [`9x #forge:nuggets/${name}`, "thermal:press_packing_3x3_die"], 0, 400).id(`${global.EE_PACKID}:thermal/press/packing3x3/${name}_ingot_3x3_packing`);
						e.recipes.thermal.press(`9x ${processedItems.nugget}`, [`#forge:ingots/${name}`, "thermal:press_packing_3x3_die"], 0, 400).id(`${global.EE_PACKID}:thermal/press/unpacking/${name}_ingot_unpacking`);
					}
				}

				if (types.includes("storage_block")) {
					compactRecipe(isSmallBlock, `${global.EE_PACKID}:${name}_block`, `#forge:storage_blocks/${name}`, `${global.EE_PACKID}:${name}_ingot`, `#forge:ingots/${name}`);
					if (loadedMods.thermalfoundation && recipesSwich.thermal && blacklist.thermal.press.includes(name) == false) {
						e.recipes.thermal
							.press(`${global.EE_PACKID}:${name}_block`, [`9x #forge:ingots/${name}`, "thermal:press_packing_3x3_die"], 0, 400)
							.id(`${global.EE_PACKID}:thermal/press/packing3x3/${name}_block_3x3_packing`);
					}
				}
				if (types.includes("ore")) {
					e.recipes.minecraft.smelting(processedItems.ingot, `#forge:ores/${name}`).xp(0.7).id(`${global.EE_PACKID}:minecraft/smelting/${name}_ingot_from_ore`);
					e.recipes.minecraft.blasting(processedItems.ingot, `#forge:ores/${name}`).xp(0.7).id(`${global.EE_PACKID}:minecraft/blasting/${name}_ingot_from_ore`);
					if (loadedMods.thermalfoundation) {
						if (recipesSwich.thermal && blacklist.thermal.press.includes(name) == false) {
							e.recipes.thermal.smelter(processedItems.ingot, `#forge:ores/${name}`, 0.5, 3200).id(`${global.EE_PACKID}:thermal/smelter/smelter_${name}_ore`);
						}
					}
				}
				if (types.includes("raw")) {
					e.recipes.minecraft.smelting(processedItems.ingot, `#forge:raw_materials/${name}`).xp(0.7).id(`${global.EE_PACKID}:minecraft/smelting/${name}_ingot_from_raw`);
					e.recipes.minecraft.blasting(processedItems.ingot, `#forge:raw_materials/${name}`).xp(0.7).id(`${global.EE_PACKID}:minecraft/blasting/${name}_ingot_from_raw`);
					if (loadedMods.thermalfoundation) {
						if (blacklist.thermal.press.includes(name) == false) {
							e.recipes.thermal.smelter(processedItems.ingot, `#forge:raw_materials/${name}`, 0.5, 3200).id(`${global.EE_PACKID}:thermal/smelter/smelter_${name}_raw`);
						}
					}
				}
				if (isIngredientExist(`#forge:dusts/${name}`)) {
					e.recipes.minecraft.smelting(processedItems.ingot, `#forge:dusts/${name}`).xp(0.7).id(`${global.EE_PACKID}:minecraft/smelting/${name}_ingot_from_dust`);
					e.recipes.minecraft.blasting(processedItems.ingot, `#forge:dusts/${name}`).xp(0.7).id(`${global.EE_PACKID}:minecraft/blasting/${name}_ingot_from_dust`);
				}
				if (loadedMods.thermalfoundation && recipesSwich.thermal && blacklist.thermal.press.includes(name) == false) {
					e.recipes.thermal.smelter(processedItems.ingot, `#forge:dusts/${name}`, 0, 1600).id(`${global.EE_PACKID}:thermal/smelter/smelter_${name}_dust`);
				}
			}
			if (checkedTypes.raw) {
				if (checkedTypes.rawBlock) {
					compactRecipe(false, processedItems.rawBlock, `#forge:storage_blocks/raw_${name}`, processedItems.raw, `#forge:raw_materials/${name}`);
					if (loadedMods.thermalfoundation && recipesSwich.thermal && blacklist.thermal.press.includes(name) == false) {
						e.recipes.thermal.press(processedItems.rawBlock, [`9x #forge:raw_materials/${name}`, "thermal:press_packing_3x3_die"], 0, 400).id(`${global.EE_PACKID}:thermal/press/packing3x3/raw_${name}_block_3x3_packing`);
						e.recipes.thermal.press(processedItems.raw, [`#forge:storage_blocks/raw_${name}`, "thermal:press_unpacking_die"], 0, 400).id(`${global.EE_PACKID}:thermal/press/unpacking/raw_${name}_block_unpacking`);
					}
				}
				if (recipesSwich.integrateddynamics && checkedTypes.ore && loadedMods.integrateddynamics) {
					if (!["copper", "iron", "gold"].includes(name)) {
						e.custom({
							type: "integrateddynamics:mechanical_squeezer",
							item: { tag: `forge:ores/${name}` },
							result: {
								items: [{ item: { item: processedItems.raw, count: 3 } }, { item: { item: processedItems.raw, count: 2 }, chance: 0.5 }, { item: { item: processedItems.raw, count: 2 }, chance: 0.5 }],
							},
							duration: 40,
						});
						e.custom({
							type: "integrateddynamics:squeezer",
							item: { tag: `forge:ores/${name}` },
							result: { items: [{ item: { item: processedItems.raw, count: 2 } }, { item: processedItems.raw, chance: 0.75 }] },
							duration: 40,
						});
					}
				}
			}
			if (types.includes("gem") && types.includes("storage_block")) {
				compactRecipe(isSmallBlock, `${global.EE_PACKID}:${name}_block`, `#forge:storage_blocks/${name}`, `${global.EE_PACKID}:${name}_gem`, `#forge:gems/${name}`);
				if (loadedMods.thermalfoundation && recipesSwich.thermal && blacklist.thermal.press.includes(name) == false) {
					e.recipes.thermal.press(`${global.EE_PACKID}:${name}_block`, [`9x #forge:gems/${name}`, "thermal:press_packing_3x3_die"], 0, 400).id(`${global.EE_PACKID}:thermal/press/packing3x3/${name}_block_3x3_packing`);
					e.recipes.thermal.press(`9x ${global.EE_PACKID}:${name}_gem`, [`#forge:storage_blocks/${name}`, "thermal:press_unpacking_die"], 0, 400).id(`${global.EE_PACKID}:thermal/press/unpacking/${name}_block_unpacking`);
				}
			}
			if (checkedTypes.gem) {
				// Immersive Engineering
				if (recipesSwich.immersiveengineering && checkedTypes.ore && !blacklist.immersiveengineering.crusher.includes(name) && loadedMods.immersiveengineering) {
					e.recipes.immersiveengineering.crusher(`2x #forge:gems/${name}`, `#forge:ores/${name}`).id(`${global.EE_PACKID}:immersiveengineering/crusher/${name}_ore`);
				}
			}
			if (checkedTypes.gear) {
				if (types.includes("ingot") || mat.type == "alloy" || mat.type == "metal" || mat.baseItem == "ingot")
					e.shaped(processedItems.gear, [" i ", "ini", " i "], {
						i: `#forge:ingots/${name}`,
						n: "#forge:nuggets/iron",
					}).id(`${global.EE_PACKID}:${name}_gear`);
				else if (types.includes("gem") || mat.type == "gem" || mat.baseItem == "gem")
					e.shaped(processedItems.gear, [" i ", "ini", " i "], {
						i: `#forge:gems/${name}`,
						n: "#forge:nuggets/iron",
					}).id(`${global.EE_PACKID}:${name}_gear`);
				if (recipesSwich.immersiveengineering && loadedMods.immersiveengineering && !blacklist.immersiveengineering.metalPress.includes(name))
					e.recipes.immersiveengineering.metal_press(`#forge:gears/${name}`, `4x #forge:${mat.baseItem}s/${name}`, ImmersiveEngineering.MOLDS.GEAR).id(`${global.EE_PACKID}:immersiveengineering/metal_press/${name}_gear`);
			}
			if (checkedTypes.rod) {
				if (checkedTypes.ingot) {
					e.shaped(`2x ${processedItems.rod}`, ["i", "i"], {
						i: `#forge:ingots/${name}`,
					}).id(`${global.EE_PACKID}:${name}_rod`);
					if (recipesSwich.cca && loadedMods.createadditions) {
						e.custom({
							type: "createaddition:rolling",
							input: {
								tag: `forge:ingots/${name}`,
							},
							result: {
								item: processedItems.rod,
								count: 2,
							},
						}).id(`${global.EE_PACKID}:cca/rolling/${name}_ingot`);
					}
				} else if (checkedTypes.gem) {
					e.shaped(`2x ${processedItems.rod}`, ["i", "i"], {
						i: `#forge:gems/${name}`,
					}).id(`${global.EE_PACKID}:${name}_rod`);
				}
				if (recipesSwich.immersiveengineering && loadedMods.immersiveengineering && !blacklist.immersiveengineering.metalPress.includes(name))
					e.recipes.immersiveengineering.metal_press(`2x #forge:rods/${name}`, `#forge:${mat.baseItem}s/${name}`, ImmersiveEngineering.MOLDS.ROD).id(`${global.EE_PACKID}:immersiveengineering/metal_press/${name}_rod`);
			}
			if (checkedTypes.plate) {
				if (recipesSwich.create && loadedMods.create) {
					e.recipes.create.pressing(processedItems.plate, `#forge:${mat.baseItem}s/${name}`).id(`${global.EE_PACKID}:create/pressing/${name}_plate`);
				}
				if (recipesSwich.immersiveengineering && loadedMods.immersiveengineering) {
					if (blacklist.immersiveengineering.metalPress.includes(name) == false) {
						e.recipes.immersiveengineering
							.metal_press(`#forge:plates/${name}`, `#forge:${mat.baseItem}s/${name}`, ImmersiveEngineering.MOLDS.PLATE)
							.id(`${global.EE_PACKID}:immersiveengineering/metal_press/${name}_plate`);
					}
					if (blacklist.immersiveengineering.hammerCraft.includes(name) == false) {
						e.recipes.minecraft.crafting_shapeless(processedItems.plate, [`#forge:${mat.baseItem}s/${name}`, "#immersiveengineering:tools/hammers"]).id(`${global.EE_PACKID}:minecraft/crafting/${name}_plate`);
					}
				}
				if (recipesSwich.thermal && loadedMods.thermalfoundation) {
					if (blacklist.thermal.press.includes(name) == false) {
						e.recipes.thermal.smelter(processedItems.ingot, processedItems.plate, 0, 1600).id(`${global.EE_PACKID}:thermal/smelter/smelter_${name}_plate`);
					}
				}
			}
			if (types.includes("mekanism") && recipesSwich.mekanism) {
				if (!loadedMods.mekanism) return;
				// console.log('- Mekanism')
				e.recipes.mekanism // crystal to shard
					.injecting(`${global.EE_PACKID}:${name}_shard`, `#mekanism:crystals/${name}`, (1, "mekanism:hydrogen_chloride"))
					.id(`${global.EE_PACKID}:mekanism/injecting/${name}_shard_from_crystal`);
				e.recipes.mekanism // shard to clump
					.purifying(`${global.EE_PACKID}:${name}_clump`, `#mekanism:shards/${name}`, (1, "mekanism:oxygen"))
					.id(`${global.EE_PACKID}:mekanism/puryfing/${name}_clump_from_shard`);
				e.recipes.mekanism // clumps to dirty_dust
					.crushing(`${global.EE_PACKID}:${name}_dirty_dust`, `#mekanism:clumps/${name}`)
					.id(`${global.EE_PACKID}:mekanism/puryfing/${name}_dirty_dust_from_clump`);
				e.recipes.mekanism // dirty_dusts to dust
					.enriching(`${global.EE_PACKID}:${name}_dust`, `#mekanism:dirty_dusts/${name}`)
					.id(`${global.EE_PACKID}:mekanism/enriching/${name}_dust_from_dirty_dust`);
				if (isIngredientExist(`#forge:raw_materials/${name}`)) {
					e.recipes.mekanism // raw to shard
						.injecting(`8x ${global.EE_PACKID}:${name}_shard`, `3x #forge:raw_materials/${name}`, (1, "mekanism:hydrogen_chloride"))
						.id(`${global.EE_PACKID}:mekanism/injecting/${name}_shard_from_raw_ore`);
					e.recipes.mekanism // raw_block to shard
						.injecting(`24x ${global.EE_PACKID}:${name}_shard`, `#forge:storage_blocks/raw_${name}`, (2, "mekanism:hydrogen_chloride"))
						.id(`${global.EE_PACKID}:mekanism/injecting/${name}_shard_from_raw_ore_block`);
					e.recipes.mekanism // raw to clump
						.purifying(`2x ${global.EE_PACKID}:${name}_clump`, `#forge:raw_materials/${name}`, (1, "mekanism:oxygen"))
						.id(`${global.EE_PACKID}:mekanism/puryfing/${name}_clump_from_raw_ore`);
					e.recipes.mekanism // raw_block to clump
						.purifying(`18x ${global.EE_PACKID}:${name}_clump`, `#forge:storage_blocks/raw_${name}`, (1, "mekanism:oxygen"))
						.id(`${global.EE_PACKID}:mekanism/puryfing/${name}_clump_from_raw_ore_block`);
					e.recipes.mekanism // raw to dust
						.enriching(`4x ${global.EE_PACKID}:${name}_dust`, Item.of(`#forge:raw_materials/${name}`, 3))
						.id(`${global.EE_PACKID}:mekanism/enriching/${name}_dust_from_raw_ore`);
					e.recipes.mekanism // raw_block to dust
						.enriching(`12x ${global.EE_PACKID}:${name}_dust`, `#forge:storage_blocks/raw_${name}`)
						.id(`${global.EE_PACKID}:mekanism/enriching/${name}_dust_from_raw_ore_block`);
				}
				if (isIngredientExist(`#forge:ores/${name}`)) {
					e.recipes.mekanism // raw to shard
						.injecting(`${4 * oreToDustMultiplier}x ${global.EE_PACKID}:${name}_shard`, `#forge:ores/${name}`, (1, "mekanism:hydrogen_chloride"))
						.id(`${global.EE_PACKID}:mekanism/injecting/${name}_shard_from_ore`);
					e.recipes.mekanism // raw to clump
						.purifying(`${3 * oreToDustMultiplier}x ${global.EE_PACKID}:${name}_clump`, `#forge:ores/${name}`, (1, "mekanism:oxygen"))
						.id(`${global.EE_PACKID}:mekanism/puryfing/${name}_clump_from_ore`);
					e.recipes.mekanism // raw to dust
						.enriching(Item.of(`${2 * oreToDustMultiplier}x ${processedItems.dust}`), `#forge:ores/${name}`)
						.id(`${global.EE_PACKID}:mekanism/enriching/${name}_dust_from_ore`);
				}
			}
			if (types.includes("bloodmagic") && recipesSwich.bloodmagic) {
				if (!loadedMods.bloodmagic) return;
				// console.log('- Blood Magic')
				if (isIngredientExist(`#forge:ores/${name}`)) {
					e.custom({
						type: "bloodmagic:arc",
						addedoutput: [
							{
								type: {
									item: `${global.EE_PACKID}:${name}_fragment`,
								},
								chance: 0.5,
								mainchance: 0.0,
							},
						],
						consumeingredient: false,
						input: {
							tag: `forge:ores/${name}`,
						},
						inputsize: 1,
						mainoutputchance: 0.0,
						output: {
							count: 4 * oreToDustMultiplier,
							item: `${global.EE_PACKID}:${name}_fragment`,
						},
						tool: {
							tag: "bloodmagic:arc/explosive",
						},
					}).id(`${global.EE_PACKID}:bloodmagic/arc/${name}_fragment_from_ore`);
				}
				if (isIngredientExist(`#forge:raw_materials/${name}`)) {
					e.custom({
						type: "bloodmagic:arc",
						addedoutput: [
							{
								type: {
									item: `${global.EE_PACKID}:${name}_fragment`,
								},
								chance: 0.25,
								mainchance: 0.0,
							},
						],
						consumeingredient: false,
						input: {
							tag: `forge:raw_materials/${name}`,
						},
						inputsize: 1,
						mainoutputchance: 0.0,
						output: {
							count: 2,
							item: `${global.EE_PACKID}:${name}_fragment`,
						},
						tool: {
							tag: "bloodmagic:arc/explosive",
						},
					}).id(`${global.EE_PACKID}:bloodmagic/arc/${name}_fragment_from_raw`);
				}
				e.custom({
					type: "bloodmagic:arc",
					addedoutput: [
						{
							type: {
								item: `bloodmagic:corrupted_tinydust`,
							},
							chance: 0.5,
							mainchance: 0.0,
						},
					],
					consumeingredient: false,
					input: {
						tag: `bloodmagic:fragments/${name}`,
					},
					inputsize: 1,
					mainoutputchance: 0.0,
					output: {
						item: `${global.EE_PACKID}:${name}_gravel`,
					},
					tool: {
						tag: "bloodmagic:arc/resonator",
					},
				}).id(`${global.EE_PACKID}:bloodmagic/arc/${name}_gravel`);
				e.recipes.bloodmagic
					.alchemytable(Item.of(`${global.EE_PACKID}:${name}_gravel`, 2), [`#bloodmagic:fragments/${name}`, "bloodmagic:corrupted_dust"])
					.syphon(100)
					.ticks(50)
					.upgradeLevel(3)
					.id(`${global.EE_PACKID}:bloodmagic/alchemytable/${name}_gravel`);
				e.custom({
					type: "bloodmagic:arc",
					consumeingredient: false,
					input: {
						tag: `bloodmagic:gravels/${name}`,
					},
					inputsize: 1,
					mainoutputchance: 0.0,
					output: {
						item: processedItems.dust,
					},
					tool: {
						tag: "bloodmagic:arc/cuttingfluid",
					},
				}).id(`${global.EE_PACKID}:bloodmagic/arc/${name}_dust_from_gravel`);
			}
			if (isIngredientExist(`#create:crushed_raw_materials/${name}`) && recipesSwich.create) {
				// console.log('- Create')
				if (blacklist.create.includes(name)) return;
				if (checkedTypes.ingot) {
					if (checkedTypes.ore) {
						e.recipes.create
							.crushing([`${oreToDustMultiplier} ${processedItems.crushed}`, `${processedItems.crushed} 0.75`, "create:experience_nugget 0.75"], `#forge:ores/${name}`)
							.id(`${global.EE_PACKID}:create/crushing/${name}_ore`);
					}
					if (checkedTypes.raw) {
						e.recipes.create.crushing([processedItems.crushed, "create:experience_nugget 0.75"], `#forge:raw_materials/${name}`).id(`${global.EE_PACKID}:create/crushing/${name}_raw_ore`);
						e.recipes.create.crushing([`9 ${processedItems.crushed}`, "9 create:experience_nugget 0.75"], `#forge:storage_blocks/raw_${name}`).id(`${global.EE_PACKID}:create/crushing/${name}_raw_ore_block`);
					}
					e.recipes.minecraft.smelting(processedItems.ingot, processedItems.crushed).xp(0.1).id(`${global.EE_PACKID}:minecraft/smelting/${name}_ingot_from_crushed`);
					e.recipes.minecraft.blasting(processedItems.ingot, processedItems.crushed).xp(0.1).id(`${global.EE_PACKID}:minecraft/blasting/${name}_ingot_from_crushed`);
					e.recipes.create.splashing([parseChanceItem(`9 ${processedItems.nugget}`)], [{ tag: `create:crushed_raw_materials/${name}` }]).id(`${global.EE_PACKID}:create/splashing/crushed_${name}`);
				}
			}
			if (types.includes("thermal") && recipesSwich.thermal) {
				if (blacklist.thermal.press.includes(name)) return;
				if (loadedMods.thermalfoundation) {
					e.recipes.thermal.press(`3x ${global.EE_PACKID}:${name}_coin`, [`#forge:ingots/${name}`, "thermal:press_coin_die"]).id(`${global.EE_PACKID}:thermal/press/${name}_coin_from_ingot`);
					e.recipes.thermal.press(`${global.EE_PACKID}:${name}_coin`, [`3x #forge:nuggets/${name}`, "thermal:press_coin_die"], 0, 800).id(`${global.EE_PACKID}:thermal/press/${name}_coin_from_nuggets`);
				}
			}
			if (types.includes("re:avaritia") && loadedMods.avaritia) {
				e.recipes.avaritia
					.compressor(`#forge:ingots/${name}`, Item.of("avaritia:singularity", `{Id:"avaritia:${name}"}`))
					.inputCount(1000)
					.timeCost(240);
			}
		}
	);
});
