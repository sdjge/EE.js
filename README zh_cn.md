# EE.js 

**EEJS 是[N-Withe](https://github.com/N-Wither)的整合包[Omniworld-R](https://github.com/N-Wither/Omniworld-R)的EEJS部分分支** 

它可以让你优雅的编辑、统一矿物与材料

**推荐与Almost unified一起使用** 

## [**EN**](https://github.com/sdjge/EE.js/blob/main/README.md)

## 需求 

- `minecraft => 1.20.1` <font size="1"> 也许不止1.20.1 </font> 

- `(NEO)Forge => any` 

- `KubeJS => 6` 

- `LootJS => any` 

- `KubeJS Mekanism` <font size="1">**如果有Mekanism** </font> 
  
- `KubeJS Immersive Engineering` <font size="1">**如果有Immersive Enginnering** </font> 
  
- `KubeJS Create` <font size="1">**如果有Create** </font> 
  
- `KubeJS Blood Magic` <font size="1">**如果有Blood Magic** </font> 
  
- `KubeJS Thermal` <font size="1">**如果有Thermal Series** </font> 

- `KubeJS-EnderIO` <font size="1">**如果有Ender IO** </font> 

## Features 
- 可自定义的容矿岩/材料 
- 便于编辑 
- 不错的兼容性  
  - 与`Vanilla`, `Create`, `Mekanism`, `Bloodmagic`, `Embers` 或更多情况下兼容性良好 

## 待办 
- [x] 注册材料与其制品 
- [ ] 自动匹配大部分配方与删除大部分重复配方 
  - [x] **Mekanism** 
  - [x] **Immersive Engineering** 
  - [x] **Create** 
    - [x] **Create Crafts & Additions** 
  - [x] **Bloodmagic** 
  - [x] **Integrated Dynamics** 
  - [x] **Embers Rekindled** 
  - [x] **Thermal Series** -- ***除了*** `Dynamo numismatic` *的发电配方* 
  - [x] **Botania**
  - [x] **Ad Astra**
  - [x] **Ender IO**
  - [ ] **也许更多，快告诉我还有啥!!** 
- [ ] 世界生成矿物 
  - 我懒了，你可以自己干或者给项目发PR🥺 

## How to use?? 

成为C&V工程师！😋 

## 注册部分 
### 自定义容矿岩 

**添加新的定义在 `EE_STRATAS` ，它在 `strata.js`里**  
```js
stone: {
	name: "stone", // 命名材料
	texture: "minecraft:block/stone", // 容矿岩材质
	fill: "minecraft:stone",
	hardness: 1.5, // 矿物硬度
	resistance: 6, // 矿物爆炸抗性
	tool: "pickaxe", // 工具类型
}
``` 
**添加或修改 `material_def.js` 的开头，类似于下文** 
e.g.
```js
let glodStratas = ["andesite", "diorite", "granite", "end_stone"];
...
const EE_MATERIALS = [
    ...
] 
``` 
### 自定义材料 
**添加新的定义在 `EE_MATERIALS` ，它在 `material_def.js`里** 
`*` *代表非必须* 
```js 
{ 
name: "coal", // 命名材料
type: "dust", // 你的材料分类 -- ("dust","metal","gem")
baseItem: "dust", //*基础类型是？
processedTypes: ["dust"], //*处理物种类 -- 
//("ore","raw","ingot","nugget","dust","plate","gear", 
//"rod""storage_block","mekanism","bloodmagic","embers","thermal") 
color: ["#393e46", "#2e2e2e", "#261e24", "#1f1721", "#1c1c1e"], //*你需要5种颜色才能正常生成材质
burnTime: 1600, //*如果可以烧 / 时间单位是 tick
strata: vanillaComplementStratas, //*容矿岩种类 -- *如果你加了"ore"类型，你需要有这条*
drop: {item: "minecraft:raw_iron",min: 1,max: 1,}, //*矿物掉落物
harvestLevel: "stone", //*挖掘等级
smallStorageBlock: true,//*我不到这是干啥的 🥺
gemTemplate: 1, //*纹理模板
toolProperties: { //*工具属性 *加上了的话下面都要出现，不加就没有*
damage: 9, // 伤害
durability: 1800, // 耐久
harvestLevel: 4, // 挖掘等级
enchantValue: 24, // 附魔等级
miningSpeed: 12 // 挖掘速度
},
armorProperties: { //*护甲属性 *加上了的话下面都要出现，不加就没有*
durability: 1000, // 护甲耐久
durabilityMultiplier: 70, // 护甲耐久乘数
slotProtections: [4, 7, 9, 4], // 护甲部位的护甲值
equipSound: 'minecraft:item.armor.equip_iron', // 穿戴声音
toughness: 3.5, // 护甲抗性
knockbackResistance: 0 // 击退减免
}}
``` 
## 配方部分 
### 配方 

**哈哈 还没做完😩** 

## 世界生成部分 
### 世界生成 

**哈哈 也还没做😩😩** 