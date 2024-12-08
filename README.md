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
  - [ ] **And more, please tell me!!!** 
- [ ] Worldgen modified to generate ores 
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
const EE_MATERIALS = [
    ...
] 
``` 
### for custom materials 
**Add new definition to `EE_MATERIALS` in `material_def.js`.** 
`*` *stands for optional* 
```js 
{ 
name: "coal", // name your material
type: "dust", // your material type -- ("dust","metal","gem")
baseItem: "dust", //*base item is
processedTypes: ["dust"], //*processed types -- 
//("ore","raw","ingot","nugget","dust","plate","gear", 
//"rod""storage_block","mekanism","bloodmagic","embers","thermal") 
color: ["#393e46", "#2e2e2e", "#261e24", "#1f1721", "#1c1c1e"], //*need 5 colors
burnTime: 1600, //*if can burn / time is tick
strata: vanillaComplementStratas, //*type of strata -- *Required if “ore” is present in the processing type*
drop: {item: "minecraft:raw_iron",min: 1,max: 1,}, //*drops of ore block
harvestLevel: "stone", //*tool levels need
smallStorageBlock: true,//*I have no idea what it stands for 🥺
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
## Recipe part 
### for recipes 

**haha WIP😩** 

## WorldGen part 
### for worldgen part 

**haha WIP😩😩** 