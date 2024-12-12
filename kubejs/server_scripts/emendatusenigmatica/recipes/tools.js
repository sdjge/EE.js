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
				e.shaped(`emendatusenigmatica:${name}_axe`, ["mm ", "ms ", " s "], { m: material, s: "#forge:rods/wooden" }).id(
					`emendatusenigmatica:${name}_axe`
				);
				e.shaped(`emendatusenigmatica:${name}_hoe`, ["mm ", " s ", " s "], { m: material, s: "#forge:rods/wooden" }).id(
					`emendatusenigmatica:${name}_hoe`
				);
				e.shaped(`emendatusenigmatica:${name}_pickaxe`, ["mmm", " s ", " s "], {
					m: material,
					s: "#forge:rods/wooden",
				}).id(`emendatusenigmatica:${name}_pickaxe`);
				e.shaped(`emendatusenigmatica:${name}_shovel`, [" m ", " s ", " s "], {
					m: material,
					s: "#forge:rods/wooden",
				}).id(`emendatusenigmatica:${name}_shovel`);
				e.shaped(`emendatusenigmatica:${name}_sword`, [" m ", " m ", " s "], {
					m: material,
					s: "#forge:rods/wooden",
				}).id(`emendatusenigmatica:${name}_sword`);
			}
			if (mat.armorProperties != undefined) {
				e.shaped(`emendatusenigmatica:${name}_helmet`, ["mmm", "m m"], { m: material }).id(`emendatusenigmatica:${name}_helmet`);
				e.shaped(`emendatusenigmatica:${name}_chestplate`, ["m m", "mmm", "mmm"], { m: material }).id(
					`emendatusenigmatica:${name}_chestplate`
				);
				e.shaped(`emendatusenigmatica:${name}_leggings`, ["mmm", "m m", "m m"], { m: material }).id(
					`emendatusenigmatica:${name}_leggings`
				);
				e.shaped(`emendatusenigmatica:${name}_boots`, ["m m", "m m"], { m: material }).id(`emendatusenigmatica:${name}_boots`);
			}
		}
	);
});
