//priority: 100

/**
 *
 * @param {Internal.TagEntry | string} tag
 * @returns
 */
let ForgeItem = (item) => {
	let result = {};
	if (item.startsWith("#")) {
		result.tag = item.substring(1);
	} else if (item.includes(" ")) {
		let splited = item.split(" ");
		result.count = parseInt(splited[0]);
		if (splited[1].startsWith("#")) {
			result.tag = splited[1].substring(1);
		} else {
			result.item = splited[1];
		}
	} else result.item = item;
	return result;
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

let loadedMods = {
	create: Platform.isLoaded("create"),
	createadditions: Platform.isLoaded("createaddition"),
	immersiveengineering: Platform.isLoaded("immersiveengineering"),
	thermalfoundation: Platform.isLoaded("thermal_foundation"),
	mekanism: Platform.isLoaded("mekanism"),
	embers: Platform.isLoaded("embers"),
	occultism: Platform.isLoaded("occultism"),
	ad_astra: Platform.isLoaded("ad_astra"),
	integrateddynamics: Platform.isLoaded("integrateddynamics"),
	avaritia: Platform.isLoaded("avaritia"),
};
