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
	 * @param {string} itemStr
	 * @returns {string[]}
	 */
	let destructItem = (itemStr) => {
		if (itemStr.includes(" ")) {
			let splited = itemStr.split(" ");
			splited[0] = splited[0].replace("x", "");
			return splited.reverse();
		} else return [itemStr];
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
	let createCrushingRecipeJson = (outputs, input) => {
		let json = {
			type: "create:crushing",
			ingredients: [],
			processingTime: 400,
			results: [],
		};
		json.ingredients.push(Ingredient.of(input).toJson());
		if (Array.isArray(outputs)) {
			outputs.forEach((item) => json.results.push(parseChanceItem(item)));
		} else json.results.push(parseChanceItem(outputs));

		return json;
	};

	let blacklist = {
		create: ["iron", "gold", "copper", "zinc", "osmium", "tin", "lead", "uranium"],
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
				if (types.includes("storage_block")) {
					compactRecipe(
						isSmallBlock,
						`emendatusenigmatica:${name}_block`,
						`#forge:storage_blocks/${name}`,
						`emendatusenigmatica:${name}_ingot`,
						`#forge:ingots/${name}`
					);
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
			}
			if (checkedTypes.raw) {
				if (checkedTypes.rawBlock) {
					compactRecipe(false, processedItems.rawBlock, `#forge:storage_blocks/raw_${name}`, processedItems.raw, `#forge:raw_materials/${name}`);
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
			}
			if (checkedTypes.gem) {
				// Immersive Engineering
				if (checkedTypes.ore && !blacklist.immersiveengineering.crusher.includes(name)) {
					e.custom(ImmersiveEngineering.crusher(`2x #forge:gems/${name}`, `#forge:ores/${name}`, 6000)).id(
						`emendatusenigmatica:immersiveengineering/crusher/${name}_ore`
					);
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
						e.custom(
							ImmersiveEngineering.metalPress(`#forge:gears/${name}`, `4x #forge:${mat.baseItem}s/${name}`, ImmersiveEngineering.MOLDS.GEAR)
						).id(`emendatusenigmatica:immersiveengineering/metal_press/${name}_gear`);
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
						e.custom(ImmersiveEngineering.metalPress(`2x #forge:rods/${name}`, `#forge:${mat.baseItem}s/${name}`, ImmersiveEngineering.MOLDS.ROD)).id(
							`emendatusenigmatica:immersiveengineering/metal_press/${name}_rod`
						);
				}
			}
			if (checkedTypes.plate) {
				/**
				 * @todo Wait for KubeJS Create
				 */
				if (loadedMods.create) {
					e.custom({
						type: "create:pressing",
						ingredients: [
							{
								tag: `forge:${mat.baseItem}s/${name}`,
							},
						],
						results: [
							{
								item: processedItems.plate,
							},
						],
					}).id(`emendatusenigmatica:create/pressing/${name}_plate`);
				}
				if (loadedMods.immersiveengineering) {
					if (blacklist.immersiveengineering.metalPress.includes(name) == false) {
						e.custom(
							ImmersiveEngineering.metalPress(`#forge:plates/${name}`, `#forge:${mat.baseItem}s/${name}`, ImmersiveEngineering.MOLDS.PLATE)
						).id(`emendatusenigmatica:immersiveengineering/metal_press/${name}_plate`);
					}
					if (blacklist.immersiveengineering.hammerCraft.includes(name) == false) {
						e.recipes.minecraft
							.crafting_shapeless(processedItems.plate, [`#forge:${mat.baseItem}s/${name}`, "#immersiveengineering:tools/hammers"])
							.id(`emendatusenigmatica:minecraft/crafting/${name}_plate`);
					}
				}
			}
			if (types.includes("mekanism")) {
				// console.log('- Mekanism')
				/*
				 * @typedef {'mekanism:injecting' | 'mekanism:purifying'} MekanismReipeType
				 * @param {MekanismReipeType} type
				 * @param {string} gas
				 * @param {number} amount 1 = 200mb
				 * @param {string} ingredient
				 * @param {Internal.Item} output
				 * @returns
				 */
				let mekanismProcessRecipeJson = (type, gas, amount, ingredient, output) => ({
					type: type,
					chemicalInput: {
						amount: amount,
						gas: gas,
					},
					itemInput: {
						amount: parseInt(destructItem(ingredient)[1]) || 1,
						ingredient: Ingredient.of(destructItem(ingredient)[0]).toJson(),
					},
					output: Item.of(output).toJson(),
				});

				e.custom(
					mekanismProcessRecipeJson(
						"mekanism:injecting",
						"mekanism:hydrogen_chloride",
						1,
						`#mekanism:crystals/${name}`,
						`emendatusenigmatica:${name}_shard`
					)
				).id(`emendatusenigmatica:mekanism/injecting/${name}_shard_from_crystal`);
				e.custom(
					mekanismProcessRecipeJson("mekanism:purifying", "mekanism:oxygen", 1, `#mekanism:shards/${name}`, `emendatusenigmatica:${name}_clump`)
				).id(`emendatusenigmatica:mekanism/puryfing/${name}_clump_from_shard`);
				e.custom({
					type: "mekanism:crushing",
					input: { ingredient: { tag: `mekanism:clumps/${name}` } },
					output: Item.of(`emendatusenigmatica:${name}_dirty_dust`).toJson(),
				}).id(`emendatusenigmatica:mekanism/puryfing/${name}_dirty_dust_from_clump`);
				e.custom({
					type: "mekanism:enriching",
					input: { ingredient: { tag: `mekanism:dirty_dusts/${name}` } },
					output: Item.of(processedItems.dust).toJson(),
				}).id(`emendatusenigmatica:mekanism/enriching/${name}_dust_from_dirty_dust`);
				if (isIngredientExist(`#forge:raw_materials/${name}`)) {
					e.custom(
						mekanismProcessRecipeJson(
							"mekanism:injecting",
							"mekanism:hydrogen_chloride",
							1,
							`3x #forge:raw_materials/${name}`,
							`8x emendatusenigmatica:${name}_shard`
						)
					).id(`emendatusenigmatica:mekanism/injecting/${name}_shard_from_raw_ore`);
					e.custom(
						mekanismProcessRecipeJson(
							"mekanism:injecting",
							"mekanism:hydrogen_chloride",
							2,
							`#forge:storage_blocks/raw_${name}`,
							`24x emendatusenigmatica:${name}_shard`
						)
					).id(`emendatusenigmatica:mekanism/injecting/${name}_shard_from_raw_ore_block`);
					e.custom(
						mekanismProcessRecipeJson(
							"mekanism:purifying",
							"mekanism:oxygen",
							1,
							`#forge:raw_materials/${name}`,
							`2x emendatusenigmatica:${name}_clump`
						)
					).id(`emendatusenigmatica:mekanism/puryfing/${name}_clump_from_raw_ore`);
					e.custom(
						mekanismProcessRecipeJson(
							"mekanism:purifying",
							"mekanism:oxygen",
							1,
							`#forge:storage_blocks/raw_${name}`,
							`18x emendatusenigmatica:${name}_clump`
						)
					).id(`emendatusenigmatica:mekanism/puryfing/${name}_clump_from_raw_ore_block`);
					e.custom({
						type: "mekanism:enriching",
						input: {
							ingredient: { tag: `forge:raw_materials/${name}` },
							amount: 3,
						},
						output: Item.of(`4x ${processedItems.dust}`).toJson(),
					}).id(`emendatusenigmatica:mekanism/enriching/${name}_dust_from_raw_ore`);
					e.custom({
						type: "mekanism:enriching",
						input: { ingredient: { tag: `forge:storage_blocks/raw_${name}` } },
						output: Item.of(`12x ${processedItems.dust}`).toJson(),
					}).id(`emendatusenigmatica:mekanism/enriching/${name}_dust_from_raw_ore_block`);
				}
				if (isIngredientExist(`#forge:ores/${name}`)) {
					e.custom(
						mekanismProcessRecipeJson(
							"mekanism:injecting",
							"mekanism:hydrogen_chloride",
							1,
							`#forge:ores/${name}`,
							`${4 * oreToDustMultiplier}x emendatusenigmatica:${name}_shard`
						)
					).id(`emendatusenigmatica:mekanism/injecting/${name}_shard_from_ore`);
					e.custom(
						mekanismProcessRecipeJson(
							"mekanism:purifying",
							"mekanism:oxygen",
							1,
							`#forge:ores/${name}`,
							`${3 * oreToDustMultiplier}x emendatusenigmatica:${name}_clump`
						)
					).id(`emendatusenigmatica:mekanism/puryfing/${name}_clump_from_ore`);
					e.custom({
						type: "mekanism:enriching",
						input: { ingredient: { tag: `forge:ores/${name}` } },
						output: Item.of(`${2 * oreToDustMultiplier}x ${processedItems.dust}`).toJson(),
					}).id(`emendatusenigmatica:mekanism/enriching/${name}_dust_from_ore`);
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
				e.custom({
					type: "bloodmagic:alchemytable",
					input: [
						{
							tag: `bloodmagic:fragments/${name}`,
						},
						{
							item: "bloodmagic:corrupted_dust",
						},
					],
					output: {
						count: 2,
						item: `emendatusenigmatica:${name}_gravel`,
					},
					syphon: 100,
					ticks: 50,
					upgradeLevel: 3,
				}).id(`emendatusenigmatica:bloodmagic/alchemytable/${name}_gravel`);
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
						e.custom(
							createCrushingRecipeJson(
								[`${oreToDustMultiplier} ${processedItems.crushed}`, `${processedItems.crushed} 0.75`, "create:experience_nugget 0.75"],
								`#forge:ores/${name}`
							)
						).id(`emendatusenigmatica:create/crushing/${name}_ore`);
					}
					if (checkedTypes.raw) {
						e.custom(createCrushingRecipeJson([processedItems.crushed, "create:experience_nugget 0.75"], `#forge:raw_materials/${name}`)).id(
							`emendatusenigmatica:create/crushing/${name}_raw_ore`
						);
						e.custom(
							createCrushingRecipeJson([`9 ${processedItems.crushed}`, "9 create:experience_nugget 0.75"], `#forge:storage_blocks/raw_${name}`)
						).id(`emendatusenigmatica:create/crushing/${name}_raw_ore_block`);
					}
					e.recipes.minecraft
						.smelting(processedItems.ingot, processedItems.crushed)
						.xp(0.1)
						.id(`emendatusenigmatica:minecraft/smelting/${name}_ingot_from_crushed`);
					e.recipes.minecraft
						.blasting(processedItems.ingot, processedItems.crushed)
						.xp(0.1)
						.id(`emendatusenigmatica:minecraft/blasting/${name}_ingot_from_crushed`);
					e.custom({
						type: "create:splashing",
						ingredients: [{ tag: `create:crushed_raw_materials/${name}` }],
						results: [parseChanceItem(`9 ${processedItems.nugget}`)],
					}).id(`emendatusenigmatica:create/splashing/crushed_${name}`);
				}
			}
		}
	);
});
