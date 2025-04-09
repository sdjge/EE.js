// priority: 298
let dimBiome = {
	overworld: "#minecraft:is_overworld",
	nether: "#is_nether",
	end: "#is_end",
};
let typeBiome = {
	badland: "#is_badlands",
	beach: "#is_beach",
	deepocean: "#is_deep_ocean",
	forest: "#is_forest",
	hill: "#is_hill",
	jungle: "#is_jungle",
	mountain: "#is_mountain",
	ocean: "#is_ocean",
	river: "#is_river",
	savanna: "#is_savanna",
	taiga: "#is_taiga",
};

let commonStratas = ["stone", "deepslate", "netherrack", "end_stone", "andesite", "diorite", "granite"];
let vanillaComplementStratas = ["netherrack", "end_stone", "andesite", "diorite", "granite"];
let glodStratas = ["andesite", "diorite", "granite", "end_stone"];

global.EE_PACKID = "emendatusenigmatica";

/**
 * @type {EEConfig[]}
 */
let EE_MATERIALS = [
	// fluid
	{
		name: "creosote_oil",
		type: "fluid",
		baseItem: "fluid",
		processedTypes: ["fluid"],
		fluidType: "thin",
		color: ["#fcfad2"],
	},

	{
		name: "crude_oil",
		type: "fluid",
		baseItem: "fluid",
		processedTypes: ["fluid"],
		fluidType: "thick",
		color: ["#1c1c1e"],
	},
	{
		name: "honey",
		type: "fluid",
		baseItemL: "fluid",
		processedTypes: ["fluid"],
		fluidType: "custom",
		color: ["#dc9613", "#dc9613"],
	},
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
		genConfig: {
			size: 9,
			chance: 0,
			count: 10,
			bottom: -24,
			top: 56,
			biome: dimBiome.overworld,
		},
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
		genConfig: {
			size: 20,
			chance: 0,
			count: 16,
			bottom: -16,
			top: 112,
			biome: dimBiome.overworld,
			disableNether: true,
			disableEnd: true,
		},
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
		genConfig: {
			size: 9,
			chance: 0,
			count: 4,
			bottom: -64,
			top: 32,
			biome: dimBiome.overworld,
		},
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
		genConfig: {
			size: 8,
			chance: 0.5,
			count: 2,
			bottom: -64,
			top: 10,
			biome: dimBiome.overworld,
		},
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
		genConfig: {
			size: 3,
			chance: 0,
			count: 100,
			bottom: -16,
			top: 480,
			biome: typeBiome.hill,
		},
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
			item: `${global.EE_PACKID}:raw_aluminum`,
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
			item: `${global.EE_PACKID}:raw_osmium`,
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
			item: `${global.EE_PACKID}:raw_lead`,
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
			item: `${global.EE_PACKID}:raw_nickel`,
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
			item: `${global.EE_PACKID}:raw_silver`,
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
			item: `${global.EE_PACKID}:raw_tin`,
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
			item: `${global.EE_PACKID}:raw_uranium`,
			min: 1,
			max: 1,
		},
	},
	// Zinc
	{
		name: "zinc",
		type: "metal",
		baseItem: "ingot",
		processedTypes: ["ore", "raw", "ingot", "nugget", "dust", "plate", "gear", "rod", "storage_block", "mekanism", "bloodmagic", "thermal"],
		harvestLevel: "iron",
		strata: commonStratas,
		color: ["#efece6", "#d1d1a5", "#9ca67b", "#54714c", "#3c5a3b"],
		smallStorageBlock: false,
		drop: {
			item: `${global.EE_PACKID}:raw_zinc`,
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
			item: `${global.EE_PACKID}:sulfur_gem`,
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
			item: `${global.EE_PACKID}:niter_gem`,
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
			item: `${global.EE_PACKID}:fluorite_gem`,
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
		/* drop: {
			item: `${global.EE_PACKID}:raw_zinc`,
			min: 1,
			max: 1,
		}, */
		/* toolProperties: {
			damage: 9,
			durability: 1800,
			harvestLevel: 4,
			enchantValue: 24,
			miningSpeed: 12,
		}, */
		/* armorProperties: {
			durability: 1000,
			durabilityMultiplier: 70,
			slotProtections: [4, 7, 9, 4],
			equipSound: "minecraft:item.armor.equip_iron",
			toughness: 3.5,
			knockbackResistance: 0,
		}, */
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
	// Mod: Botania
	{
		name: "dragonstone",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["dust", "gear", "plate", "rod"],
		color: ["#FCE7DF", "#F09FAA", "#E782B2", "#E266BA", "#5B2474"],
	},
	{
		name: "mana_diamond",
		type: "gem",
		baseItem: "gem",
		processedTypes: ["dust", "gear", "plate", "rod", "re:avaritia"],
		color: ["#FCFCFC", "#a1fbe8", "#80F0F1", "#00B2C2", "#004A66"],
	},
	{
		name: "manasteel",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "nugget", "plate", "rod", "thermal", "re:avaritia"],
		color: ["#66B7EB", "#B3FCF9", "#66B7EB", "#2375da", "#1F20B7"],
	},
	{
		name: "elementium",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "nugget", "plate", "rod", "thermal", "re:avaritia"],
		color: ["#FCE7DF", "#DD82A3", "#C342A6", "#791890", "#3E0765"],
	},
	{
		name: "terrasteel",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "nugget", "plate", "rod", "thermal", "re:avaritia"],
		color: ["#CAFCB3", "#69E561", "#2AB73A", "#0C7127", "#043B1C"],
	},
	{
		name: "gaia",
		type: "alloy",
		baseItem: "ingot",
		processedTypes: ["dust", "gear", "nugget", "plate", "rod", "thermal", "re:avaritia"],
		color: ["#CAFCB3", "#DD82A3", "#66B7EB", "#791890", "#1F20B7"],
	},
];

global.EE_MATERIALS = EE_MATERIALS;
