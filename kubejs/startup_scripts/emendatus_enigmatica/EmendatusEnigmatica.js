// priority: 299

const LoadedMOD = {
	create: Platform.isLoaded("create"),
	bloodmagic: Platform.isLoaded("bloodmagic"),
	mekanism: Platform.isLoaded("mekanism"),
	embers: Platform.isLoaded("embers"),
};
console.info(
	`embers${LoadedMOD.embers},meka${LoadedMOD.mekanism},blood${LoadedMOD.bloodmagic},create${LoadedMOD.create}`
);
StartupEvents.registry("creative_mode_tab", (e) => {
	e.create("emendatusenigmatica", "basic").displayName = Text.translatable("tabs.emendatusenigmatica.tab_name");
});

let addToTab = (items) => {
	if (Array.isArray(items) == false) items = [items];
	items.forEach((item) => {
		StartupEvents.modifyCreativeTab("kubejs:emendatusenigmatica", (e) => {
			e.add(item);
		});
	});
};
let removeInTab = (items) => {
	if (Array.isArray(items) == false) items = [items];
	items.forEach((item) => {
		StartupEvents.modifyCreativeTab("kubejs:tab", (e) => {
			e.remove(item);
		});
	});
};
StartupEvents.modifyCreativeTab("kubejs:emendatusenigmatica", (e) => {
	e.remove(
		Item.of(
			"minecraft:paper",
			"{display:{Name:'{\"text\":\"Use .content(showRestrictedItems => [\\'kubejs:example\\']) to add more items!\"}'}}"
		)
	);
	e.setIcon("emendatusenigmatica:iron_gear");
});

const paths = {
	models: {
		block: "./kubejs/assets/emendatusenigmatica/models/block/",
	},
	textures: {
		block: "./kubejs/assets/emendatusenigmatica/textures/block/",
	},
	loots: {
		block: "./kubejs/data/emendatusenigmatica/loot_tables/blocks/",
	},
};

const OreModelJson = (base, overlay) => ({
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
}

EmendatusEnigmaticaJS.prototype = {
	register() {
		let name = this.name;
		this.processedTypes.forEach((type) => {
			if (type == "ore") {
				this.strata.forEach((s) => {
					StartupEvents.registry("block", (e) => {
						e.create(`emendatusenigmatica:${name}_ore_${s}`)
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

					addToTab(`emendatusenigmatica:${name}_ore_${s}`);
					removeInTab(`emendatusenigmatica:${name}_ore_${s}`);

					let model = JsonIO.read(`${paths.models.block}${name}_ore_${s}.json`) || {};
					if (model.parent == undefined) {
						console.log(`No block model found, creating new: ${name}_ore_${s}.json`);
						JsonIO.write(
							`${paths.models.block}${name}_ore_${s}.json`,
							OreModelJson(EE_STRATAS[s].texture, `emendatusenigmatica:block/overlays/${name}`)
						);
					}
				});
			}
			if (type == "raw") {
				StartupEvents.registry("item", (e) => {
					let builder = e
						.create(`emendatusenigmatica:raw_${name}`)
						.tag("forge:raw_materials")
						.tag(`forge:raw_materials/${name}`);

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
				StartupEvents.registry("block", (e) => {
					e.create(`emendatusenigmatica:raw_${name}_block`)
						.tagBoth("forge:storage_blocks")
						.tagBoth(`forge:storage_blocks/raw_${name}`)
						.tagBlock("minecraft:mineable/pickaxe")
						.soundType(SoundType.METAL)
						.requiresTool(true)
						.hardness(3)
						.resistance(3);
				});
				addToTab(`emendatusenigmatica:raw_${name}`);
				addToTab(`emendatusenigmatica:raw_${name}_block`);
				removeInTab(`emendatusenigmatica:raw_${name}`);
				removeInTab(`emendatusenigmatica:raw_${name}_block`);
			}
			if (type == "ingot") {
				StartupEvents.registry("item", (e) => {
					let registry = e.create(`emendatusenigmatica:${name}_ingot`).tag("forge:ingots").tag(`forge:ingots/${name}`);

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
				addToTab(`emendatusenigmatica:${name}_ingot`);
				removeInTab(`emendatusenigmatica:${name}_ingot`);
				if (this.processedTypes.includes("storage_block")) {
					StartupEvents.registry("block", (e) => {
						let registry = e
							.create(`emendatusenigmatica:${name}_block`)
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
					addToTab(`emendatusenigmatica:${name}_block`);
					removeInTab(`emendatusenigmatica:${name}_block`);
				}
			}
			if (type == "dust") {
				StartupEvents.registry("item", (e) => {
					let registry = e.create(`emendatusenigmatica:${name}_dust`).tag("forge:dusts").tag(`forge:dusts/${name}`);

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
				addToTab(`emendatusenigmatica:${name}_dust`);
				removeInTab(`emendatusenigmatica:${name}_dust`);
			}
			if (type == "gear") {
				StartupEvents.registry("item", (e) => {
					let builder = e.create(`emendatusenigmatica:${name}_gear`).tag("forge:gears").tag(`forge:gears/${name}`);

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
				addToTab(`emendatusenigmatica:${name}_gear`);
				removeInTab(`emendatusenigmatica:${name}_gear`);
			}
			if (type == "nugget") {
				StartupEvents.registry("item", (e) => {
					let builder = e
						.create(`emendatusenigmatica:${name}_nugget`)
						.tag("forge:nuggets")
						.tag(`forge:nuggets/${name}`);

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
				addToTab(`emendatusenigmatica:${name}_nugget`);
				removeInTab(`emendatusenigmatica:${name}_nugget`);
			}
			if (type == "plate") {
				StartupEvents.registry("item", (e) => {
					let builder = e.create(`emendatusenigmatica:${name}_plate`).tag("forge:plates").tag(`forge:plates/${name}`);

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
				addToTab(`emendatusenigmatica:${name}_plate`);
				removeInTab(`emendatusenigmatica:${name}_plate`);
			}
			if (type == "rod") {
				StartupEvents.registry("item", (e) => {
					let builder = e.create(`emendatusenigmatica:${name}_rod`).tag("forge:rods").tag(`forge:rods/${name}`);

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
				addToTab(`emendatusenigmatica:${name}_rod`);
				removeInTab(`emendatusenigmatica:${name}_rod`);
			}
			if (type == "gem") {
				StartupEvents.registry("item", (e) => {
					let registry = e.create(`emendatusenigmatica:${name}_gem`).tag("forge:gems").tag(`forge:gems/${name}`);

					if (this.burnTime) registry.burnTime(this.burnTime);

					if (this.gemTemplate > -1 && this.color)
						registry
							.texture("layer0", `emendatusenigmatica:item/templates/gem/template_${this.gemTemplate}/00`)
							.texture("layer1", `emendatusenigmatica:item/templates/gem/template_${this.gemTemplate}/01`)
							.texture("layer2", `emendatusenigmatica:item/templates/gem/template_${this.gemTemplate}/02`)
							.texture("layer3", `emendatusenigmatica:item/templates/gem/template_${this.gemTemplate}/03`)
							.texture("layer4", `emendatusenigmatica:item/templates/gem/template_${this.gemTemplate}/04`)
							.color(0, this.color[0])
							.color(1, this.color[1])
							.color(2, this.color[2])
							.color(3, this.color[3])
							.color(4, this.color[4]);
				});
				addToTab(`emendatusenigmatica:${name}_gem`);
				removeInTab(`emendatusenigmatica:${name}_gem`);

				if (this.processedTypes.includes("storage_block")) {
					StartupEvents.registry("block", (e) => {
						let registry = e
							.create(`emendatusenigmatica:${name}_block`)
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
					addToTab(`emendatusenigmatica:${name}_block`);
					removeInTab(`emendatusenigmatica:${name}_block`);
				}
			}
			if (type == "aspectus") {
				StartupEvents.registry("item", (e) => {
					let registry = e
						.create(`emendatusenigmatica:${name}_aspectus`)
						.tag("embers:aspectus")
						.tag(`embers:aspectus/${name}`);

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
				removeInTab(`emendatusenigmatica:${name}_aspectus`);
				if (LoadedMOD.embers) {
					addToTab(`emendatusenigmatica:${name}_aspectus`);
				}
			}
			if (type == "mekanism") {
				StartupEvents.registry("item", (e) => {
					let crystal = e
						.create(`emendatusenigmatica:${name}_crystal`)
						.tag("mekanism:crystals")
						.tag(`mekanism:crystals/${name}`);
					let shard = e
						.create(`emendatusenigmatica:${name}_shard`)
						.tag("mekanism:shards")
						.tag(`mekanism:shards/${name}`);
					let clump = e
						.create(`emendatusenigmatica:${name}_clump`)
						.tag("mekanism:clumps")
						.tag(`mekanism:clumps/${name}`);
					let dirtyDust = e
						.create(`emendatusenigmatica:${name}_dirty_dust`)
						.tag("mekanism:dirty_dusts")
						.tag(`mekanism:dirty_dusts/${name}`);

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
				removeInTab(`emendatusenigmatica:${name}_crystal`);
				removeInTab(`emendatusenigmatica:${name}_shard`);
				removeInTab(`emendatusenigmatica:${name}_clump`);
				removeInTab(`emendatusenigmatica:${name}_dirty_dust`);
				if (LoadedMOD.mekanism) {
					addToTab(`emendatusenigmatica:${name}_crystal`);
					addToTab(`emendatusenigmatica:${name}_shard`);
					addToTab(`emendatusenigmatica:${name}_clump`);
					addToTab(`emendatusenigmatica:${name}_dirty_dust`);
				}

				// StartupEvents.registry('mekanism:slurry', e => {
				//     e.create(`emendatusenigmatica:dirty_${name}`, ChemicalType.SLURRY.serializedName).color(parseInt('0x' + this.color[3].slice(1), 16))
				//     e.create(`emendatusenigmatica:clean_${name}`, ChemicalType.SLURRY.serializedName).color(parseInt('0x' + this.color[2].slice(1), 16))
				// })
			}
			if (type == "bloodmagic") {
				StartupEvents.registry("item", (e) => {
					let fragment = e
						.create(`emendatusenigmatica:${name}_fragment`)
						.tag("bloodmagic:fragments")
						.tag(`bloodmagic:fragments/${name}`);
					let gravel = e
						.create(`emendatusenigmatica:${name}_gravel`)
						.tag("bloodmagic:gravels")
						.tag(`bloodmagic:gravels/${name}`);

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
				removeInTab(`emendatusenigmatica:${name}_fragment`);
				removeInTab(`emendatusenigmatica:${name}_gravel`);
				if (LoadedMOD.bloodmagic) {
					addToTab(`emendatusenigmatica:${name}_fragment`);
					addToTab(`emendatusenigmatica:${name}_gravel`);
				}
			}
			if (type == "crushed") {
				StartupEvents.registry("item", (e) => {
					let builder = e
						.create(`emendatusenigmatica:${name}_crushed_ore`)
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
				removeInTab(`emendatusenigmatica:${name}_crushed_ore`);
				if (LoadedMOD.create) {
					addToTab(`emendatusenigmatica:${name}_crushed_ore`);
				}
			}
		});
		if (this.toolProperties) {
			let repairIngredient = `#forge:${this.baseItem}s/${name}`;
			let props = this.toolProperties;
			StartupEvents.registry("item", (e) => {
				let axe = e.create(`emendatusenigmatica:${name}_axe`, "axe").modifyTier((tier) => {
					tier.attackDamageBonus = props.damage;
					tier.level = props.harvestLevel;
					if (props.miningSpeed != undefined) {
						tier.speed = props.miningSpeed;
					}
				});

				let hoe = e.create(`emendatusenigmatica:${name}_hoe`, "hoe").modifyTier((tier) => {
					if (props.miningSpeed != undefined) {
						tier.speed = props.miningSpeed;
					}
				});

				let pickaxe = e.create(`emendatusenigmatica:${name}_pickaxe`, "pickaxe").modifyTier((tier) => {
					tier.attackDamageBonus = props.damage;
					tier.level = props.harvestLevel;
					if (props.miningSpeed != undefined) {
						tier.speed = props.miningSpeed;
					}
				});

				let shovel = e.create(`emendatusenigmatica:${name}_shovel`, "shovel").modifyTier((tier) => {
					tier.attackDamageBonus = props.damage;
					tier.level = props.harvestLevel;
					if (props.miningSpeed != undefined) {
						tier.speed = props.miningSpeed;
					}
				});

				let sword = e.create(`emendatusenigmatica:${name}_sword`, "sword").modifyTier((tier) => {
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
							.texture("layer0", `emendatusenigmatica:item/templates/${type}/00`)
							.texture("layer1", `emendatusenigmatica:item/templates/${type}/01`)
							.texture("layer2", `emendatusenigmatica:item/templates/${type}/02`)
							.texture("layer3", `emendatusenigmatica:item/templates/${type}/03`)
							.texture("layer4", `emendatusenigmatica:item/templates/${type}/grip`)
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
			let armorTier = `emendatusenigmatica:${name}`;

			ItemEvents.armorTierRegistry((e) => {
				e.add(armorTier, (tier) => {
					tier.durabilityMultiplier = props.durabilityMultiplier;
					tier.equipSound = props.equipSound;
					tier.slotProtections = props.slotProtections;
					tier.repairIngredient = repairIngredient;
					if (props.enchantValue) tier.enchantmentValue = props.enchantValue;
					if (props.toughness) tier.toughness = props.toughness;
					if (props.knockbackResistance) tier.knockbackResistance = props.knockbackResistance;
				});
			});

			StartupEvents.registry("item", (e) => {
				let helmet = e.create(`emendatusenigmatica:${name}_helmet`, "helmet");
				let chestplate = e.create(`emendatusenigmatica:${name}_chestplate`, "chestplate");
				let leggings = e.create(`emendatusenigmatica:${name}_leggings`, "leggings");
				let boots = e.create(`emendatusenigmatica:${name}_boots`, "boots");

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
							.texture("layer0", `emendatusenigmatica:item/templates/${type}/00`)
							.texture("layer1", `emendatusenigmatica:item/templates/${type}/01`)
							.texture("layer2", `emendatusenigmatica:item/templates/${type}/02`)
							.texture("layer3", `emendatusenigmatica:item/templates/${type}/03`)
							.texture("layer4", `emendatusenigmatica:item/templates/${type}/04`)
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
