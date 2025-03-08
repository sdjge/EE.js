ServerEvents.tags("item", (event) => {
	let itemTagsAdd = [
		["forge:gems", ["thermal:coal_coke", "immersiveengineering:coal_coke"]],
		["forge:gems/coal_coke", ["thermal:coal_coke", "immersiveengineering:coal_coke"]],
		["forge:coal_coke", `${global.EE_PACKID}:coal_coke_gem`],
		["minecraft:coals", `${global.EE_PACKID}:coal_coke_gem`],
	];
	itemTagsAdd.forEach(([itemTags, items]) => {
		event.add(itemTags, [items]);
	});
});
