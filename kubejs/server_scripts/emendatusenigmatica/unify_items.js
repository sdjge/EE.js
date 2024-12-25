let typeMap = {
	"forge:raw_materials/": "emendatusenigmatica:raw_*",
	"forge:ingots/": "emendatusenigmatica:*_ingot",
	"forge:nuggets/": "emendatusenigmatica:*_nugget",
	"forge:storage_blocks/": "emendatusenigmatica:*_block",
	"forge:dusts/": "emendatusenigmatica:*_dust",
	"forge:gems/": "emendatusenigmatica:*_gem",
	"forge:rods/": "emendatusenigmatica:*_rod",
	"forge:plates/": "emendatusenigmatica:*_plate",
	"forge:gears/": "emendatusenigmatica:*_gear",
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
ServerEvents.tags("item", (event) => {
	let itemTagsAdd = [
		["forge:ingots/gaia", ["botania:gaia_ingot"]],
		["forge:ingots", ["botania:gaia_ingot"]],
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
