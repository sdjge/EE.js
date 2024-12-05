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

PlayerEvents.inventoryChanged((e) => {
	if (!e.player.isPlayer() || e.player.isFake()) return;
	if (e.item.id.includes("emendatusenigmatica")) return;

	let count = e.item.count;
	let nbt = e.item.nbt;
	let tags = e.item.tags.toArray().map((tag) => tag.toString().replace("TagKey[minecraft:item / ", "").replace("]", ""));
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
