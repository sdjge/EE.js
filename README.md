# EE.js 

**This EEJS is a fork from [N-Withe](https://github.com/N-Wither)'s part of modpack -- [Omniworld-R](https://github.com/N-Wither/Omniworld-R)** 

A kubeJS script that elegantly unifies ores and materials 

**Recommended for use with almost unified** 

## [**中文**](https://github.com/sdjge/EE.js/blob/main/README%20zh_cn.md)

## Require 

- `minecraft => 1.20.1` <font size="1"> maybe not only 1.20.1 </font> 

- `(NEO)Forge => any` 

- `KubeJS => 6` 

- `LootJS => any` 

- `KubeJS Mekanism` <font size="1">**if has Mekanism** </font> 

- `KubeJS Immersive Engineering` <font size="1">**if has Immersive Enginnering** </font> 

- `KubeJS Create` <font size="1">**if has Create** </font> 

- `KubeJS Blood Magic` <font size="1">**if has Blood Magic** </font> 

- `KubeJS Thermal` <font size="1">**if has Thermal Series** </font> 

- `KubeJS-EnderIO` <font size="1">**if has Ender IO** </font>

- `Occultism KubeJS` <font size="1">**if has Occultism** </font> 

## Features 
- Customizable Strata/Materials 
- Convenient to modify 
- Nice compatibility  
  - Compatible with `Vanilla`, `Create`, `Mekanism`, `Bloodmagic`, `Embers`,and more... 

## TODO 
- [x] Registration of the material with its processed types 
- [ ] Automatically matches recipes and removes most duplicates 
  - [x] **Mekanism** 
  - [x] **Immersive Engineering** 
  - [x] **Create** 
    - [x] **Create Crafts & Additions** 
  - [x] **Bloodmagic** 
  - [x] **Integrated Dynamics** 
  - [x] **Embers Rekindled** 
  - [x] **Thermal Series** -- ***without*** `Dynamo numismatic` *recipes* 
  - [x] **Botania** 
  - [x] **Ad Astra** 
  - [x] **Ender IO** 
  - [x] **Occultism** 
  - [ ] **And more, please tell me!!!** 
- [ ] Worldgen modified to generate ores [almost complete!]
  - I'm a bit lazy to make worldgen related changes, please make your own changes or send a pull request!🥺 

## How to use 

Copy & paste😋 

## Registration part 
### for custom strata 

**Add new definitions to `EE_STRATAS` in `strata.js`.**  
```js
stone: {
	name: "stone", // name your strata
	texture: "minecraft:block/stone", // strata texure
	fill: "minecraft:stone",
	hardness: 1.5, // ore block hardness
	resistance: 6, // ore block resistance
	tool: "pickaxe", // tool type
}
``` 
**Add or modify definition at the top of `material_def.js`.** 
e.g.
```js
let glodStratas = ["andesite", "diorite", "granite", "end_stone"];
...
let EE_MATERIALS = [
    ...
] 
``` 
### for custom materials 
**Add new definition to `EE_MATERIALS` in `material_def.js`.** 

`*` *stands for optional* 

[1^]ProcessedTypes 

```js 
{ 
name: "coal", // name your material
type: "dust", // your material type -- ("dust","metal","gem")
baseItem: "dust", //*base item is
processedTypes: ["dust","fluid"], //*processed types in the table below 
color: ["#393e46", "#2e2e2e", "#261e24", "#1f1721", "#1c1c1e"], //*need 5 colors
burnTime: 1600, //*if can burn / time is tick
strata: vanillaComplementStratas, //*type of strata -- *Required if “ore” is present in the processing type*
fluidType:"thin" //*types: "thin","thick" and "custom", if it's thin or thick it will use first color(color[0]), 
// but custom has more configs! that need another color to color the fluid if you want, 
// first color is the bucket color, and you need more textures named to "${name}_still" and "${name}_flowing" like vanilla.
drop: {item: "minecraft:raw_iron",min: 1,max: 1,}, //*drops of ore block
harvestLevel: "stone", //*tool levels need
smallStorageBlock: true,//*Is the recipe for storage cubes 4*4 or 9*9
gemTemplate: 1, //*texure template
toolProperties: { //*if has tool *If added, the following options are mandatory*
damage: 9, // sword damage
durability: 1800, // tools durability
harvestLevel: 4, // tools harvest level
enchantValue: 24, // tools enchant value
miningSpeed: 12 // tools mining speed
},
armorProperties: { //*if has armor *If added, the following options are mandatory*
durability: 1000, // armor durability
durabilityMultiplier: 70, // armor durability multiplier
slotProtections: [4, 7, 9, 4], // armor protaections
equipSound: 'minecraft:item.armor.equip_iron', // sound
toughness: 3.5, // toughness
knockbackResistance: 0 // knockback resistance
}}
``` 

---
[1^]:https://github.com/sdjge/EE.js?tab=readme-ov-file#processedtypes
#### **ProcessedTypes**
| Types           | Require     | Registry Types                       | TIPS                                      |
| --------------- | ----------- | ------------------------------------ | ----------------------------------------- |
| "ore"           | None        | OreBlocks                            | None                                      |
| "raw"           | None        | RawOres, OreBlocks                   | None                                      |
| "fluid"         | None        | Fluid                                | None                                      |
| "ingot"         | None        | Ingots                               | None                                      |
| "nugget"        | None        | Niggets                              | None                                      |
| "dust"          | None        | Dusts                                | None                                      |
| "plate"         | None        | Plates                               | None                                      |
| "gear"          | None        | Gears                                | None                                      |
| "rod"           | None        | Rods                                 | None                                      |
| "storage_block" | None        | StorgeBlocks                         | None                                      |
| "crushed"       | Create      | CrushedOres                          | None                                      |
| "mekanism"      | Mekanism    | Crystals, Shards, Clumps, DirtyDusts | None                                      |
| "bloodmagic"    | Bloodmagic  | Fragments, Gravels                   | None                                      |
| "embers"        | Embers      | Aspectus                             | None                                      |
| "thermal"       | Thermal     | Coins                                | None                                      |
| "re:avaritia"   | Re:Avaritia | Singularities                        | Won't appear within the EEJS CreativeTabs |

## Recipe part 
### for recipes 

**You can simply adjust the value of `recipesSwich` in `recipes\recipes.js` to determine if a matching recipe exists for the corresponding Mod😎** 

## WorldGen part 
### for worldgen part 

**This requires `featureJS`.** 

**You can modify the `globalOreGenConfig` in `feature.js` in `server_scripts` to define the generation of minerals by default and without the `genConfig` setting!😋** 

```js
let globalOreGenConfig = {
	size: 10, // size
	chance: 0, // same as vanilla "discard_chance_on_air_exposure"
	count: 20, // count in chunks
	aboveBottom: -60, // bottom
	belowTop: 150, // top
};
```
