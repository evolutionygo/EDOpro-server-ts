import { HostInfo } from "./host-info/HostInfo";
import { Mode } from "./host-info/Mode.enum";

function isInt(value: string): boolean {
	const numberValue = parseInt(value, 10);

	return !isNaN(numberValue) && Number.isInteger(numberValue);
}

interface RuleMappings {
	[key: string]: {
		get: (value?: string) => Partial<HostInfo>;
	};
}

export const ruleMappings: RuleMappings = {
	m: {
		get: () => ({ mode: Mode.MATCH }),
	},
	t: {
		get: () => ({ mode: Mode.TAG, startLp: 16000 }),
	},
};

export const priorityRuleMappings: RuleMappings = {
	lp: {
		get: (value: string) => {
			const [_, lps] = value.split("lp");
			if (!isInt(lps)) {
				return {
					startLp: 8000,
				};
			}

			const numberValue = parseInt(value, 10);

			if (numberValue <= 0) {
				return {
					startLp: 1,
				};
			}

			if (numberValue >= 99999) {
				return {
					startLp: 99999,
				};
			}

			return {
				startLp: +lps,
			};
		},
	},
};
