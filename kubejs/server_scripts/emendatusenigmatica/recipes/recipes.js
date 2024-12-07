// priority: 5

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

/**
 *
 * @param {string} tag
 * @param {string} item
 * @returns
 */
let findIngredientItem = (tag, item) => (isIngredientExist(tag, item) ? item : Ingredient.of(tag).getItemIds()[0]);

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
			e.shaped(item1, ["ii", "ii"], { i: tag2 }).id(`emendatusenigmatica:${resultId}_from_${inputId}`);
			e.shapeless(`4x ${item2}`, tag1).id(`emendatusenigmatica:${inputId}_from_${resultId}`);
		} else {
			e.shaped(item1, ["iii", "iii", "iii"], { i: tag2 }).id(`emendatusenigmatica:${resultId}_from_${inputId}`);
			e.shapeless(`9x ${item2}`, tag1).id(`emendatusenigmatica:${inputId}_from_${resultId}`);
		}
	};

	/**
	 *
	 * @param {string} itemstr Example: '2 minecraft:apple 0.75'
	 */
	let parseChanceItem = (itemstr) => {
		let out = {
			item: "",
			count: 1,
			chance: 1.0,
		};
		if (itemstr.includes(" ")) {
			let splited = itemstr.split(" ");
			if (isNaN(parseInt(splited[0]))) {
				out.item = splited[0];
				out.chance = parseFloat(splited[1]);
			} else if (isNaN(parseFloat(splited[1])) && splited.length == 3) {
				out.item = splited[1];
				out.chance = parseFloat(splited[2]);
				out.count = parseInt(splited[0]);
			} else {
				out.item = splited[1];
				out.count = parseInt(splited[0]);
			}
		} else out.item = itemstr;

		return out;
	};

	/**
	 *
	 * @param {string[] | string} outputs
	 * @param {Internal.Ingredient} input
	 */

	let blacklist = {
		create: ["iron", "gold", "copper", "zinc", "osmium", "tin", "lead", "uranium"],
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
				"bronze",
				"electrum",
				"invar",
				"constantan",
				"signalum",
				"lumium",
				"enderium",
				"coal_coke",
			],
		},
		immersiveengineering: {
			metalPress: [
				"iron",
				"copper",
				"gold",
				"osmium",
				"lead",
				"nickel",
				"silver",
				"tin",
				"uranium",
				"zinc",
				"electrum",
				"invar",
				"constantan",
				"bronze",
				"brass",
			],
			hammerCraft: [
				"desh",
				"ostrum",
				"calorite",
				"iron",
				"copper",
				"gold",
				"aluminum",
				"lead",
				"nickel",
				"silver",
				"uranium",
				"electrum",
				"constantan",
				"steel",
			],
			hammerCrushing: ["iron", "copper", "gold", "aluminum", "osmium", "lead", "nickel", "silver", "tin", "uranium", "zinc"],
			crusher: [
				"copper",
				"aluminum",
				"lead",
				"silver",
				"nickel",
				"uranium",
				"constantan",
				"electrum",
				"steel",
				"iron",
				"gold",
				"osmium",
				"tin",
				"zinc",
				"silver",
				"coal_coke",
				"invar",
				"bronze",
				"brass",
				"fluorite",
			],
		},
	};

	let loadedMods = {
		create: Platform.isLoaded("create"),
		createadditions: Platform.isLoaded("createaddition"),
		immersiveengineering: Platform.isLoaded("immersiveengineering"),
		thermalfoundation: Platform.isLoaded("thermal_foundation"),
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
				ingot: findIngredientItem(`#forge:ingots/${name}`, `emendatusenigmatica:${name}_ingot`),
				crushed: findIngredientItem(`#create:crushed_raw_materials/${name}`, `emendatusenigmatica:crushed_${name}`),
				nugget: findIngredientItem(`#forge:nuggets/${name}`, `emendatusenigmatica:${name}_nugget`),
				raw: findIngredientItem(`#forge:raw_materials/${name}`, `emendatusenigmatica:raw_${name}`),
				rawBlock: findIngredientItem(`#forge:storage_blocks/raw_${name}`, `emendatusenigmatica:raw_${name}_block`),
				gear: findIngredientItem(`#forge:gears/${name}`, `emendatusenigmatica:${name}_gear`),
				rod: findIngredientItem(`#forge:rods/${name}`, `emendatusenigmatica:${name}_rod`),
				plate: findIngredientItem(`#forge:plates/${name}`, `emendatusenigmatica:${name}_plate`),
				dust: findIngredientItem(`#forge:dusts/${name}`, `emendatusenigmatica:${name}_dust`),
			};

			console.log(`Registering recipes for: ${name}`);

			if (types.includes("nugget") && types.includes("ingot")) {
				compactRecipe(
					false,
					`emendatusenigmatica:${name}_ingot`,
					`#forge:ingots/${name}`,
					`emendatusenigmatica:${name}_nugget`,
					`#forge:nuggets/${name}`
				);
			}
			if (isIngredientExist(`#forge:ingots/${name}`)) {
				if (isIngredientExist(`#forge:nuggets/${name}`) && loadedMods.thermalfoundation) {
					if (blacklist.thermal.press.includes(name) == false) {
						e.recipes.thermal
							.press(processedItems.ingot, [`9x #forge:nuggets/${name}`, "thermal:press_packing_3x3_die"], 0, 400)
							.id(`emendatusenigmatica:thermal/press/packing3x3/${name}_ingot_3x3_packing`);
						e.recipes.thermal
							.press(`9x ${processedItems.nugget}`, [`#forge:ingots/${name}`, "thermal:press_packing_3x3_die"], 0, 400)
							.id(`emendatusenigmatica:thermal/press/unpacking/${name}_ingot_unpacking`);
					}
				}

				if (types.includes("storage_block")) {
					compactRecipe(
						isSmallBlock,
						`emendatusenigmatica:${name}_block`,
						`#forge:storage_blocks/${name}`,
						`emendatusenigmatica:${name}_ingot`,
						`#forge:ingots/${name}`
					);
					if (loadedMods.thermalfoundation) {
						if (blacklist.thermal.press.includes(name) == false) {
							e.recipes.thermal
								.press(`emendatusenigmatica:${name}_block`, [`9x #forge:ingots/${name}`, "thermal:press_packing_3x3_die"], 0, 400)
								.id(`emendatusenigmatica:thermal/press/packing3x3/${name}_block_3x3_packing`);
						}
					}
				}
				if (types.includes("ore")) {
					e.recipes.minecraft
						.smelting(processedItems.ingot, `#forge:ores/${name}`)
						.xp(0.7)
						.id(`emendatusenigmatica:minecraft/smelting/${name}_ingot_from_ore`);
					e.recipes.minecraft
						.blasting(processedItems.ingot, `#forge:ores/${name}`)
						.xp(0.7)
						.id(`emendatusenigmatica:minecraft/blasting/${name}_ingot_from_ore`);
					if (loadedMods.thermalfoundation) {
						if (blacklist.thermal.press.includes(name) == false) {
							e.recipes.thermal
								.smelter(processedItems.ingot, `#forge:ores/${name}`, 0.5, 3200)
								.id(`emendatusenigmatica:thermal/smelter/smelter_${name}_ore`);
						}
					}
				}
				if (types.includes("raw")) {
					e.recipes.minecraft
						.smelting(processedItems.ingot, `#forge:raw_materials/${name}`)
						.xp(0.7)
						.id(`emendatusenigmatica:minecraft/smelting/${name}_ingot_from_raw`);
					e.recipes.minecraft
						.blasting(processedItems.ingot, `#forge:raw_materials/${name}`)
						.xp(0.7)
						.id(`emendatusenigmatica:minecraft/blasting/${name}_ingot_from_raw`);
					if (loadedMods.thermalfoundation) {
						if (blacklist.thermal.press.includes(name) == false) {
							e.recipes.thermal
								.smelter(processedItems.ingot, `#forge:raw_materials/${name}`, 0.5, 3200)
								.id(`emendatusenigmatica:thermal/smelter/smelter_${name}_raw`);
						}
					}
				}
				if (isIngredientExist(`#forge:dusts/${name}`)) {
					e.recipes.minecraft
						.smelting(processedItems.ingot, `#forge:dusts/${name}`)
						.xp(0.7)
						.id(`emendatusenigmatica:minecraft/smelting/${name}_ingot_from_dust`);
					e.recipes.minecraft
						.blasting(processedItems.ingot, `#forge:dusts/${name}`)
						.xp(0.7)
						.id(`emendatusenigmatica:minecraft/blasting/${name}_ingot_from_dust`);
				}
				if (loadedMods.thermalfoundation) {
					if (blacklist.thermal.press.includes(name) == false) {
						e.recipes.thermal
							.smelter(processedItems.ingot, `#forge:dusts/${name}`, 0, 1600)
							.id(`emendatusenigmatica:thermal/smelter/smelter_${name}_dust`);
					}
				}
			}
			if (checkedTypes.raw) {
				if (checkedTypes.rawBlock) {
					compactRecipe(
						false,
						processedItems.rawBlock,
						`#forge:storage_blocks/raw_${name}`,
						processedItems.raw,
						`#forge:raw_materials/${name}`
					);
					if (loadedMods.thermalfoundation) {
						if (blacklist.thermal.press.includes(name) == false) {
							e.recipes.thermal
								.press(processedItems.rawBlock, [`9x #forge:raw_materials/${name}`, "thermal:press_packing_3x3_die"], 0, 400)
								.id(`emendatusenigmatica:thermal/press/packing3x3/raw_${name}_block_3x3_packing`);
							e.recipes.thermal
								.press(processedItems.raw, [`#forge:storage_blocks/raw_${name}`, "thermal:press_unpacking_die"], 0, 400)
								.id(`emendatusenigmatica:thermal/press/unpacking/raw_${name}_block_unpacking`);
						}
					}
				}
				if (checkedTypes.ore && Platform.isLoaded("integrateddynamics")) {
					if (!["copper", "iron", "gold"].includes(name)) {
						e.custom({
							type: "integrateddynamics:mechanical_squeezer",
							item: {
								tag: `forge:ores/${name}`,
							},
							result: {
								items: [
									{
										item: {
											item: processedItems.raw,
											count: 3,
										},
									},
									{
										item: {
											item: processedItems.raw,
											count: 2,
										},
										chance: 0.5,
									},
									{
										item: {
											item: processedItems.raw,
											count: 2,
										},
										chance: 0.5,
									},
								],
							},
							duration: 40,
						});
						e.custom({
							type: "integrateddynamics:squeezer",
							item: {
								tag: `forge:ores/${name}`,
							},
							result: {
								items: [
									{
										item: {
											item: processedItems.raw,
											count: 2,
										},
									},
									{
										item: processedItems.raw,
										chance: 0.75,
									},
								],
							},
							duration: 40,
						});
					}
				}
			}
			if (types.includes("gem") && types.includes("storage_block")) {
				compactRecipe(
					isSmallBlock,
					`emendatusenigmatica:${name}_block`,
					`#forge:storage_blocks/${name}`,
					`emendatusenigmatica:${name}_gem`,
					`#forge:gems/${name}`
				);
				if (loadedMods.thermalfoundation) {
					if (blacklist.thermal.press.includes(name) == false) {
						e.recipes.thermal
							.press(`emendatusenigmatica:${name}_block`, [`9x #forge:gems/${name}`, "thermal:press_packing_3x3_die"], 0, 400)
							.id(`emendatusenigmatica:thermal/press/packing3x3/${name}_block_3x3_packing`);
						e.recipes.thermal
							.press(`9x emendatusenigmatica:${name}_gem`, [`#forge:storage_blocks/${name}`, "thermal:press_unpacking_die"], 0, 400)
							.id(`emendatusenigmatica:thermal/press/unpacking/${name}_block_unpacking`);
					}
				}
			}
			if (checkedTypes.gem) {
				// Immersive Engineering
				if (checkedTypes.ore && !blacklist.immersiveengineering.crusher.includes(name)) {
					e.recipes.immersiveengineering
						.crusher(`2x #forge:gems/${name}`, `#forge:ores/${name}`)
						.id(`emendatusenigmatica:immersiveengineering/crusher/${name}_ore`);
				}
			}
			if (checkedTypes.gear) {
				if (types.includes("ingot") || mat.type == "alloy" || mat.type == "metal" || mat.baseItem == "ingot")
					e.shaped(processedItems.gear, [" i ", "ini", " i "], {
						i: `#forge:ingots/${name}`,
						n: "#forge:nuggets/iron",
					}).id(`emendatusenigmatica:${name}_gear`);
				else if (types.includes("gem") || mat.type == "gem" || mat.baseItem == "gem")
					e.shaped(processedItems.gear, [" i ", "ini", " i "], {
						i: `#forge:gems/${name}`,
						n: "#forge:nuggets/iron",
					}).id(`emendatusenigmatica:${name}_gear`);

				if (loadedMods.immersiveengineering) {
					if (!blacklist.immersiveengineering.metalPress.includes(name))
						e.recipes.immersiveengineering
							.metal_press(`#forge:gears/${name}`, `4x #forge:${mat.baseItem}s/${name}`, ImmersiveEngineering.MOLDS.GEAR)
							.id(`emendatusenigmatica:immersiveengineering/metal_press/${name}_gear`);
				}
			}
			if (checkedTypes.rod) {
				if (checkedTypes.ingot) {
					e.shaped(`2x ${processedItems.rod}`, ["i", "i"], {
						i: `#forge:ingots/${name}`,
					}).id(`emendatusenigmatica:${name}_rod`);
					if (loadedMods.createadditions) {
						e.custom({
							type: "createaddition:rolling",
							input: {
								tag: `forge:ingots/${name}`,
							},
							result: {
								item: processedItems.rod,
								count: 2,
							},
						}).id(`emendatusenigmatica:createaddition/rolling/${name}_ingot`);
					}
				} else if (checkedTypes.gem) {
					e.shaped(`2x ${processedItems.rod}`, ["i", "i"], {
						i: `#forge:gems/${name}`,
					}).id(`emendatusenigmatica:${name}_rod`);
				}

				if (loadedMods.immersiveengineering) {
					if (!blacklist.immersiveengineering.metalPress.includes(name))
						e.recipes.immersiveengineering
							.metal_press(`2x #forge:rods/${name}`, `#forge:${mat.baseItem}s/${name}`, ImmersiveEngineering.MOLDS.ROD)
							.id(`emendatusenigmatica:immersiveengineering/metal_press/${name}_rod`);
				}
			}
			if (checkedTypes.plate) {
				if (loadedMods.create) {
					e.recipes.create
						.pressing(processedItems.plate, `#forge:${mat.baseItem}s/${name}`)
						.id(`emendatusenigmatica:create/pressing/${name}_plate`);
				}
				if (loadedMods.immersiveengineering) {
					if (blacklist.immersiveengineering.metalPress.includes(name) == false) {
						e.recipes.immersiveengineering
							.metal_press(`#forge:plates/${name}`, `#forge:${mat.baseItem}s/${name}`, ImmersiveEngineering.MOLDS.PLATE)
							.id(`emendatusenigmatica:immersiveengineering/metal_press/${name}_plate`);
					}
					if (blacklist.immersiveengineering.hammerCraft.includes(name) == false) {
						e.recipes.minecraft
							.crafting_shapeless(processedItems.plate, [`#forge:${mat.baseItem}s/${name}`, "#immersiveengineering:tools/hammers"])
							.id(`emendatusenigmatica:minecraft/crafting/${name}_plate`);
					}
				}
				if (loadedMods.thermalfoundation) {
					if (blacklist.thermal.press.includes(name) == false) {
						e.recipes.thermal
							.smelter(processedItems.ingot, processedItems.plate, 0, 1600)
							.id(`emendatusenigmatica:thermal/smelter/smelter_${name}_plate`);
					}
				}
			}
			if (types.includes("mekanism")) {
				// console.log('- Mekanism')
				e.recipes.mekanism // crystal to shard
					.injecting(`emendatusenigmatica:${name}_shard`, `#mekanism:crystals/${name}`, (1, "mekanism:hydrogen_chloride"))
					.id(`emendatusenigmatica:mekanism/injecting/${name}_shard_from_crystal`);
				e.recipes.mekanism // shard to clump
					.purifying(`emendatusenigmatica:${name}_clump`, `#mekanism:shards/${name}`, (1, "mekanism:oxygen"))
					.id(`emendatusenigmatica:mekanism/puryfing/${name}_clump_from_shard`);
				e.recipes.mekanism // clumps to dirty_dust
					.crushing(`emendatusenigmatica:${name}_dirty_dust`, `#mekanism:clumps/${name}`)
					.id(`emendatusenigmatica:mekanism/puryfing/${name}_dirty_dust_from_clump`);
				e.recipes.mekanism // dirty_dusts to dust
					.enriching(`emendatusenigmatica:${name}_dust`, `#mekanism:dirty_dusts/${name}`)
					.id(`emendatusenigmatica:mekanism/enriching/${name}_dust_from_dirty_dust`);
				if (isIngredientExist(`#forge:raw_materials/${name}`)) {
					e.recipes.mekanism // raw to shard
						.injecting(`8x emendatusenigmatica:${name}_shard`, `3x #forge:raw_materials/${name}`, (1, "mekanism:hydrogen_chloride"))
						.id(`emendatusenigmatica:mekanism/injecting/${name}_shard_from_raw_ore`);
					e.recipes.mekanism // raw_block to shard
						.injecting(`24x emendatusenigmatica:${name}_shard`, `#forge:storage_blocks/raw_${name}`, (2, "mekanism:hydrogen_chloride"))
						.id(`emendatusenigmatica:mekanism/injecting/${name}_shard_from_raw_ore_block`);
					e.recipes.mekanism // raw to clump
						.purifying(`2x emendatusenigmatica:${name}_clump`, `#forge:raw_materials/${name}`, (1, "mekanism:oxygen"))
						.id(`emendatusenigmatica:mekanism/puryfing/${name}_clump_from_raw_ore`);
					e.recipes.mekanism // raw_block to clump
						.purifying(`18x emendatusenigmatica:${name}_clump`, `#forge:storage_blocks/raw_${name}`, (1, "mekanism:oxygen"))
						.id(`emendatusenigmatica:mekanism/puryfing/${name}_clump_from_raw_ore_block`);
					e.recipes.mekanism // raw to dust
						.enriching(`4x emendatusenigmatica:${name}_dust`, Item.of(`#forge:raw_materials/${name}`, 3))
						.id(`emendatusenigmatica:mekanism/enriching/${name}_dust_from_raw_ore`);
					e.recipes.mekanism // raw_block to dust
						.enriching(`12x emendatusenigmatica:${name}_dust`, `#forge:storage_blocks/raw_${name}`)
						.id(`emendatusenigmatica:mekanism/enriching/${name}_dust_from_raw_ore_block`);
				}
				if (isIngredientExist(`#forge:ores/${name}`)) {
					e.recipes.mekanism // raw to shard
						.injecting(
							`${4 * oreToDustMultiplier}x emendatusenigmatica:${name}_shard`,
							`#forge:ores/${name}`,
							(1, "mekanism:hydrogen_chloride")
						)
						.id(`emendatusenigmatica:mekanism/injecting/${name}_shard_from_ore`);
					e.recipes.mekanism // raw to clump
						.purifying(`${3 * oreToDustMultiplier}x emendatusenigmatica:${name}_clump`, `#forge:ores/${name}`, (1, "mekanism:oxygen"))
						.id(`emendatusenigmatica:mekanism/puryfing/${name}_clump_from_ore`);
					e.recipes.mekanism // raw to dust
						.enriching(Item.of(`${2 * oreToDustMultiplier}x ${processedItems.dust}`), `#forge:ores/${name}`)
						.id(`emendatusenigmatica:mekanism/enriching/${name}_dust_from_ore`);
				}
			}
			if (types.includes("bloodmagic")) {
				// console.log('- Blood Magic')
				if (isIngredientExist(`#forge:ores/${name}`)) {
					e.custom({
						type: "bloodmagic:arc",
						addedoutput: [
							{
								type: {
									item: `emendatusenigmatica:${name}_fragment`,
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
							item: `emendatusenigmatica:${name}_fragment`,
						},
						tool: {
							tag: "bloodmagic:arc/explosive",
						},
					}).id(`emendatusenigmatica:bloodmagic/arc/${name}_fragment_from_ore`);
				}
				if (isIngredientExist(`#forge:raw_materials/${name}`)) {
					e.custom({
						type: "bloodmagic:arc",
						addedoutput: [
							{
								type: {
									item: `emendatusenigmatica:${name}_fragment`,
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
							item: `emendatusenigmatica:${name}_fragment`,
						},
						tool: {
							tag: "bloodmagic:arc/explosive",
						},
					}).id(`emendatusenigmatica:bloodmagic/arc/${name}_fragment_from_raw`);
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
						item: `emendatusenigmatica:${name}_gravel`,
					},
					tool: {
						tag: "bloodmagic:arc/resonator",
					},
				}).id(`emendatusenigmatica:bloodmagic/arc/${name}_gravel`);
				e.recipes.bloodmagic
					.alchemytable(Item.of(`emendatusenigmatica:${name}_gravel`, 2), [
						`#bloodmagic:fragments/${name}`,
						"bloodmagic:corrupted_dust",
					])
					.syphon(100)
					.ticks(50)
					.upgradeLevel(3)
					.id(`emendatusenigmatica:bloodmagic/alchemytable/${name}_gravel`);
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
				}).id(`emendatusenigmatica:bloodmagic/arc/${name}_dust_from_gravel`);
			}
			if (isIngredientExist(`#create:crushed_raw_materials/${name}`)) {
				// console.log('- Create')
				if (blacklist.create.includes(name)) return;
				if (checkedTypes.ingot) {
					if (checkedTypes.ore) {
						e.recipes.create
							.crushing(
								[
									`${oreToDustMultiplier} ${processedItems.crushed}`,
									`${processedItems.crushed} 0.75`,
									"create:experience_nugget 0.75",
								],
								`#forge:ores/${name}`
							)
							.id(`emendatusenigmatica:create/crushing/${name}_ore`);
					}
					if (checkedTypes.raw) {
						e.recipes.create
							.crushing([processedItems.crushed, "create:experience_nugget 0.75"], `#forge:raw_materials/${name}`)
							.id(`emendatusenigmatica:create/crushing/${name}_raw_ore`);
						e.recipes.create
							.crushing([`9 ${processedItems.crushed}`, "9 create:experience_nugget 0.75"], `#forge:storage_blocks/raw_${name}`)
							.id(`emendatusenigmatica:create/crushing/${name}_raw_ore_block`);
					}
					e.recipes.minecraft
						.smelting(processedItems.ingot, processedItems.crushed)
						.xp(0.1)
						.id(`emendatusenigmatica:minecraft/smelting/${name}_ingot_from_crushed`);
					e.recipes.minecraft
						.blasting(processedItems.ingot, processedItems.crushed)
						.xp(0.1)
						.id(`emendatusenigmatica:minecraft/blasting/${name}_ingot_from_crushed`);
					e.recipes.create
						.splashing([parseChanceItem(`9 ${processedItems.nugget}`)], [{ tag: `create:crushed_raw_materials/${name}` }])
						.id(`emendatusenigmatica:create/splashing/crushed_${name}`);
				}
			}
			if (types.includes("thermal")) {
				if (blacklist.thermal.press.includes(name)) return;
				if (loadedMods.thermalfoundation) {
					e.recipes.thermal
						.press(`3x emendatusenigmatica:${name}_coin`, [`#forge:ingots/${name}`, "thermal:press_coin_die"])
						.id(`emendatusenigmatica:thermal/press/${name}_coin_from_ingot`);
					e.recipes.thermal
						.press(`emendatusenigmatica:${name}_coin`, [`3x #forge:nuggets/${name}`, "thermal:press_coin_die"], 0, 800)
						.id(`emendatusenigmatica:thermal/press/${name}_coin_from_nuggets`);
				}
			}
		}
	);
});

ServerEvents.recipes((event) => {
	// remove if mod loaded
	const LoadedMOD = {
		create: Platform.isLoaded("create"),
		mekanism: Platform.isLoaded("mekanism"),
		embers: Platform.isLoaded("embers"),
		immersiveengineering: Platform.isLoaded("immersiveengineering"),
		thermalfoundation: Platform.isLoaded("thermal_foundation"),
	};

	if (LoadedMOD.embers) {
		let recipeIdRemove = [
			[`embers:lead_block_to_ingot`],
			[`embers:lead_nugget_to_ingot`],
			[`embers:lead_ingot_from_blasting_lead_ore`],
			[`embers:lead_ingot_from_blasting_deepslate_lead_ore`],
			[`embers:lead_ingot_from_blasting_raw_lead`],
			[`embers:lead_ingot_from_smelting_deepslate_lead_ore`],
			[`embers:lead_ingot_from_smelting_lead_ore`],
			[`embers:lead_ingot_from_smelting_raw_lead`],
			[`embers:silver_nugget_to_ingot`],
			[`embers:silver_raw_to_raw_block`],
			[`embers:lead_raw_to_raw_block`],
			[`embers:silver_ingot_from_blasting_deepslate_silver_ore`],
			[`embers:silver_ingot_from_blasting_silver_ore`],
			[`embers:silver_ingot_from_blasting_raw_silver`],
			[`embers:silver_ingot_from_smelting_raw_silver`],
			[`embers:silver_ingot_from_smelting_deepslate_silver_ore`],
			[`embers:silver_ingot_from_smelting_silver_ore`],
			[`embers:silver_block_to_ingot`],
			[`embers:silver_raw_block_to_raw`],
			[`embers:silver_ingot_to_block`],
			[`embers:lead_ingot_to_block`],
			[`embers:lead_raw_block_to_raw`],
			[`embers:lead_ingot_to_nugget`],
			[`embers:silver_ingot_to_nugget`],
		];
		recipeIdRemove.forEach(([recipeId]) => {
			event.remove({ id: recipeId });
		});
	}

	if (LoadedMOD.mekanism) {
		let recipeIdRemove = [
			["mekanism:storage_blocks/bronze"],
			["mekanism:storage_blocks/steel"],
			[`mekanism:processing/tin/ingot/from_ore_blasting`],
			[`mekanism:processing/tin/ingot/from_ore_smelting`],
			[`mekanism:processing/tin/ingot/from_raw_blasting`],
			[`mekanism:processing/tin/ingot/from_raw_smelting`],
			[`mekanism:processing/tin/ingot/from_dust_blasting`],
			[`mekanism:processing/tin/ingot/from_nuggets`],
			[`mekanism:processing/tin/ingot/from_block`],
			[`mekanism:processing/tin/ingot/from_dust_smelting`],
			[`mekanism:processing/tin/ingot/from_ore_smelting`],
			[`mekanism:processing/tin/storage_blocks/from_ingots`],
			[`mekanism:processing/uranium/ingot/from_ore_blasting`],
			[`mekanism:processing/uranium/ingot/from_ore_smelting`],
			[`mekanism:processing/uranium/ingot/from_raw_blasting`],
			[`mekanism:processing/uranium/ingot/from_raw_smelting`],
			[`mekanism:processing/uranium/ingot/from_dust_blasting`],
			[`mekanism:processing/uranium/ingot/from_nuggets`],
			[`mekanism:processing/uranium/ingot/from_block`],
			[`mekanism:processing/uranium/ingot/from_dust_smelting`],
			[`mekanism:processing/uranium/ingot/from_ore_smelting`],
			[`mekanism:processing/uranium/storage_blocks/from_ingots`],
			[`mekanism:processing/osmium/ingot/from_ore_blasting`],
			[`mekanism:processing/osmium/ingot/from_ore_smelting`],
			[`mekanism:processing/osmium/ingot/from_raw_blasting`],
			[`mekanism:processing/osmium/ingot/from_raw_smelting`],
			[`mekanism:processing/osmium/ingot/from_dust_blasting`],
			[`mekanism:processing/osmium/ingot/from_nuggets`],
			[`mekanism:processing/osmium/ingot/from_block`],
			[`mekanism:processing/osmium/ingot/from_dust_smelting`],
			[`mekanism:processing/osmium/ingot/from_ore_smelting`],
			[`mekanism:processing/osmium/storage_blocks/from_ingots`],
			[`mekanism:processing/lead/ingot/from_ore_blasting`],
			[`mekanism:processing/lead/ingot/from_ore_smelting`],
			[`mekanism:processing/lead/ingot/from_raw_blasting`],
			[`mekanism:processing/lead/ingot/from_raw_smelting`],
			[`mekanism:processing/lead/ingot/from_dust_blasting`],
			[`mekanism:processing/lead/ingot/from_nuggets`],
			[`mekanism:processing/lead/ingot/from_block`],
			[`mekanism:processing/lead/ingot/from_dust_smelting`],
			[`mekanism:processing/lead/ingot/from_ore_smelting`],
			[`mekanism:processing/lead/storage_blocks/from_ingots`],
			[`mekanism:processing/osmium/raw_storage_blocks/from_raw`],
			[`mekanism:processing/tin/raw_storage_blocks/from_raw`],
			[`mekanism:processing/lead/raw_storage_blocks/from_raw`],
			[`mekanism:storage_blocks/fluorite`],
			[`mekanism:processing/bronze/ingot/from_dust_smelting`],
			[`mekanism:processing/bronze/ingot/from_dust_blasting`],
			[`mekanism:processing/steel/ingot/from_dust_blasting`],
			[`mekanism:processing/steel/ingot/from_dust_smelting`],
		];
		recipeIdRemove.forEach(([recipeId]) => {
			event.remove({ id: recipeId });
		});
	}

	if (LoadedMOD.create) {
		let recipeIdRemove = [
			[`create:crafting/materials/raw_zinc`],
			[`create:crafting/materials/zinc_ingot_from_compacting`],
			[`create:crafting/materials/zinc_ingot_from_decompacting`],
			[`create:blasting/zinc_ingot_from_raw_ore`],
			[`create:blasting/zinc_ingot_from_ore`],
			[`create:smelting/zinc_ingot_from_ore`],
			[`create:smelting/zinc_ingot_from_raw_ore`],
			[`create:crafting/materials/copper_nugget`],
			[`create:crafting/materials/zinc_nugget_from_decompacting`],
			[`create:crafting/materials/brass_nugget_from_decompacting`],
			[`create:pressing/copper_ingot`],
			[`create:pressing/brass_ingot`],
			[`create:pressing/iron_ingot`],
			[`create:pressing/gold_ingot`],
		];
		recipeIdRemove.forEach(([removeRecipeId]) => {
			event.remove({ id: removeRecipeId });
		});
	}

	if (LoadedMOD.immersiveengineering) {
		let recipeIdRemove = [
			[`immersiveengineering:crafting/copper_ingot_to_nugget_copper`],
			[`immersiveengineering:crafting/nugget_aluminum_to_ingot_aluminum`],
			[`immersiveengineering:crafting/storage_aluminum_to_ingot_aluminum`],
			[`immersiveengineering:smelting/ingot_aluminum_from_blasting`],
			[`immersiveengineering:smelting/ingot_aluminum_from_blasting2`],
			[`immersiveengineering:smelting/ingot_aluminum_from_blasting3`],
			[`immersiveengineering:smelting/ingot_aluminum3`],
			[`immersiveengineering:smelting/ingot_aluminum2`],
			[`immersiveengineering:smelting/ingot_aluminum`],
			[`immersiveengineering:smelting/ingot_aluminum_from_dust_from_blasting`],
			[`immersiveengineering:smelting/ingot_aluminum_from_dust`],
			[`immersiveengineering:crafting/ingot_aluminum_to_nugget_aluminum`],
			[`immersiveengineering:crafting/raw_block_aluminum_to_raw_aluminum`],
			[`immersiveengineering:crafting/storage_lead_to_ingot_lead`],
			[`immersiveengineering:crafting/nugget_lead_to_ingot_lead`],
			[`immersiveengineering:smelting/ingot_lead_from_blasting3`],
			[`immersiveengineering:smelting/ingot_lead_from_blasting2`],
			[`immersiveengineering:smelting/ingot_lead_from_blasting`],
			[`immersiveengineering:smelting/ingot_lead3`],
			[`immersiveengineering:smelting/ingot_lead2`],
			[`immersiveengineering:smelting/ingot_lead`],
			[`immersiveengineering:crafting/raw_block_lead_to_raw_lead`],
			[`immersiveengineering:smelting/ingot_lead_from_dust`],
			[`immersiveengineering:crafting/nugget_silver_to_ingot_silver`],
			[`immersiveengineering:crafting/storage_silver_to_ingot_silver`],
			[`immersiveengineering:smelting/ingot_silver_from_dust_from_blasting`],
			[`immersiveengineering:smelting/ingot_silver_from_blasting3`],
			[`immersiveengineering:smelting/ingot_silver_from_blasting`],
			[`immersiveengineering:smelting/ingot_silver_from_blasting2`],
			[`immersiveengineering:smelting/ingot_silver_from_dust`],
			[`immersiveengineering:smelting/ingot_silver`],
			[`immersiveengineering:smelting/ingot_silver3`],
			[`immersiveengineering:smelting/ingot_silver2`],
			[`immersiveengineering:crafting/raw_block_silver_to_raw_silver`],
			[`immersiveengineering:crafting/nugget_nickel_to_ingot_nickel`],
			[`immersiveengineering:crafting/storage_nickel_to_ingot_nickel`],
			[`immersiveengineering:smelting/ingot_nickel_from_blasting`],
			[`immersiveengineering:smelting/ingot_nickel_from_dust_from_blasting`],
			[`immersiveengineering:smelting/ingot_nickel_from_blasting2`],
			[`immersiveengineering:smelting/ingot_nickel_from_blasting3`],
			[`immersiveengineering:smelting/ingot_nickel`],
			[`immersiveengineering:smelting/ingot_nickel2`],
			[`immersiveengineering:smelting/ingot_nickel3`],
			[`immersiveengineering:smelting/ingot_nickel_from_dust`],
			[`immersiveengineering:crafting/ingot_nickel_to_nugget_nickel`],
			[`immersiveengineering:crafting/raw_block_nickel_to_raw_nickel`],
			[`immersiveengineering:crafting/storage_uranium_to_ingot_uranium`],
			[`immersiveengineering:crafting/nugget_uranium_to_ingot_uranium`],
			[`immersiveengineering:smelting/ingot_uranium_from_blasting`],
			[`immersiveengineering:smelting/ingot_uranium_from_blasting3`],
			[`immersiveengineering:smelting/ingot_uranium_from_blasting2`],
			[`immersiveengineering:smelting/ingot_uranium_from_dust_from_blasting`],
			[`immersiveengineering:smelting/ingot_uranium`],
			[`immersiveengineering:smelting/ingot_uranium_from_dust`],
			[`immersiveengineering:smelting/ingot_uranium3`],
			[`immersiveengineering:smelting/ingot_uranium2`],
			[`immersiveengineering:crafting/ingot_uranium_to_nugget_uranium`],
			[`immersiveengineering:crafting/raw_block_uranium_to_raw_uranium`],
			[`immersiveengineering:crafting/storage_constantan_to_ingot_constantan`],
			[`immersiveengineering:crafting/nugget_constantan_to_ingot_constantan`],
			[`immersiveengineering:smelting/ingot_constantan_from_dust_from_blasting`],
			[`immersiveengineering:smelting/ingot_constantan_from_dust`],
			[`immersiveengineering:crafting/ingot_constantan_to_nugget_constantan`],
			[`immersiveengineering:crafting/nugget_electrum_to_ingot_electrum`],
			[`immersiveengineering:crafting/storage_electrum_to_ingot_electrum`],
			[`immersiveengineering:smelting/ingot_electrum_from_dust_from_blasting`],
			[`immersiveengineering:smelting/ingot_electrum_from_dust`],
			[`immersiveengineering:crafting/ingot_electrum_to_nugget_electrum`],
			[`immersiveengineering:crafting/storage_steel_to_ingot_steel`],
			[`immersiveengineering:crafting/nugget_steel_to_ingot_steel`],
			[`immersiveengineering:smelting/ingot_steel_from_dust_from_blasting`],
			[`immersiveengineering:smelting/ingot_steel_from_dust`],
			[`immersiveengineering:crafting/ingot_steel_to_nugget_steel`],
			[`immersiveengineering:crafting/raw_aluminum_to_raw_block_aluminum`],
			[`immersiveengineering:crafting/ingot_aluminum_to_storage_aluminum`],
			[`immersiveengineering:crafting/raw_lead_to_raw_block_lead`],
			[`immersiveengineering:crafting/ingot_lead_to_storage_lead`],
			[`immersiveengineering:crafting/raw_silver_to_raw_block_silver`],
			[`immersiveengineering:crafting/ingot_silver_to_storage_silver`],
			[`immersiveengineering:crafting/raw_nickel_to_raw_block_nickel`],
			[`immersiveengineering:crafting/ingot_nickel_to_storage_nickel`],
			[`immersiveengineering:crafting/raw_uranium_to_raw_block_uranium`],
			[`immersiveengineering:crafting/ingot_uranium_to_storage_uranium`],
			[`immersiveengineering:crafting/ingot_constantan_to_storage_constantan`],
			[`immersiveengineering:crafting/ingot_electrum_to_storage_electrum`],
			[`immersiveengineering:crafting/ingot_steel_to_storage_steel`],
			[`immersiveengineering:crafting/coal_coke_to_coke`],
		];
		recipeIdRemove.forEach(([removeRecipeId]) => {
			event.remove({ id: removeRecipeId });
		});
	}

	if (LoadedMOD.thermalfoundation) {
		let recipeIdRemove = [
			[`thermal:storage/niter_block`],
			[`thermal:storage/sulfur_block`],
			[`thermal:storage/coal_coke_block`],
			[`thermal:storage/raw_tin_block`],
			[`thermal:storage/raw_lead_block`],
			[`thermal:storage/raw_silver_block`],
			[`thermal:storage/raw_nickel_block`],
			[`thermal:storage/tin_block`],
			[`thermal:storage/lead_block`],
			[`thermal:storage/silver_block`],
			[`thermal:storage/nickel_block`],
			[`thermal:storage/bronze_block`],
			[`thermal:storage/electrum_block`],
			[`thermal:storage/invar_block`],
			[`thermal:storage/constantan_block`],
			[`thermal:storage/signalum_block`],
			[`thermal:storage/lumium_block`],
			[`thermal:storage/enderium_block`],
			[`thermal:storage/niter_from_block`],
			[`thermal:storage/sulfur_from_block`],
			[`thermal:storage/coal_coke_from_block`],
			[`thermal:storage/copper_nugget_from_ingot`],
			[`thermal:storage/netherite_nugget_from_ingot`],
			[`thermal:storage/raw_tin_from_block`],
			[`thermal:storage/tin_ingot_from_block`],
			[`thermal:storage/tin_ingot_from_nuggets`],
			[`thermal:smelting/tin_ingot_from_deepslate_ore_blasting`],
			[`thermal:smelting/tin_ingot_from_raw_blasting`],
			[`thermal:smelting/tin_ingot_from_dust_blasting`],
			[`thermal:smelting/tin_ingot_from_ore_blasting`],
			[`thermal:smelting/tin_ingot_from_raw_smelting`],
			[`thermal:smelting/tin_ingot_from_dust_smelting`],
			[`thermal:smelting/tin_ingot_from_deepslate_ore_smelting`],
			[`thermal:smelting/tin_ingot_from_ore_smelting`],
			[`thermal:storage/tin_nugget_from_ingot`],
			[`thermal:storage/raw_lead_from_block`],
			[`thermal:storage/lead_ingot_from_block`],
			[`thermal:storage/lead_ingot_from_nuggets`],
			[`thermal:smelting/lead_ingot_from_ore_blasting`],
			[`thermal:smelting/lead_ingot_from_dust_blasting`],
			[`thermal:smelting/lead_ingot_from_raw_blasting`],
			[`thermal:smelting/lead_ingot_from_deepslate_ore_blasting`],
			[`thermal:smelting/lead_ingot_from_deepslate_ore_smelting`],
			[`thermal:smelting/lead_ingot_from_raw_smelting`],
			[`thermal:smelting/lead_ingot_from_ore_smelting`],
			[`thermal:smelting/lead_ingot_from_dust_smelting`],
			[`thermal:storage/lead_nugget_from_ingot`],
			[`thermal:storage/raw_silver_from_block`],
			[`thermal:storage/silver_ingot_from_block`],
			[`thermal:storage/silver_ingot_from_nuggets`],
			[`thermal:smelting/silver_ingot_from_dust_blasting`],
			[`thermal:smelting/silver_ingot_from_ore_blasting`],
			[`thermal:smelting/silver_ingot_from_raw_blasting`],
			[`thermal:smelting/silver_ingot_from_deepslate_ore_blasting`],
			[`thermal:smelting/silver_ingot_from_ore_smelting`],
			[`thermal:smelting/silver_ingot_from_raw_smelting`],
			[`thermal:smelting/silver_ingot_from_deepslate_ore_smelting`],
			[`thermal:smelting/silver_ingot_from_dust_smelting`],
			[`thermal:storage/silver_nugget_from_ingot`],
			[`thermal:storage/raw_nickel_from_block`],
			[`thermal:storage/nickel_ingot_from_block`],
			[`thermal:storage/nickel_ingot_from_nuggets`],
			[`thermal:smelting/nickel_ingot_from_ore_blasting`],
			[`thermal:smelting/nickel_ingot_from_deepslate_ore_blasting`],
			[`thermal:smelting/nickel_ingot_from_raw_blasting`],
			[`thermal:smelting/nickel_ingot_from_dust_blasting`],
			[`thermal:smelting/nickel_ingot_from_raw_smelting`],
			[`thermal:smelting/nickel_ingot_from_ore_smelting`],
			[`thermal:smelting/nickel_ingot_from_deepslate_ore_smelting`],
			[`thermal:smelting/nickel_ingot_from_dust_smelting`],
			[`thermal:storage/nickel_nugget_from_ingot`],
			[`thermal:storage/bronze_ingot_from_nuggets`],
			[`thermal:storage/bronze_ingot_from_block`],
			[`thermal:smelting/bronze_ingot_from_dust_blasting`],
			[`thermal:smelting/bronze_ingot_from_dust_smelting`],
			[`thermal:storage/bronze_nugget_from_ingot`],
			[`thermal:storage/electrum_ingot_from_nuggets`],
			[`thermal:storage/electrum_ingot_from_block`],
			[`thermal:smelting/electrum_ingot_from_dust_blasting`],
			[`thermal:smelting/electrum_ingot_from_dust_smelting`],
			[`thermal:storage/invar_ingot_from_nuggets`],
			[`thermal:storage/invar_ingot_from_block`],
			[`thermal:smelting/invar_ingot_from_dust_blasting`],
			[`thermal:smelting/invar_ingot_from_dust_smelting`],
			[`thermal:storage/invar_nugget_from_ingot`],
			[`thermal:storage/constantan_ingot_from_nuggets`],
			[`thermal:storage/constantan_ingot_from_block`],
			[`thermal:smelting/constantan_ingot_from_dust_blasting`],
			[`thermal:smelting/constantan_ingot_from_dust_smelting`],
			[`thermal:storage/constantan_nugget_from_ingot`],
			[`thermal:storage/signalum_ingot_from_nuggets`],
			[`thermal:storage/signalum_ingot_from_block`],
			[`thermal:smelting/signalum_ingot_from_dust_blasting`],
			[`thermal:smelting/signalum_ingot_from_dust_smelting`],
			[`thermal:storage/signalum_nugget_from_ingot`],
			[`thermal:storage/lumium_ingot_from_block`],
			[`thermal:storage/lumium_ingot_from_nuggets`],
			[`thermal:smelting/lumium_ingot_from_dust_blasting`],
			[`thermal:smelting/lumium_ingot_from_dust_smelting`],
			[`thermal:storage/lumium_nugget_from_ingot`],
			[`thermal:storage/enderium_ingot_from_nuggets`],
			[`thermal:storage/enderium_ingot_from_block`],
			[`thermal:smelting/enderium_ingot_from_dust_blasting`],
			[`thermal:smelting/enderium_ingot_from_dust_smelting`],
			[`thermal:storage/enderium_nugget_from_ingot`],
		];
		recipeIdRemove.forEach(([removeRecipeId]) => {
			event.remove({ id: removeRecipeId });
		});
	}
});

ServerEvents.tags("item", (event) => {
	let itemTagsAdd = [
		["forge:gems", ["thermal:coal_coke", "immersiveengineering:coal_coke"]],
		["forge:gems/coal_coke", ["thermal:coal_coke", "immersiveengineering:coal_coke"]],
		["forge:coal_coke", "emendatusenigmatica:coal_coke_gem"],
		["minecraft:coals", "emendatusenigmatica:coal_coke_gem"],
	];
	itemTagsAdd.forEach(([itemTags, items]) => {
		event.add(itemTags, [items]);
	});
});
