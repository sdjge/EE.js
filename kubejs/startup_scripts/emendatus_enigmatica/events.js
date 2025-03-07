global.EE_MATERIALS.forEach(
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
		Singular: (name) => `${normalize(name)}`,
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
		Singular: (name) => `${normalize(name)}`,
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
			if (type == "re:avaritia") {
				lang[`singularity.avaritia.${name}`] = template.Singular(name);
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
