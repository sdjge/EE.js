// priority: 10

const RecipeTypeUtils = {
	/**
	 * @param {string} itemStr
	 */
	parseItem(itemStr) {
		if (itemStr.includes(" ")) {
			let splited = itemStr.split(" ");
			splited[0] = splited[0].replace("x", "");
			return splited.reverse();
		} else return [itemStr];
	},

	/**
	 * @param {string | Internal.Ingredient | Internal.FluidStack} ingredient
	 * @returns {Omniworld.IngredientJson}
	 */
	parseIngredient(ingredient) {
		if (typeof ingredient == "string") {
			if (ingredient.includes(" ")) {
				let [count, id] = ingredient.split(" ");
				count = Number(count.replace("x", ""));
				if (id.startsWith("#")) {
					return {
						tag: id.replace("#", ""),
						count: count,
					};
				} else {
					return {
						item: id,
						count: count,
					};
				}
			} else {
				return Ingredient.of(ingredient).toJson();
			}
		} else {
			let json = JSON.parse(ingredient.toJson().toString());
			if ("fluid" in json) {
				return ingredient.toJson();
			} else {
				json.ingredient.count = json.count;
				return json.ingredient;
			}
		}
	},
};

// Immersive Engineering

/**
 * @typedef {{base_ingredient: Internal.JsonElement, count: number}} IEBaseIngredient
 */
const ImmersiveEngineering = {
	MOLDS: {
		PLATE: "immersiveengineering:mold_plate",
		GEAR: "immersiveengineering:mold_gear",
		ROD: "immersiveengineering:mold_rod",
		BULLET_CASING: "immersiveengineering:mold_bullet_casing",
		WIRE: "immersiveengineering:mold_wire",
		PACKING_4: "immersiveengineering:mold_packing_4",
		PACKING_9: "immersiveengineering:mold_packing_9",
		UNPACKING: "immersiveengineering:mold_unpacking",
	},

	/**
	 * @param {Internal.Ingredient} ingredient
	 * @param {number} count
	 * @returns {IEBaseIngredient}
	 */
	_baseIngredient(ingredient, count) {
		if (count == undefined || parseInt(count) == 1)
			return {
				base_ingredient: Ingredient.of(ingredient).toJson(),
			};
		else
			return {
				base_ingredient: Ingredient.of(ingredient).toJson(),
				count: parseInt(count),
			};
	},

	/**
	 * @param {IEBaseIngredient | string} ingredient
	 * @returns
	 */
	_checkIngredient(ingredient) {
		if (typeof ingredient == "string") {
			ingredient = RecipeTypeUtils.parseItem(ingredient);
			return ImmersiveEngineering._baseIngredient(ingredient[0], ingredient[1]);
		} else return ingredient;
	},

	/**
	 * @param {string | OutputItem} itemstr
	 * @returns
	 */
	_chanceItem(itemstr) {
		let out = {
			output: {},
			chance: 1.0,
		};
		if (typeof itemstr == "string") {
			if (itemstr.includes(" ")) {
				let splited = itemstr.split(" ");
				if (isNaN(parseInt(splited[0]))) {
					out.output = ForgeItem(splited[0]);
					out.chance = parseFloat(splited[1]);
				} else if (isNaN(parseFloat(splited[1])) && splited.length == 3) {
					out.output = ForgeItem([splited[0], splited[1]].join(" "));
					out.chance = parseFloat(splited[2]);
				} else {
					out.output = ForgeItem(itemstr);
				}
			} else out.output = ForgeItem(itemstr);
		} else {
			out.output = ForgeItem(`${itemstr.count}x ${itemstr.item.id}`);
			out.chance = itemstr.chance;
		}

		return out;
	},

	/**
	 *
	 * @param {IEBaseIngredient | string} result
	 * @param {IEBaseIngredient | string} input
	 * @param {string} mold
	 * @param {number} energy
	 * @returns
	 */
	metalPress(result, input, mold, energy) {
		result = ImmersiveEngineering._checkIngredient(result);
		input = ImmersiveEngineering._checkIngredient(input);
		return {
			type: "immersiveengineering:metal_press",
			energy: energy || 2400,
			input: input,
			mold: mold,
			result: result,
		};
	},

	/**
	 *
	 * @param {string} result
	 * @param {string} input
	 * @returns
	 */
	hammerCrushing(result, input) {
		return {
			type: "immersiveengineering:hammer_crushing",
			input: ForgeItem(input),
			result: ForgeItem(result),
		};
	},

	/**
	 * @param {IEBaseIngredient | string} result
	 * @param {string} input
	 * @param {string[]} secondaries
	 * @param {number} energy
	 */
	crusher(result, input, energy, secondaries) {
		result = ImmersiveEngineering._checkIngredient(result);
		let out = {
			type: "immersiveengineering:crusher",
			input: ForgeItem(input),
			result: result,
			energy: energy || 3000,
			secondaries: [],
		};

		if (secondaries) out.secondaries = secondaries.map((entry) => ImmersiveEngineering._chanceItem(entry));

		return out;
	},

	/**
	 * @param {Ingredient[]} result
	 * @param {Ingredient[]} input
	 * @param {number} energy
	 * @param {number} time
	 * @returns
	 */
	arcFurnace(result, input, energy, time) {
		let out = {
			type: "immersiveengineering:arc_furnace",
			energy: energy || 51200,
			time: time || 100,
			results: [],
			additives: [],
		};
		if (Array.isArray(input)) {
			out.input = ImmersiveEngineering._checkIngredient(input[0]);
			for (let i = 1; i < input.length; i++) {
				out.additives.push(ImmersiveEngineering._checkIngredient(input[i]));
			}
		} else {
			out.input = ImmersiveEngineering._checkIngredient(input);
		}

		if (Array.isArray(result)) {
			for (res of result) {
				out.results.push(ImmersiveEngineering._checkIngredient(res));
			}
		} else {
			out.results.push(ImmersiveEngineering._checkIngredient(result));
		}

		return out;
	},
};

const Mekanism = {
	crushing: (output, input) => ({
		type: "mekanism:crushing",
		output: Item.of(output).toJson(),
		input: { ingredient: Ingredient.of(input).toJson() },
	}),
};

const Create = {
	/**
	 *
	 * @param {[string | Special.Item]} output
	 * @param {Ingredient | Ingredient[]} input
	 * @returns
	 */
	crushing: (output, input) => {
		let recipe = {
			type: "create:crushing",
			ingredients: [],
			processingTime: 400,
			results: [],
		};

		if (Array.isArray(output)) {
			for (let item of output) {
				let out = OutputItem.of(item);
				let json = ForgeItem(`${out.count}x ${out.item.id}`);
				json.chance = out.chance;
				recipe.results.push(json);
			}
		} else {
			let out = OutputItem.of(output);
			let json = ForgeItem(`${out.count}x ${out.item.id}`);
			json.chance = out.chance;
			recipe.results = [json];
		}

		if (Array.isArray(input)) {
			for (let ingredient of input) {
				recipe.ingredients.push(Ingredient.of(ingredient).toJson());
			}
		} else recipe.ingredients = [Ingredient.of(input).toJson()];

		return recipe;
	},
};

const Thermal = {
	_ThermalRecipe: function (type, result, ingredient) {
		this.ingredients = [];
		this.result = [];
		this.type = type;

		if (Array.isArray(result) == false) {
			result = [result];
		}
		result.forEach((r) => {
			if (r instanceof OutputItem) {
				let itemJson = {
					item: r.item.id,
					count: r.count,
					chance: r.chance,
				};
				this.result.push(itemJson);
			} else {
				this.result.push(Item.of(r).toJson());
			}
		});

		if (Array.isArray(ingredient) == false) {
			ingredient = [ingredient];
		}
		ingredient.forEach((i) => {
			this.ingredients.push(RecipeTypeUtils.parseIngredient(i));
		});
	},

	pulverizer(result, ingredient) {
		return new Thermal._ThermalRecipe("thermal:pulverizer", result, ingredient);
	},

	press(result, ingredient) {
		return new Thermal._ThermalRecipe("thermal:press", result, ingredient);
	},

	crystallizer(result, ingredient) {
		return new Thermal._ThermalRecipe("thermal:crystallizer", result, ingredient);
	},
};

Thermal._ThermalRecipe.prototype = {
	xp: function (xp) {
		this.xp = xp;
		return this;
	},
	energy: function (energy) {
		this.energy = energy;
		return this;
	},
};

// console.log(RecipeTypeUtils.parseIngredient(Ingredient.of('#forge:gems/ruby', 4)));
// console.log(RecipeTypeUtils.parseIngredient(Fluid.of('minecraft:water', 1000)));
