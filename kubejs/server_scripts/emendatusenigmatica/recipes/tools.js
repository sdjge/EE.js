// priority: 94

ServerEvents.recipes((e) => {
	global.EE_MATERIALS.forEach(
		/**
		 * @param {EEConfig} mat
		 */
		(mat) => {
			if (mat.toolProperties == undefined || mat.armorProperties == undefined) return;
			let name = mat.name;
			let material = `#forge:${mat.baseItem}s/${name}`;

			if (mat.toolProperties != undefined) {
				e.shaped(`${global.EE_PACKID}:${name}_axe`, ["mm ", "ms ", " s "], { m: material, s: "#forge:rods/wooden" }).id(`${global.EE_PACKID}:${name}_axe`);
				e.shaped(`${global.EE_PACKID}:${name}_hoe`, ["mm ", " s ", " s "], { m: material, s: "#forge:rods/wooden" }).id(`${global.EE_PACKID}:${name}_hoe`);
				e.shaped(`${global.EE_PACKID}:${name}_pickaxe`, ["mmm", " s ", " s "], {
					m: material,
					s: "#forge:rods/wooden",
				}).id(`${global.EE_PACKID}:${name}_pickaxe`);
				e.shaped(`${global.EE_PACKID}:${name}_shovel`, [" m ", " s ", " s "], {
					m: material,
					s: "#forge:rods/wooden",
				}).id(`${global.EE_PACKID}:${name}_shovel`);
				e.shaped(`${global.EE_PACKID}:${name}_sword`, [" m ", " m ", " s "], {
					m: material,
					s: "#forge:rods/wooden",
				}).id(`${global.EE_PACKID}:${name}_sword`);
			}
			if (mat.armorProperties != undefined) {
				e.shaped(`${global.EE_PACKID}:${name}_helmet`, ["mmm", "m m"], { m: material }).id(`${global.EE_PACKID}:${name}_helmet`);
				e.shaped(`${global.EE_PACKID}:${name}_chestplate`, ["m m", "mmm", "mmm"], { m: material }).id(`${global.EE_PACKID}:${name}_chestplate`);
				e.shaped(`${global.EE_PACKID}:${name}_leggings`, ["mmm", "m m", "m m"], { m: material }).id(`${global.EE_PACKID}:${name}_leggings`);
				e.shaped(`${global.EE_PACKID}:${name}_boots`, ["m m", "m m"], { m: material }).id(`${global.EE_PACKID}:${name}_boots`);
			}
		}
	);
});
