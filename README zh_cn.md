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

- `Occultism KubeJS` <font size="1">**如果有Occultism** </font> 

## 功能
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
  - [x] **Occultism** 
  - [ ] **也许更多，快告诉我还有啥!!** 
- [ ] 世界生成矿物 [差不多写完了！]
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
let EE_MATERIALS = [
    ...
] 
``` 
### 自定义材料 
**添加新的定义在 `EE_MATERIALS` ，它在 `material_def.js`里** 

`*` *代表非必须* 

[1^]ProcessedTypes 

```js 
{ 
name: "coal", // 命名材料
type: "dust", // 你的材料分类 -- ("dust","metal","gem")
baseItem: "dust", //*基础类型是？
processedTypes: ["dust","fluid"], //*处理物种类在下面的表格
color: ["#393e46", "#2e2e2e", "#261e24", "#1f1721", "#1c1c1e"], //*你需要5种颜色才能正常生成材质
burnTime: 1600, //*如果可以烧 / 时间单位是 tick
strata: vanillaComplementStratas, //*容矿岩种类 -- *如果你加了"ore"类型，你需要有这条*
fluidType:"thin" 
//*types: "thin","thick" and "custom", if it's thin or thick it will use first color(color[0]), 
// but custom has more configs! that need another color to color the fluid if you want, 
// first color is the bucket color, and you need more textures named to "${name}_still" and "${name}_flowing" like vanilla.
// 我懒得写一遍中文教程了，简单来说就是写了这个只会最多用2种颜色，三种type，只有custom会用第二种颜色然后作为材质第二次上色的颜色，第二种不写也没问题😁
drop: {item: "minecraft:raw_iron",min: 1,max: 1,}, //*矿物掉落物
harvestLevel: "stone", //*挖掘等级
smallStorageBlock: true,//*存储方块合成的配方是4*4还是9*9
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

---
[1^]:https://github.com/sdjge/EE.js/blob/main/README%20zh_cn.md#processedtypes
#### **ProcessedTypes**
| 种类            | 需求        | 注册种类               | TIPS                         |
| --------------- | ----------- | ---------------------- | ---------------------------- |
| "ore"           | None        | 矿石方块               | None                         |
| "raw"           | None        | 原矿、原矿块           | None                         |
| "fluid"         | None        | Fluid                  | None                         |
| "gem"           | None        | 宝石                   | None                         |
| "ingot"         | None        | 锭                     | None                         |
| "nugget"        | None        | 粒                     | None                         |
| "dust"          | None        | 粉                     | None                         |
| "plate"         | None        | 板                     | None                         |
| "gear"          | None        | 齿轮                   | None                         |
| "rod"           | None        | 棒                     | None                         |
| "storage_block" | None        | 矿物块                 | None                         |
| "crushed"       | Create      | 粉碎矿石               | None                         |
| "mekanism"      | Mekanism    | 晶体、碎片、碎块、脏粉 | None                         |
| "bloodmagic"    | Bloodmagic  | 碎片、沙砾             | None                         |
| "embers"        | Embers      | 象征                   | None                         |
| "thermal"       | Thermal     | 币                     | None                         |
| "re:avaritia"   | Re:Avaritia | 奇点                   | 不会出现在EEJS的创造物品栏内 |

## 配方部分 
### 配方 

**你可以在`我省略了哈哈\recipes\recipes.js`的`recipesSwich`里调已有 Mod 的布尔值来确定对应 Mod 的配方会不会生成😎** 

## 世界生成部分 
### 世界生成 

**需要`featureJS`**

**你可以修改`server_scripts`中的`feature.js`的`globalOreGenConfig`来定义默认的、不包含`genConfig`设置的矿物的生成！😋** 

```js
let globalOreGenConfig = {
	size: 10, // 大小
	chance: 0, // 和原版的"discard_chance_on_air_exposure"一样
	count: 20, // 就是原版的count
	aboveBottom: -60, // 最低生成
	belowTop: 150, // 最高生成
};
``` 