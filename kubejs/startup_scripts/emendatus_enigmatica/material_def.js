// priority: 298

let commonStratas = ["stone", "deepslate", "netherrack", "end_stone", "andesite", "diorite", "granite"];
let vanillaComplementStratas = ["netherrack", "end_stone", "andesite", "diorite", "granite"];
let glodStratas = ["andesite", "diorite", "granite", "end_stone"];
/**
 * @type {EEConfig[]}
 */
const EE_MATERIALS = [
	// Vanilla
	// Coal
	{
		name: "coal",
		type: "dust",
		baseItem: "dust",
		processedTypes: ["dust"],
		color: ["#393e46", "#2e2e2e", "#261e24", "#1f1721", "#1c1c1e"],
		burnTime: 1600,
	},
	// Iron
	{
		name: "iron",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "dust", "gear", "plate", "rod"],
		color: ["#ffffff", "#c9c9c9", "#828282", "#5e5e5e", "#353535"],
		strata: vanillaComplementStratas,
		drop: {
			item: "minecraft:raw_iron",
			min: 1,
			max: 1,
		},
		harvestLevel: "stone",
	},
	// Copper
	{
		name: "copper",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "nugget", "dust", "gear", "plate", "rod"],
		color: ["#f7e6b7", "#f8b18d", "#cc6d51", "#a1383f", "#781c22"],
		strata: vanillaComplementStratas,
		drop: {
			item: "minecraft:raw_copper",
			min: 2,
			max: 5,
		},
		harvestLevel: "stone",
	},
	// Gold
	{
		name: "gold",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "dust", "gear", "plate", "rod"],
		color: ["#ffffff", "#fcf8a7", "#fad64a", "#dc9613", "#b26411"],
		strata: glodStratas,
		drop: {
			item: "minecraft:raw_gold",
			min: 1,
			max: 1,
		},
		harvestLevel: "iron",
	},
	// Netherite
	{
		name: "netherite",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["nugget", "dust", "gear", "plate", "rod", "embers"],
		color: ["#737173", "#4d494d", "#443d3f", "#31292a", "#271c1d"],
	},
	// Diamond
	{
		name: "diamond",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["ore", "dust", "gear", "plate", "rod"],
		color: ["#f2fffc", "#a1fbe8", "#20c5b5", "#1aaaa7", "#1c919a"],
		strata: vanillaComplementStratas,
		drop: {
			item: "minecraft:diamond",
			min: 1,
			max: 1,
		},
		harvestLevel: "iron",
	},
	// Emerald
	{
		name: "emerald",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["ore", "dust", "gear", "plate", "rod"],
		color: ["#e6fcee", "#41f384", "#00aa2c", "#009529", "#007b18"],
		strata: vanillaComplementStratas,
		drop: {
			item: "minecraft:emerald",
			min: 1,
			max: 1,
		},
		harvestLevel: "iron",
	},
	// Amethyst
	{
		name: "amethyst",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["dust", "gear", "plate", "rod"],
		color: ["#fcfad2", "#fbc9e3", "#b18cf0", "#8b69ca", "#6e4ea9"],
		smallStorageBlock: true,
	},
	// Quartz
	{
		name: "quartz",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["dust", "gear", "plate", "rod"],
		color: ["#ffffff", "#eae5de", "#d4caba", "#b6a48e", "#897b73"],
		smallStorageBlock: true,
	},
	// Lapis
	{
		name: "lapis",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["dust", "gear"],
		color: ["#9db5ed", "#5981e1", "#1d54a9", "#1f4294", "#173782"],
	},
	// Obsidian
	{
		name: "obsidian",
		type: "ingot",
		baseItem: "ingot",
		processedTypes: ["dust"],
		color: ["#4d336f", "#3a2753", "#271e3c", "#100c1c", "#000001"],
	},
	// Universal Modded Metals
	// Aluminum
	{
		name: "aluminum",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "raw", "ingot", "nugget", "dust", "plate", "gear", "rod", "storage_block", "bloodmagic", "thermal"],
		harvestLevel: "stone",
		strata: commonStratas,
		color: ["#f2fafc", "#dfedf2", "#c5dbed", "#9da8c9", "#7a80a8"],
		smallStorageBlock: false,
		drop: {
			item: "emendatusenigmatica:raw_aluminum",
			min: 1,
			max: 1,
		},
	},
	// Osmium
	{
		name: "osmium",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "raw", "ingot", "nugget", "dust", "plate", "gear", "rod", "storage_block", "bloodmagic", "thermal"],
		harvestLevel: "stone",
		strata: commonStratas,
		color: ["#e6ede9", "#abd1ca", "#83b0bd", "#3d5680", "#2c3766"],
		smallStorageBlock: false,
		drop: {
			item: "emendatusenigmatica:raw_osmium",
			min: 1,
			max: 1,
		},
	},
	// Lead
	{
		name: "lead",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "raw", "ingot", "nugget", "dust", "plate", "gear", "rod", "storage_block", "bloodmagic"],
		harvestLevel: "iron",
		strata: commonStratas,
		color: ["#aebcbf", "#707e8a", "#414a6a", "#28254d", "#1f1d47"],
		smallStorageBlock: false,
		drop: {
			item: "emendatusenigmatica:raw_lead",
			min: 1,
			max: 1,
		},
	},
	// Nickel
	{
		name: "nickel",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "raw", "ingot", "nugget", "dust", "plate", "gear", "rod", "storage_block", "mekanism", "bloodmagic"],
		harvestLevel: "stone",
		strata: commonStratas,
		color: ["#f6f7f0", "#b0b59f", "#869071", "#5a5c57", "#40423f"],
		smallStorageBlock: false,
		drop: {
			item: "emendatusenigmatica:raw_nickel",
			min: 1,
			max: 1,
		},
	},
	// Silver
	{
		name: "silver",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "raw", "ingot", "nugget", "dust", "plate", "gear", "rod", "storage_block", "mekanism", "bloodmagic"],
		harvestLevel: "iron",
		strata: commonStratas,
		color: ["#ffffff", "#d8ecff", "#baccff", "#7b85d9", "#646db4"],
		smallStorageBlock: false,
		drop: {
			item: "emendatusenigmatica:raw_silver",
			min: 1,
			max: 1,
		},
	},
	// Tin
	{
		name: "tin",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "raw", "ingot", "nugget", "dust", "plate", "gear", "rod", "storage_block", "bloodmagic"],
		harvestLevel: "stone",
		strata: commonStratas,
		color: ["#ebfaf9", "#bcd7e5", "#a1a6d3", "#74609e", "#473b61"],
		smallStorageBlock: false,
		drop: {
			item: "emendatusenigmatica:raw_tin",
			min: 1,
			max: 1,
		},
	},
	// Uranium
	{
		name: "uranium",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "raw", "ingot", "nugget", "dust", "plate", "gear", "rod", "storage_block", "bloodmagic", "thermal"],
		harvestLevel: "stone",
		strata: commonStratas,
		color: ["#ebe06a", "#98b350", "#43692f", "#113817", "#072411"],
		smallStorageBlock: false,
		drop: {
			item: "emendatusenigmatica:raw_uranium",
			min: 1,
			max: 1,
		},
	},
	// Zinc
	{
		name: "zinc",
		type: "metal",
		baseItem: "ingot",
		processedTypes: [
			"ore",
			"raw",
			"ingot",
			"nugget",
			"dust",
			"plate",
			"gear",
			"rod",
			"storage_block",
			"mekanism",
			"bloodmagic",
			"thermal",
		],
		harvestLevel: "iron",
		strata: commonStratas,
		color: ["#efece6", "#d1d1a5", "#9ca67b", "#54714c", "#3c5a3b"],
		smallStorageBlock: false,
		drop: {
			item: "emendatusenigmatica:raw_zinc",
			min: 1,
			max: 1,
		},
	},
	// Universal Modded Gems
	// Sulfur
	{
		name: "sulfur",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["ore", "gem", "dust", "storage_block"],
		harvestLevel: "stone",
		strata: commonStratas,
		color: ["#fff8e5", "#ffea47", "#ded531", "#bdc43b", "#a0ad3b"],
		drop: {
			item: "emendatusenigmatica:sulfur_gem",
			min: 1,
			max: 1,
		},
		gemTemplate: 8,
	},
	// Niter
	{
		name: "niter",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["ore", "gem", "dust", "storage_block"],
		harvestLevel: "stone",
		strata: commonStratas,
		color: ["#ffffff", "#e0dde4", "#aea5b8", "#8b7f9a", "#716978"],
		drop: {
			item: "emendatusenigmatica:niter_gem",
			min: 1,
			max: 1,
		},
		gemTemplate: 8,
	},
	// Fluorite
	{
		name: "fluorite",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["ore", "gem", "dust", "storage_block"],
		harvestLevel: "stone",
		strata: commonStratas,
		drop: {
			item: "emendatusenigmatica:fluorite_gem",
			min: 2,
			max: 4,
		},
	},
	// Ruby
	{
		name: "ruby",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["gem", "dust", "gear", "plate", "rod", "storage_block"],
		color: ["#fcd1cc", "#fb7b71", "#e93e43", "#c41735", "#780526"],
		gemTemplate: 1,
	},
	// Sapphire
	{
		name: "sapphire",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["gem", "dust", "gear", "plate", "rod", "storage_block"],
		color: ["#fcfcfc", "#bde5fc", "#76c6fc", "#246be9", "#121d73"],
		gemTemplate: 3,
	},
	// Misc
	// Wood
	{
		name: "wood",
		type: "dust",
		baseItem: "dust",
		processedTypes: ["dust", "storage_block"],
		color: ["#b8945f", "#987849", "#745a36", "#5f4a2b", "#4c3d26"],
	},
	// Ender Pearl
	{
		name: "ender_pearl",
		type: "dust",
		baseItem: "dust",
		processedTypes: ["dust", "storage_block"],
		color: ["#8cf4e2", "#349988", "#0c3730", "#0b4d42", "#063931"],
	},
	// Coal Coke
	{
		name: "coal_coke",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["gem", "dust", "storage_block"],
		color: ["#819da6", "#2e4049", "#1c1c1e", "#252525", "#1a2a36"],
		burnTime: 3200,
	},
	// Alloys
	// Electrum
	{
		name: "electrum",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "ingot", "nugget", "plate", "rod", "storage_block"],
		color: ["#f4f7eb", "#eded91", "#e5b840", "#a85d1b", "#8c3a0e"],
	},
	// Invar
	{
		name: "invar",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "ingot", "nugget", "plate", "rod", "storage_block"],
		color: ["#ffffff", "#b8c4bf", "#8d9f96", "#5b7669", "#495e57"],
	},
	// Constantan
	{
		name: "constantan",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "ingot", "nugget", "plate", "rod", "storage_block"],
		color: ["#f0e8d8", "#e5c09e", "#d8876b", "#943a38", "#781e24"],
	},
	// Bronze
	{
		name: "bronze",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "ingot", "nugget", "plate", "rod", "storage_block"],
		color: ["#ebe9be", "#ebd288", "#d38c53", "#ba5b2f", "#9c3a27"],
	},
	// Signalum
	{
		name: "signalum",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "ingot", "nugget", "plate", "rod", "storage_block"],
		color: ["#ffe4c9", "#fc8638", "#e55c17", "#993d0f", "#82260d"],
	},
	// Lumium
	{
		name: "lumium",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "ingot", "nugget", "plate", "rod", "storage_block"],
		color: ["#fdfff7", "#e5f3b5", "#dcd56b", "#bf8c39", "#a87132"],
	},
	// Enderium
	{
		name: "enderium",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "ingot", "nugget", "plate", "rod", "storage_block"],
		color: ["#5de8cc", "#289799", "#1c5961", "#0b2e47", "#0f1e36"],
	},
	// Brass
	{
		name: "brass",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "ingot", "nugget", "plate", "rod", "storage_block", "thermal"],
		color: ["#dfedcc", "#c7d477", "#b5a642", "#8c6322", "#6b3c0d"],
	},
	// Steel
	{
		name: "steel",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "ingot", "nugget", "plate", "rod", "storage_block", "thermal"],
		color: ["#e4e6eb", "#9ea0a3", "#818185", "#454552", "#31313b"],
	},
	// Mod: Ad Astra
	{
		name: "desh",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "rod", "mekanism", "bloodmagic", "crushed", "thermal"],
		color: ["#e6b85c", "#d38b4c", "#c57041", "#792f44", "#9c4438"],
	},
	{
		name: "ostrum",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "rod", "mekanism", "bloodmagic", "crushed", "thermal"],
		color: ["#bd7980", "#a66b72", "#76525f", "#41303c", "#543d4a"],
	},
	{
		name: "calorite",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "rod", "mekanism", "bloodmagic", "crushed", "thermal"],
		color: ["#dc6c5b", "#c94d4e", "#9c1f3e", "#691533", "#691533"],
	},
	// Mod: Ocultism
	{
		name: "iesnium",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["dust", "plate", "gear", "rod", "mekanism", "bloodmagic", "crushed", "thermal"],
		color: ["#b7e8e6", "#64b0bf", "#38748b", "#2c526b", "#233b56"],
	},
	// Mod: Blue Skies
	{
		name: "falsite",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["dust", "plate", "gear", "rod", "mekanism", "bloodmagic", "crushed", "thermal"],
		color: ["#9892ed", "#7561e2", "#751ed5", "#57148f", "#321178"],
	},
	{
		name: "ventium",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["dust", "plate", "gear", "rod", "mekanism", "bloodmagic", "crushed", "thermal"],
		color: ["#e1626b", "#d93737", "#b52020", "#7b1f16", "#651212"],
	},
	{
		name: "horizonite",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["dust", "plate", "gear", "rod", "mekanism", "bloodmagic", "crushed", "thermal"],
		color: ["#fcbe6c", "#fcab39", "#fc6d28", "#ae2d15", "#9c3100"],
	},
	// Mod: GregTech
	{
		name: "cobalt",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["mekanism", "crushed", "dust", "thermal"],
		color: ["#58a4ec", "#2375da", "#0752b6", "#003691", "#00286c"],
	},
	{
		name: "naquadah",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["mekanism", "dust", "thermal"],
		color: ["#53534f", "#494949", "#262626", "#1f1f1f", "#121212"],
	},
	//Mod: Draconic Evolution
	{
		name: "draconium",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["mekanism", "crushed", "bloodmagic", "plate", "gear", "rod", "dust", "thermal"],
		color: ["#e1cde5", "#ac6fe9", "#711ebc", "#4c1280", "#331052"],
		oreToDustMultiplier: 3,
	},
	{
		name: "draconium_awakened",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["plate", "gear", "rod", "dust", "thermal"],
		color: ["#f6fc92", "#fcca00", "#fc9a00", "#c23d00", "#950000"],
	},
];

global.EE_MATERIALS = EE_MATERIALS;

EE_MATERIALS.forEach(
	/**
	 * @param {EEConfig} material
	 */
	(material) => {
		new EmendatusEnigmaticaJS(material).register();
	}
);

/**
 * @param {string} str
 * @returns {string}
 * @example capitalize('hello') => 'Hello'
 */
let capitalize = (str) => str[0].toUpperCase() + str.substring(1);

/**
 * @param {string} str
 * @returns {string}
 * @example normalize('iron_ingot') => 'Iron Ingot'
 */
let normalize = (str) => {
	if (str.includes("_")) {
		let arr = str.split("_");
		arr = arr.map((str) => capitalize(str));
		return arr.join(" ");
	} else return capitalize(str);
};

let langTemplates = [
	{
		lang: "en_us",
		ore: (name, strata) => `${normalize(name)} Ore - ${normalize(strata)}`,
		dustGearGemEtc: (name, type) => `${normalize(name)} ${normalize(type)}`,
		raw: (name) => `Raw ${normalize(name)}`,
		rawBlock: (name) => `Block of Raw ${normalize(name)}`,
		block: (name) => `Block of ${normalize(name)}`,
		crystal: (name) => `${normalize(name)} Crystal`,
		shard: (name) => `${normalize(name)} Shard`,
		clump: (name) => `${normalize(name)} Clump`,
		dirtyDust: (name) => `Dirty ${normalize(name)} Dust`,
		fragment: (name) => `${normalize(name)} Fragment`,
		gravel: (name) => `${normalize(name)} Gravel`,
		crushed: (name) => `Crushed ${normalize(name)} Ore`,
		aspectus: (name) => `${normalize(name)} Aspectus`,
		coin: (name) => `${normalize(name)} Coin`,
		axe: (name) => `${normalize(name)} Axe`,
		hoe: (name) => `${normalize(name)} Hoe`,
		pickaxe: (name) => `${normalize(name)} Pickaxe`,
		shovel: (name) => `${normalize(name)} Shovel`,
		sword: (name) => `${normalize(name)} Sword`,
		helmet: (name) => `${normalize(name)} Helmet`,
		chestplate: (name) => `${normalize(name)} Chestplate`,
		leggings: (name) => `${normalize(name)} Leggings`,
		boots: (name) => `${normalize(name)} Boots`,
	},
	{
		lang: "zh_cn",
		ore: (name, strata) => `${normalize(name)}矿石 - ${normalize(strata)}`,
		dustGearGemEtc: (name, type) => `${normalize(name)}${normalize(type)}`,
		raw: (name) => `粗${normalize(name)}`,
		rawBlock: (name) => `粗${normalize(name)}块`,
		block: (name) => `${normalize(name)}块`,
		crystal: (name) => `${normalize(name)}晶体`,
		shard: (name) => `${normalize(name)}碎片`,
		clump: (name) => `${normalize(name)}碎块`,
		dirtyDust: (name) => `污浊${normalize(name)}粉`,
		fragment: (name) => `${normalize(name)}碎片`,
		gravel: (name) => `${normalize(name)}沙砾`,
		crushed: (name) => `粉碎${normalize(name)}矿石`,
		aspectus: (name) => `${normalize(name)}之象征`,
		coin: (name) => `${normalize(name)}币`,
		axe: (name) => `${normalize(name)}斧`,
		hoe: (name) => `${normalize(name)}锄`,
		pickaxe: (name) => `${normalize(name)}镐`,
		shovel: (name) => `${normalize(name)}锹`,
		sword: (name) => `${normalize(name)}剑`,
		helmet: (name) => `${normalize(name)}头盔`,
		chestplate: (name) => `${normalize(name)}胸甲`,
		leggings: (name) => `${normalize(name)}护腿`,
		boots: (name) => `${normalize(name)}靴子`,
	},
];

langTemplates.forEach((template) => {
	let lang = JsonIO.read(`./kubejs/assets/emendatusenigmatica/lang/generated_${template.lang}.json`) || {};
	EE_MATERIALS.forEach((material) => {
		let name = material.name;
		material.processedTypes.forEach((type) => {
			if (type == "ore") {
				material.strata.forEach((strata) => {
					lang[`block.emendatusenigmatica.${name}_ore_${strata}`] = template.ore(name, strata);
				});
			}
			if (["dust", "gear", "gem", "ingot", "nugget", "plate", "rod"].includes(type)) {
				lang[`item.emendatusenigmatica.${name}_${type}`] = template.dustGearGemEtc(name, type);
			}
			if (type == "raw") {
				lang[`item.emendatusenigmatica.raw_${name}`] = template.raw(name);
				lang[`block.emendatusenigmatica.raw_${name}_block`] = template.rawBlock(name);
			}
			if (type == "storage_block") {
				lang[`block.emendatusenigmatica.${name}_block`] = template.block(name);
			}
			if (type == "mekanism") {
				lang[`item.emendatusenigmatica.${name}_crystal`] = template.crystal(name);
				lang[`item.emendatusenigmatica.${name}_shard`] = template.shard(name);
				lang[`item.emendatusenigmatica.${name}_clump`] = template.clump(name);
				lang[`item.emendatusenigmatica.${name}_dirty_dust`] = template.dirtyDust(name);
				// lang[`slurry.emendatusenigmatica.dirty_${name}`] = `Dirty ${normalize(name)} Slurry`
				// lang[`slurry.emendatusenigmatica.clean_${name}`] = `Clean ${normalize(name)} Slurry`
			}
			if (type == "bloodmagic") {
				lang[`item.emendatusenigmatica.${name}_fragment`] = template.fragment(name);
				lang[`item.emendatusenigmatica.${name}_gravel`] = template.gravel(name);
			}
			if (type == "crushed") {
				lang[`item.emendatusenigmatica.${name}_crushed_ore`] = template.crushed(name);
			}
			if (type == "embers") {
				lang[`item.emendatusenigmatica.${name}_aspectus`] = template.aspectus(name);
			}
			if (type == "thermal") {
				lang[`item.emendatusenigmatica.${name}_coin`] = template.coin(name);
			}
		});

		if (material.toolProperties) {
			lang[`item.emendatusenigmatica.${name}_axe`] = template.axe(name);
			lang[`item.emendatusenigmatica.${name}_hoe`] = template.hoe(name);
			lang[`item.emendatusenigmatica.${name}_pickaxe`] = template.pickaxe(name);
			lang[`item.emendatusenigmatica.${name}_shovel`] = template.shovel(name);
			lang[`item.emendatusenigmatica.${name}_sword`] = template.sword(name);
		}

		if (material.armorProperties) {
			lang[`item.emendatusenigmatica.${name}_helmet`] = template.helmet(name);
			lang[`item.emendatusenigmatica.${name}_chestplate`] = template.chestplate(name);
			lang[`item.emendatusenigmatica.${name}_leggings`] = template.leggings(name);
			lang[`item.emendatusenigmatica.${name}_boots`] = template.boots(name);
		}
	});
	JsonIO.write(`./kubejs/assets/emendatusenigmatica/lang/generated_${template.lang}.json`, lang);
});
