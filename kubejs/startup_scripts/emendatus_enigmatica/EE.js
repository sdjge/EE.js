// priority: 299

let oreBlockJsonGenSwich = true;
let oreGenJsonSwich = true;

let singularGen = { Singular: true, count: 1000, times: 240 };

let loadedMods = {
	create: Platform.isLoaded("create"),
	bloodmagic: Platform.isLoaded("bloodmagic"),
	mekanism: Platform.isLoaded("mekanism"),
	embers: Platform.isLoaded("embers"),
	thermal: Platform.isLoaded("thermal_foundation"),
};

// CreateTabsPart
StartupEvents.registry("creative_mode_tab", (event) => {
	event.create(`${global.EE_PACKID}`, "basic").displayName = Text.translatable("tabs.emendatusenigmatica.tab_name");
});
let addToTab = (items) => {
	if (Array.isArray(items) == false) items = [items];
	items.forEach((item) => {
		StartupEvents.modifyCreativeTab(`kubejs:${global.EE_PACKID}`, (event) => {
			event.add(item);
		});
	});
};
let removeInTab = (items) => {
	if (Array.isArray(items) == false) items = [items];
	items.forEach((item) => {
		StartupEvents.modifyCreativeTab("kubejs:tab", (event) => {
			event.remove(item);
		});
	});
};

let paths = {
	models: {
		block: "./kubejs/assets/emendatusenigmatica/models/block/",
		fluid: "./kubejs/assets/emendatusenigmatica/models/block/fluid/",
	},
	textures: { block: "./kubejs/assets/emendatusenigmatica/textures/block/" },
	loots: { block: "./kubejs/data/emendatusenigmatica/loot_tables/blocks/" },
	avaritia: { singular: "./config/avaritia/singularities/" },
};

let OreModelJson = (base, overlay) => ({
	parent: "block/block",
	loader: "forge:composite",
	children: {
		solid: {
			parent: "block/cube_all",
			render_type: "minecraft:solid",
			textures: {
				all: base,
			},
		},
		translucent: {
			parent: "block/cube_all",
			render_type: "minecraft:translucent",
			textures: {
				all: overlay,
			},
		},
	},
	textures: {
		particle: base,
	},
});

let SingularJson = (base, color) => ({
	name: `singularity.avaritia.${base}`,
	colors: color,
	timeRequired: singularGen.times,
	conditions: [{ type: "forge:not", value: { tag: `forge:ingots/${base}`, type: "forge:tag_empty" } }],
	ingredient: { tag: `forge:ingots/${base}` },
	enabled: singularGen.Singular,
	recipeDisabled: singularGen.Singular,
});

/**
 * @typedef {Object} EEConfig
 * @property {string} name - The name of the material.
 * @property {string} type - The type of the material (e.g., 'metal', 'special').
 * @property {string[]} [processedTypes] - A list of processed types for the material.
 * @property {string[]} [color] - A list of color codes.
 * @property {number} [burnTime] - Burn time in ticks, if applicable.
 * @property {Object} [drop] - Information about drops (optional).
 * @property {string} [drop.item] - The item dropped by this material.
 * @property {number} [drop.min] - Minimum amount of items dropped.
 * @property {number} [drop.max] - Maximum amount of items dropped.
 * @property {string[]} [strata] - Strata levels applicable to this material.
 * @property {string} [harvestLevel] - Required harvest tool level.
 * @property {number} [gemTemplate] - Gem template index (optional).
 * @property {Object} [texture] - Custom textures (optional).
 * @property {Object} [genConfig] - feature configs (optional)
 * @property {Object} [texture.item]
 * @property {string} [texture.item.ingot]
 * @property {string} [texture.item.nugget]
 * @property {string} [texture.item.gem]
 * @property {string} [texture.item.dust]
 * @property {string} [texture.item.plate]
 * @property {string} [texture.item.rod]
 * @property {string} [texture.item.gear]
 * @property {string} [texture.item.raw]
 * @property {Object} [texture.block]
 * @property {string} [texture.block.parent]
 * @property {string} [texture.block.ore]
 * @property {string} [texture.block.storage_block]
 * @property {string} [texture.fluid.textures]
 */

/**
 *
 * @param {EEConfig} config
 */
function EmendatusEnigmaticaJS(config) {
	this.name = config.name;
	this.type = config.type;
	this.harvestLevel = config.harvestLevel;
	this.processedTypes = config.processedTypes;
	this.strata = config.strata;
	this.color = config.color;
	this.smallStorageBlock = config.smallStorageBlock;
	this.burnTime = config.burnTime || undefined;
	this.gemTemplate = config.gemTemplate || -1;
	this.toolProperties = config.toolProperties;
	this.baseItem = config.baseItem;
	this.armorProperties = config.armorProperties;
	this.fluidTexturesType = config.fluidType || undefined;
}

EmendatusEnigmaticaJS.prototype = {
	register() {
		let name = this.name;
		this.processedTypes.forEach((type) => {
			if (type == "ore") {
				this.strata.forEach((s) => {
					StartupEvents.registry("block", (event) => {
						event
							.create(`${global.EE_PACKID}:${name}_ore_${s}`)
							.hardness(EE_STRATAS[s].hardness)
							.resistance(EE_STRATAS[s].resistance)
							.soundType(SoundType.STONE)
							.requiresTool(true)
							.tagBoth("forge:ores")
							.tagBoth(`forge:ores/${name}`)
							.tagBlock(`minecraft:mineable/${EE_STRATAS[s].tool}`)
							.tagBlock(`minecraft:needs_${this.harvestLevel}_tool`)
							.tagBoth(`forge:ores_in_ground/${s}`);
					});

					addToTab(`${global.EE_PACKID}:${name}_ore_${s}`);
					removeInTab(`${global.EE_PACKID}:${name}_ore_${s}`);

					let model = JsonIO.read(`${paths.models.block}${name}_ore_${s}.json`) || {};
					if (model.parent == undefined && oreBlockJsonGenSwich) {
						console.log(`No block model found, creating new: ${name}_ore_${s}.json`);
						JsonIO.write(
							`${paths.models.block}${name}_ore_${s}.json`,
							OreModelJson(EE_STRATAS[s].texture, `${global.EE_PACKID}:block/overlays/${name}`)
						);
					}
				});
			}
			if (type == "raw") {
				StartupEvents.registry("item", (event) => {
					let builder = event.create(`${global.EE_PACKID}:raw_${name}`).tag("forge:raw_materials").tag(`forge:raw_materials/${name}`);

					if (this.color)
						builder
							.texture("layer0", "emendatusenigmatica:item/templates/raw/00")
							.texture("layer1", "emendatusenigmatica:item/templates/raw/01")
							.texture("layer2", "emendatusenigmatica:item/templates/raw/02")
							.texture("layer3", "emendatusenigmatica:item/templates/raw/03")
							.texture("layer4", "emendatusenigmatica:item/templates/raw/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
				StartupEvents.registry("block", (event) => {
					event
						.create(`${global.EE_PACKID}:raw_${name}_block`)
						.tagBoth("forge:storage_blocks")
						.tagBoth(`forge:storage_blocks/raw_${name}`)
						.tagBlock("minecraft:mineable/pickaxe")
						.soundType(SoundType.METAL)
						.requiresTool(true)
						.hardness(3)
						.resistance(3);
				});
				addToTab(`${global.EE_PACKID}:raw_${name}`);
				addToTab(`${global.EE_PACKID}:raw_${name}_block`);
				removeInTab(`${global.EE_PACKID}:raw_${name}`);
				removeInTab(`${global.EE_PACKID}:raw_${name}_block`);
			}
			if (type == "ingot") {
				StartupEvents.registry("item", (event) => {
					let registry = event.create(`${global.EE_PACKID}:${name}_ingot`).tag("forge:ingots").tag(`forge:ingots/${name}`);

					if (this.burnTime) registry.burnTime(this.burnTime);
					if (this.color)
						registry
							.texture("layer0", "emendatusenigmatica:item/templates/ingot/00")
							.texture("layer1", "emendatusenigmatica:item/templates/ingot/01")
							.texture("layer2", "emendatusenigmatica:item/templates/ingot/02")
							.texture("layer3", "emendatusenigmatica:item/templates/ingot/03")
							.texture("layer4", "emendatusenigmatica:item/templates/ingot/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
				addToTab(`${global.EE_PACKID}:${name}_ingot`);
				removeInTab(`${global.EE_PACKID}:${name}_ingot`);
				if (this.processedTypes.includes("storage_block")) {
					StartupEvents.registry("block", (e) => {
						let registry = e
							.create(`${global.EE_PACKID}:${name}_block`)
							.tagBoth("forge:storage_blocks")
							.tagBoth(`forge:storage_blocks/${name}`)
							.tagBlock("minecraft:mineable/pickaxe")
							.soundType(SoundType.METAL)
							.requiresTool(true)
							.hardness(3)
							.resistance(3);

						if (this.burnTime)
							registry.item((i) => {
								i.burnTime(this.burnTime * 10);
							});
					});
					addToTab(`${global.EE_PACKID}:${name}_block`);
					removeInTab(`${global.EE_PACKID}:${name}_block`);
				}
			}
			if (type == "fluid") {
				StartupEvents.registry("fluid", (event) => {
					let builder = event.create(`${global.EE_PACKID}:${name}`);
					if (this.fluidTexturesType == "thin") {
						if (this.color) {
							builder.thinTexture(this.color[0]).bucketColor(this.color[0]);
						}
					} else if (this.fluidTexturesType == "thick") {
						if (this.color) {
							builder.thickTexture(this.color[0]).bucketColor(this.color[0]);
						}
					} else if (this.fluidTexturesType == "custom") {
						builder.stillTexture(`emendatusenigmatica:block/fluid/${name}_still`).flowingTexture(`emendatusenigmatica:block/fluid/${name}_flowing`);
						if (this.color) {
							builder.bucketColor(this.color[0]);
							if (this.color[1]) {
								builder.color(this.color[1]);
							}
						}
					}
				});
				addToTab(`${global.EE_PACKID}:${name}_bucket`);
				removeInTab(`${global.EE_PACKID}:${name}_bucket`);
			}
			if (type == "dust") {
				StartupEvents.registry("item", (event) => {
					let registry = event.create(`${global.EE_PACKID}:${name}_dust`).tag("forge:dusts").tag(`forge:dusts/${name}`);

					if (this.burnTime) registry.burnTime(this.burnTime);
					if (this.color) {
						registry
							.texture("layer0", "emendatusenigmatica:item/templates/dust/00")
							.texture("layer1", "emendatusenigmatica:item/templates/dust/01")
							.texture("layer2", "emendatusenigmatica:item/templates/dust/02")
							.texture("layer3", "emendatusenigmatica:item/templates/dust/03")
							.texture("layer4", "emendatusenigmatica:item/templates/dust/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
					}
				});
				addToTab(`${global.EE_PACKID}:${name}_dust`);
				removeInTab(`${global.EE_PACKID}:${name}_dust`);
			}
			if (type == "gear") {
				StartupEvents.registry("item", (event) => {
					let builder = event.create(`${global.EE_PACKID}:${name}_gear`).tag("forge:gears").tag(`forge:gears/${name}`);

					if (this.color)
						builder
							.texture("layer0", "emendatusenigmatica:item/templates/gear/00")
							.texture("layer1", "emendatusenigmatica:item/templates/gear/01")
							.texture("layer2", "emendatusenigmatica:item/templates/gear/02")
							.texture("layer3", "emendatusenigmatica:item/templates/gear/03")
							.texture("layer4", "emendatusenigmatica:item/templates/gear/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
				addToTab(`${global.EE_PACKID}:${name}_gear`);
				removeInTab(`${global.EE_PACKID}:${name}_gear`);
			}
			if (type == "nugget") {
				StartupEvents.registry("item", (event) => {
					let builder = event.create(`${global.EE_PACKID}:${name}_nugget`).tag("forge:nuggets").tag(`forge:nuggets/${name}`);

					if (this.color)
						builder
							.texture("layer0", "emendatusenigmatica:item/templates/nugget/00")
							.texture("layer1", "emendatusenigmatica:item/templates/nugget/01")
							.texture("layer2", "emendatusenigmatica:item/templates/nugget/02")
							.texture("layer3", "emendatusenigmatica:item/templates/nugget/03")
							.texture("layer4", "emendatusenigmatica:item/templates/nugget/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
				addToTab(`${global.EE_PACKID}:${name}_nugget`);
				removeInTab(`${global.EE_PACKID}:${name}_nugget`);
			}
			if (type == "plate") {
				StartupEvents.registry("item", (event) => {
					let builder = event.create(`${global.EE_PACKID}:${name}_plate`).tag("forge:plates").tag(`forge:plates/${name}`);

					if (this.color)
						builder
							.texture("layer0", "emendatusenigmatica:item/templates/plate/00")
							.texture("layer1", "emendatusenigmatica:item/templates/plate/01")
							.texture("layer2", "emendatusenigmatica:item/templates/plate/02")
							.texture("layer3", "emendatusenigmatica:item/templates/plate/03")
							.texture("layer4", "emendatusenigmatica:item/templates/plate/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
				addToTab(`${global.EE_PACKID}:${name}_plate`);
				removeInTab(`${global.EE_PACKID}:${name}_plate`);
			}
			if (type == "rod") {
				StartupEvents.registry("item", (event) => {
					let builder = event.create(`${global.EE_PACKID}:${name}_rod`).tag("forge:rods").tag(`forge:rods/${name}`);

					if (this.color)
						builder
							.texture("layer0", "emendatusenigmatica:item/templates/rod/00")
							.texture("layer1", "emendatusenigmatica:item/templates/rod/01")
							.texture("layer2", "emendatusenigmatica:item/templates/rod/02")
							.texture("layer3", "emendatusenigmatica:item/templates/rod/03")
							.texture("layer4", "emendatusenigmatica:item/templates/rod/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
				addToTab(`${global.EE_PACKID}:${name}_rod`);
				removeInTab(`${global.EE_PACKID}:${name}_rod`);
			}
			if (type == "gem") {
				StartupEvents.registry("item", (event) => {
					let registry = event.create(`${global.EE_PACKID}:${name}_gem`).tag("forge:gems").tag(`forge:gems/${name}`);

					if (this.burnTime) registry.burnTime(this.burnTime);

					if (this.gemTemplate > -1 && this.color)
						registry
							.texture("layer0", `${global.EE_PACKID}:item/templates/gem/template_${this.gemTemplate}/00`)
							.texture("layer1", `${global.EE_PACKID}:item/templates/gem/template_${this.gemTemplate}/01`)
							.texture("layer2", `${global.EE_PACKID}:item/templates/gem/template_${this.gemTemplate}/02`)
							.texture("layer3", `${global.EE_PACKID}:item/templates/gem/template_${this.gemTemplate}/03`)
							.texture("layer4", `${global.EE_PACKID}:item/templates/gem/template_${this.gemTemplate}/04`)
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
				addToTab(`${global.EE_PACKID}:${name}_gem`);
				removeInTab(`${global.EE_PACKID}:${name}_gem`);

				if (this.processedTypes.includes("storage_block")) {
					StartupEvents.registry("block", (e) => {
						let registry = e
							.create(`${global.EE_PACKID}:${name}_block`)
							.tagBoth("forge:storage_blocks")
							.tagBoth(`forge:storage_blocks/${name}`)
							.tagBlock("minecraft:mineable/pickaxe")
							.soundType(SoundType.METAL)
							.requiresTool(true)
							.hardness(3)
							.resistance(3);

						if (this.burnTime)
							registry.item((i) => {
								i.burnTime(this.burnTime * 10);
							});
					});
					addToTab(`${global.EE_PACKID}:${name}_block`);
					removeInTab(`${global.EE_PACKID}:${name}_block`);
				}
			}
			if (type == "embers") {
				StartupEvents.registry("item", (event) => {
					let registry = event.create(`${global.EE_PACKID}:${name}_aspectus`).tag("embers:aspectus").tag(`embers:aspectus/${name}`);

					if (this.color) {
						registry
							.texture("layer0", "emendatusenigmatica:item/templates/aspectus/00")
							.texture("layer1", "emendatusenigmatica:item/templates/aspectus/01")
							.texture("layer2", "emendatusenigmatica:item/templates/aspectus/02")
							.texture("layer3", "emendatusenigmatica:item/templates/aspectus/03")
							.texture("layer4", "emendatusenigmatica:item/templates/aspectus/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
					}
				});
				removeInTab(`${global.EE_PACKID}:${name}_aspectus`);
				if (loadedMods.embers) {
					addToTab(`${global.EE_PACKID}:${name}_aspectus`);
				}
			}
			if (type == "thermal") {
				StartupEvents.registry("item", (event) => {
					let registry = event.create(`${global.EE_PACKID}:${name}_coin`).tag("forge:coins").tag(`forge:coins/${name}`);
					if (this.color) {
						registry
							.texture("layer0", "emendatusenigmatica:item/templates/coin/00")
							.texture("layer1", "emendatusenigmatica:item/templates/coin/01")
							.texture("layer2", "emendatusenigmatica:item/templates/coin/02")
							.texture("layer3", "emendatusenigmatica:item/templates/coin/03")
							.texture("layer4", "emendatusenigmatica:item/templates/coin/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
					}
				});
				removeInTab(`${global.EE_PACKID}:${name}_coin`);
				if (loadedMods.thermal) {
					addToTab(`${global.EE_PACKID}:${name}_coin`);
				}
			}
			if (type == "mekanism") {
				StartupEvents.registry("item", (event) => {
					let crystal = event.create(`${global.EE_PACKID}:${name}_crystal`).tag("mekanism:crystals").tag(`mekanism:crystals/${name}`);
					let shard = event.create(`${global.EE_PACKID}:${name}_shard`).tag("mekanism:shards").tag(`mekanism:shards/${name}`);
					let clump = event.create(`${global.EE_PACKID}:${name}_clump`).tag("mekanism:clumps").tag(`mekanism:clumps/${name}`);
					let dirtyDust = event.create(`${global.EE_PACKID}:${name}_dirty_dust`).tag("mekanism:dirty_dusts").tag(`mekanism:dirty_dusts/${name}`);

					if (this.color) {
						crystal
							.texture("layer0", "emendatusenigmatica:item/templates/crystal/00")
							.texture("layer1", "emendatusenigmatica:item/templates/crystal/01")
							.texture("layer2", "emendatusenigmatica:item/templates/crystal/02")
							.texture("layer3", "emendatusenigmatica:item/templates/crystal/03")
							.texture("layer4", "emendatusenigmatica:item/templates/crystal/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);

						shard
							.texture("layer0", "emendatusenigmatica:item/templates/shard/00")
							.texture("layer1", "emendatusenigmatica:item/templates/shard/01")
							.texture("layer2", "emendatusenigmatica:item/templates/shard/02")
							.texture("layer3", "emendatusenigmatica:item/templates/shard/03")
							.texture("layer4", "emendatusenigmatica:item/templates/shard/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);

						clump
							.texture("layer0", "emendatusenigmatica:item/templates/clump/00")
							.texture("layer1", "emendatusenigmatica:item/templates/clump/01")
							.texture("layer2", "emendatusenigmatica:item/templates/clump/02")
							.texture("layer3", "emendatusenigmatica:item/templates/clump/03")
							.texture("layer4", "emendatusenigmatica:item/templates/clump/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);

						dirtyDust
							.texture("layer0", "emendatusenigmatica:item/templates/dirty_dust/00")
							.texture("layer1", "emendatusenigmatica:item/templates/dirty_dust/01")
							.texture("layer2", "emendatusenigmatica:item/templates/dirty_dust/02")
							.texture("layer3", "emendatusenigmatica:item/templates/dirty_dust/03")
							.texture("layer4", "emendatusenigmatica:item/templates/dirty_dust/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
					}
				});
				removeInTab(`${global.EE_PACKID}:${name}_crystal`);
				removeInTab(`${global.EE_PACKID}:${name}_shard`);
				removeInTab(`${global.EE_PACKID}:${name}_clump`);
				removeInTab(`${global.EE_PACKID}:${name}_dirty_dust`);
				if (loadedMods.mekanism) {
					addToTab(`${global.EE_PACKID}:${name}_crystal`);
					addToTab(`${global.EE_PACKID}:${name}_shard`);
					addToTab(`${global.EE_PACKID}:${name}_clump`);
					addToTab(`${global.EE_PACKID}:${name}_dirty_dust`);
					StartupEvents.registry("mekanism:slurry", (event) => {
						event.create(`${global.EE_PACKID}:dirty_${name}`, "dirty").color(parseInt("0x" + this.color[3].slice(1), 16));
						event.create(`${global.EE_PACKID}:clean_${name}`, "clean").color(parseInt("0x" + this.color[2].slice(1), 16));
					});
				}
			}
			if (type == "bloodmagic") {
				StartupEvents.registry("item", (e) => {
					let fragment = e.create(`${global.EE_PACKID}:${name}_fragment`).tag("bloodmagic:fragments").tag(`bloodmagic:fragments/${name}`);
					let gravel = e.create(`${global.EE_PACKID}:${name}_gravel`).tag("bloodmagic:gravels").tag(`bloodmagic:gravels/${name}`);
					if (this.color) {
						fragment
							.texture("layer0", "emendatusenigmatica:item/templates/fragment/00")
							.texture("layer1", "emendatusenigmatica:item/templates/fragment/01")
							.texture("layer2", "emendatusenigmatica:item/templates/fragment/02")
							.texture("layer3", "emendatusenigmatica:item/templates/fragment/03")
							.texture("layer4", "emendatusenigmatica:item/templates/fragment/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);

						gravel
							.texture("layer0", "emendatusenigmatica:item/templates/gravel/00")
							.texture("layer1", "emendatusenigmatica:item/templates/gravel/01")
							.texture("layer2", "emendatusenigmatica:item/templates/gravel/02")
							.texture("layer3", "emendatusenigmatica:item/templates/gravel/03")
							.texture("layer4", "emendatusenigmatica:item/templates/gravel/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
					}
				});
				removeInTab(`${global.EE_PACKID}:${name}_fragment`);
				removeInTab(`${global.EE_PACKID}:${name}_gravel`);
				if (loadedMods.bloodmagic) {
					addToTab(`${global.EE_PACKID}:${name}_fragment`);
					addToTab(`${global.EE_PACKID}:${name}_gravel`);
				}
			}
			if (type == "crushed") {
				StartupEvents.registry("item", (event) => {
					let builder = event
						.create(`${global.EE_PACKID}:${name}_crushed_ore`)
						.tag("create:crushed_raw_materials")
						.tag(`create:crushed_raw_materials/${name}`);

					if (this.color)
						builder
							.texture("layer0", "emendatusenigmatica:item/templates/crushed_ore/00")
							.texture("layer1", "emendatusenigmatica:item/templates/crushed_ore/01")
							.texture("layer2", "emendatusenigmatica:item/templates/crushed_ore/02")
							.texture("layer3", "emendatusenigmatica:item/templates/crushed_ore/03")
							.texture("layer4", "emendatusenigmatica:item/templates/crushed_ore/04")
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
				removeInTab(`${global.EE_PACKID}:${name}_crushed_ore`);
				if (loadedMods.create) {
					addToTab(`${global.EE_PACKID}:${name}_crushed_ore`);
				}
			}
			if (type == "re:avaritia" && Platform.isLoaded("avaritia")) {
				let singularGener = JsonIO.read(`${paths.avaritia.singular}${name}.json`) || {};
				if (singularGener.parent == undefined) {
					console.log(`No singular found, creating new: ${name}.json`);
					JsonIO.write(
						`${paths.avaritia.singular}${name}.json`,
						SingularJson(name, [this.color[2].replace("#", "").toLowerCase().trim(), this.color[3].replace("#", "").toLowerCase().trim()])
					);
				}
			}
		});
		if (this.toolProperties) {
			let repairIngredient = `#forge:${this.baseItem}s/${name}`;
			let props = this.toolProperties;
			StartupEvents.registry("item", (event) => {
				let axe = event.create(`${global.EE_PACKID}:${name}_axe`, "axe").modifyTier((tier) => {
					tier.attackDamageBonus = props.damage;
					tier.level = props.harvestLevel;
					if (props.miningSpeed != undefined) {
						tier.speed = props.miningSpeed;
					}
				});

				let hoe = event.create(`${global.EE_PACKID}:${name}_hoe`, "hoe").modifyTier((tier) => {
					if (props.miningSpeed != undefined) {
						tier.speed = props.miningSpeed;
					}
				});

				let pickaxe = event.create(`${global.EE_PACKID}:${name}_pickaxe`, "pickaxe").modifyTier((tier) => {
					tier.attackDamageBonus = props.damage;
					tier.level = props.harvestLevel;
					if (props.miningSpeed != undefined) {
						tier.speed = props.miningSpeed;
					}
				});

				let shovel = event.create(`${global.EE_PACKID}:${name}_shovel`, "shovel").modifyTier((tier) => {
					tier.attackDamageBonus = props.damage;
					tier.level = props.harvestLevel;
					if (props.miningSpeed != undefined) {
						tier.speed = props.miningSpeed;
					}
				});

				let sword = event.create(`${global.EE_PACKID}:${name}_sword`, "sword").modifyTier((tier) => {
					tier.attackDamageBonus = props.damage;
					if (props.attackSpeed) {
						tier.speed = props.attackSpeed;
					}
				});

				let tools = [axe, hoe, pickaxe, shovel, sword];
				tools.forEach((item) => {
					let type = item.id.path.split("_")[1];
					let tag = `forge:tools/${type}`;
					if (type.endsWith("s") == false) {
						tag += "s";
					}
					item.tag("forge:tools").tag(tag).maxDamage(props.durability);

					if (this.color)
						item
							.texture("layer0", `${global.EE_PACKID}:item/templates/${type}/00`)
							.texture("layer1", `${global.EE_PACKID}:item/templates/${type}/01`)
							.texture("layer2", `${global.EE_PACKID}:item/templates/${type}/02`)
							.texture("layer3", `${global.EE_PACKID}:item/templates/${type}/03`)
							.texture("layer4", `${global.EE_PACKID}:item/templates/${type}/grip`)
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3]);

					if (props.enchantValue != undefined) {
						item.modifyTier((tier) => {
							tier.enchantmentValue = props.enchantValue;
							tier.repairIngredient = repairIngredient;
						});
					}
				});
			});
		}

		if (this.armorProperties) {
			let props = this.armorProperties;
			let repairIngredient = `#forge:${this.baseItem}s/${name}`;
			let armorTier = `${global.EE_PACKID}:${name}`;

			ItemEvents.armorTierRegistry((event) => {
				event.add(armorTier, (tier) => {
					tier.durabilityMultiplier = props.durabilityMultiplier;
					tier.equipSound = props.equipSound;
					tier.slotProtections = props.slotProtections;
					tier.repairIngredient = repairIngredient;
					if (props.enchantValue) tier.enchantmentValue = props.enchantValue;
					if (props.toughness) tier.toughness = props.toughness;
					if (props.knockbackResistance) tier.knockbackResistance = props.knockbackResistance;
				});
			});

			StartupEvents.registry("item", (event) => {
				let helmet = event.create(`${global.EE_PACKID}:${name}_helmet`, "helmet");
				let chestplate = event.create(`${global.EE_PACKID}:${name}_chestplate`, "chestplate");
				let leggings = event.create(`${global.EE_PACKID}:${name}_leggings`, "leggings");
				let boots = event.create(`${global.EE_PACKID}:${name}_boots`, "boots");

				let armors = [helmet, chestplate, leggings, boots];
				armors.forEach((armor) => {
					let type = armor.id.path.split("_")[1];
					let tag = `forge:armors/${type}`;
					if (type.endsWith("s") == false) {
						tag += "s";
					}
					armor.tier(armorTier).tag("forge:armors").tag(tag);

					if (this.color)
						armor
							.texture("layer0", `${global.EE_PACKID}:item/templates/${type}/00`)
							.texture("layer1", `${global.EE_PACKID}:item/templates/${type}/01`)
							.texture("layer2", `${global.EE_PACKID}:item/templates/${type}/02`)
							.texture("layer3", `${global.EE_PACKID}:item/templates/${type}/03`)
							.texture("layer4", `${global.EE_PACKID}:item/templates/${type}/04`)
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
			});
		}
	},
};
