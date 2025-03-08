let typeMap = {
	"forge:raw_materials/": `${global.EE_PACKID}:raw_*`,
	"forge:ingots/": `${global.EE_PACKID}:*_ingot`,
	"forge:nuggets/": `${global.EE_PACKID}:*_nugget`,
	"forge:storage_blocks/": `${global.EE_PACKID}:*_block`,
	"forge:dusts/": `${global.EE_PACKID}:*_dust`,
	"forge:gems/": `${global.EE_PACKID}:*_gem`,
	"forge:rods/": `${global.EE_PACKID}:*_rod`,
	"forge:plates/": `${global.EE_PACKID}:*_plate`,
	"forge:gears/": `${global.EE_PACKID}:*_gear`,
};

let conversionMap = JsonIO.read("./conversion_map.json") || {};

EntityEvents.spawned("minecraft:item", (event) => {
	let id = event.entity.nbt.Item.id;
	if (id.includes(`${global.EE_PACKID}`)) return;
	let count = event.entity.nbt.Item.Count;
	let tags = Item.of(id).tags.toArray();
	tags = tags.map((tag) => tag.toString().replace("TagKey[minecraft:item / ", "").replace("]", ""));
	let nbt = event.entity.nbt;

	let foundItem = false;
	for (let tagIndex in tags) {
		if (foundItem == true) break;
		for (let key in typeMap) {
			let finalTag = tags[tagIndex];
			if (RegExp(key).test(finalTag)) {
				if (conversionMap[finalTag] != undefined) {
					event.entity.nbt.Item.id = conversionMap[finalTag];
				} else {
					let strippedKey = key.replace("*", "");
					let material = finalTag.replace(strippedKey, "");
					let targetItem = typeMap[key].replace("*", material);
					if (Item.of(targetItem).id == "minecraft:air") return;
					nbt.Item = { id: targetItem, Count: count };
					event.entity.nbt = nbt;
					// conversionMap[finalTag] = targetItem
				}
				foundItem = true;
				break;
			}
		}
	}
});

PlayerEvents.inventoryChanged((event) => {
	if (!event.player.isPlayer() || event.player.isFake()) return;
	if (event.item.id.includes(`${global.EE_PACKID}`)) return;

	let count = event.item.count;
	let nbt = event.item.nbt;
	let tags = event.item.tags.toArray().map((tag) => tag.toString().replace("TagKey[minecraft:item / ", "").replace("]", ""));

	let setItem = (targetItem) => {
		event.player.inventory.clear(event.item);
		event.player.give(Item.of(targetItem, count, nbt));
		event.player.sendInventoryUpdate();
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

PlayerEvents.loggedOut((event) => {
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
