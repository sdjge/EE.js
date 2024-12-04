let typeMap = {
	"forge:raw_materials/": "emendatusenigmatica:raw_*",
	"forge:ingots/": "emendatusenigmatica:*_ingot",
	"forge:nuggets/": "emendatusenigmatica:*_nugget",
	"forge:storage_blocks/": "emendatusenigmatica:*_block",
	"forge:dusts/": "emendatusenigmatica:*_dust",
	"forge:gems/": "emendatusenigmatica:*_gem",
};

let conversionMap = JsonIO.read("./conversion_map.json") || {};

EntityEvents.spawned("minecraft:item", (e) => {
	let id = e.entity.nbt.Item.id;
	if (id.includes("emendatusenigmatica")) return;
	let count = e.entity.nbt.Item.Count;
	let tags = Item.of(id).tags.toArray();
	tags = tags.map((tag) => tag.toString().replace("TagKey[minecraft:item / ", "").replace("]", ""));
	let nbt = e.entity.nbt;

	let foundItem = false;
	for (let tagIndex in tags) {
		if (foundItem == true) break;
		for (let key in typeMap) {
			let finalTag = tags[tagIndex];
			if (RegExp(key).test(finalTag)) {
				if (conversionMap[finalTag] != undefined) {
					e.entity.nbt.Item.id = conversionMap[finalTag];
				} else {
					let strippedKey = key.replace("*", "");
					let material = finalTag.replace(strippedKey, "");
					let targetItem = typeMap[key].replace("*", material);
					if (Item.of(targetItem).id == "minecraft:air") return;
					nbt.Item = { id: targetItem, Count: count };
					e.entity.nbt = nbt;
					// conversionMap[finalTag] = targetItem
				}
				foundItem = true;
				break;
			}
		}
	}
});

/* PlayerEvents.inventoryChanged((e) => {
	if (!e.player.isPlayer() || e.player.isFake()) return;
	if (e.item.id.includes("emendatusenigmatica")) return;

	let count = e.item.count;
	let nbt = e.item.nbt;
	let tags = e.item.tags
		.toArray()
		.map((tag) => tag.toString().replace("TagKey[minecraft:item / ", "").replace("]", ""));
	let slot = e.slot;

	let setItem = (targetItem) => {
		e.player.inventory.clear(e.item);
		e.player.give(Item.of(targetItem, count, nbt));
		e.player.sendInventoryUpdate();
	};

	let foundItem = false;
	for (let tagIndex in tags) {
		if (foundItem == true) break;
		for (let key in typeMap) {
			let finalTag = tags[tagIndex];
			if (RegExp(key).test(finalTag)) {
				if (conversionMap[finalTag] != undefined) {
					let targetItem = conversionMap[finalTag];
					if (Item.of(targetItem).id == "minecraft:air") return;
					setItem(targetItem);
				} else {
					let strippedKey = key.replace("*", "");
					let material = finalTag.replace(strippedKey, "");
					let targetItem = typeMap[key].replace("*", material);
					if (Item.of(targetItem).id == "minecraft:air") return;
					setItem(targetItem);
					// conversionMap[finalTag] = targetItem
				}
				foundItem = true;
				break;
			}
		}
	}
}); */

ServerEvents.recipes((event) => {
	// remove if mod loaded
	const embersLoaded = Platform.isLoaded("embers");
	const mekaLoaded = Platform.isLoaded("mekanism");
	const bloodLoaded = Platform.isLoaded("bloodmagic");
	const createLoaded = Platform.isLoaded("create");
	if ((embersLoaded = true)) {
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
	if ((mekaLoaded = true)) {
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
	if ((createLoaded = true)) {
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

		/* let recipeReplace = [
			["create:brass_nugget", "emendatusenigmatica:brass_nugget"],
			["create:zinc_nugget", "emendatusenigmatica:zinc_nugget"],
			["create:copper_nugget", "emendatusenigmatica:copper_nugget"],
			["create:brass_ingot", "emendatusenigmatica:brass_ingot"],
			["create:zinc_ingot", "emendatusenigmatica:zinc_ingot"],
		]; */
		/* recipeReplace.forEach((replace, to) => {
			event.replaceOutput({ mod: "create" }, replace, to);
		}); */
	}
	if ((bloodLoaded = true)) {
		let recipeIdRemove = [];
		recipeIdRemove.forEach(([recipeId]) => {
			event.remove({ id: recipeId });
		});
	}
});

PlayerEvents.loggedOut((e) => {
	JsonIO.write("./conversion_map.json", conversionMap);
});

/* BlockEvents.broken(e => {
    let drops = e.block.drops.toArray().map(drop => [drop.id, drop.count, drop.nbt])
    drops.forEach(drop => {
        let id = drop[0]
        if(id.includes('emendatusenigmatica')) return;
        let count = drop[1]
        let nbt = drop[2]
        let tags = Item.of(id).tags.toArray().map(tag => tag.toString().replace('TagKey[minecraft:item / ', '').replace(']', ''));

        let foundItem = false
        for (let tagIndex in tags) {
            if (foundItem == true) break;
            for (let key in typeMap) {
                let finalTag = tags[tagIndex];
                if (RegExp(key).test(finalTag)) {
                    if (conversionMap[finalTag] != undefined) {
                        let targetItem = conversionMap[finalTag];
                        if (Item.of(targetItem).id == 'minecraft:air') return;
                        e.block.drops.remove(drop)
                        e.block.drops.add(Item.of(targetItem, count, nbt))
                    } else {
                        let strippedKey = key.replace('*', '');
                        let material = finalTag.replace(strippedKey, '');
                        let targetItem = typeMap[key].replace('*', material);
                        if (Item.of(targetItem).id == 'minecraft:air') return;
                        e.block.drops.remove(drop)
                    }
                    foundItem = true;
                    break;
                }
            }
        }
    })
}) */
