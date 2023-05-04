const SYSTEM = {
	TIME: 'time',
	WEIGHT: 'weight',
};

const WEIGHT = {
	[SYSTEM.TIME]: {
		ms: 0.001,
		s: 1,
		m: 60,
		h: 3600,
	},
	[SYSTEM.WEIGHT]: {
		mg: 0.001,
		g: 1,
		kg: 1000,
		t: 1000000,
	},
};

const getSystem = (unit) => {
	if (typeof unit !== 'string') {
		throw new Error('parameter expected a string');
	}

	switch (unit) {
		case 'h':
		case 'm':
		case 's':
		case 'ms':
			return SYSTEM.TIME;
		case 'mg':
		case 'g':
		case 'kg':
		case 't':
			return SYSTEM.WEIGHT;
		default:
			return null;
	}
};

const getUnit = (value) => {
	if (typeof value !== 'string') {
		throw new Error('parameter expected a string');
	}

	const unit = value.replace(/([0-9]|\.|\,)+([\S]+)?/, '$2').trim();

	if (!unit || /\d/.test(unit)) {
		return null;
	}

	return unit;
};

export default class Converter {
	#base = 0;
	#unit = null;

	constructor(value = '', unit = '') {
		this.#unit = getUnit(value) || unit;
		this.#base = parseFloat(String(value));
	}

	to(unit, { digit = null, printUnit = true } = {}) {
		if (typeof unit !== 'string') {
			throw new Error('parameter unit expected a string');
		}

		if (digit && typeof digit !== 'number') {
			throw new Error('parameter digit expected a number');
		}

		if (digit === 0 || digit > 100) {
			throw new Error(
				'parameter digit expected greater than 0 and less than 100'
			);
		}

		if (typeof printUnit !== 'boolean') {
			throw new Error('parameter printUnit expected a boolean');
		}

		const curSystem = getSystem(this.#unit);
		const targetSystem = getSystem(unit);

		if (curSystem !== targetSystem) {
			console.log(curSystem, targetSystem);
			throw new Error('parameter expected a same system with baes unit');
		}

		const curWeight = WEIGHT[curSystem][this.#unit];
		const targetWeight = WEIGHT[curSystem][unit];
		const value = this.#base * (curWeight / targetWeight);
		const result = !digit ? value : Number(value).toFixed(digit);

		return !printUnit ? Number(result) : `${result}${unit}`;
	}
}
