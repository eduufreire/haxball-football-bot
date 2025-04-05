import { StatsPrisma, UpdateDTO } from "../repository/StatsRepository";

type Stats = {
	goals: number;
	assistences: number;
	matches: number;
	victories: number;
	defeats: number;
	winrate: number;
};

type FieldsStats =
	| "goals"
	| "assistences"
	| "matches"
	| "victories"
	| "defeats";

interface PlayerEntity {
	id: number;
	name: string;
	auth: string;
	seasonStats: Stats;
	allStats: Stats;
	// isAdmin: boolean;
}

export default class PlayerControl {
	constructor(private statsRepository = new StatsPrisma()) {}

	private playersInMemory: Map<number, PlayerEntity> = new Map();

	public async initializerPlayer(args: PlayerObject) {
		const player: PlayerEntity = {
			id: args.id,
			name: args.name,
			auth: args.auth,
			seasonStats: this.getStatsReseted(),
			allStats: this.getStatsReseted(),
		};

		if (player.id !== 0) {
			const result = await this.statsRepository.getStatsPlayer(
				player.auth,
			);

			if (!result) {
				await this.statsRepository.save(
					player.id,
					player.name,
					player.auth,
				);
			}

			if (result.seasonStatus.length > 0) {
				player.seasonStats = result.seasonStatus[0];
			}
		}

		this.playersInMemory.set(player.id, player);
	}

	public async updateAndRemovePlayersStats(id: number) {
		const player = this.playersInMemory.get(id);
		if (player) {
			const { seasonStatus } = await this.statsRepository.getStatsPlayer(
				player.auth,
			);

			if (seasonStatus.length < 0) {
				console.log("Pinto mole");
			} else {
				const flamengo: UpdateDTO = {
					id: seasonStatus[0].id,
					...player.seasonStats,
				};

				console.log(flamengo);

				const teste = await this.statsRepository.updateStats(flamengo);

				console.log(teste);
			}

			this.playersInMemory.delete(id);
		}
	}

	public updateStats(id: number, stats: FieldsStats) {
		const player = this.playersInMemory.get(id);
		if (player) {
			player.seasonStats[stats] += 1;
		}
	}

	private getStatsReseted() {
		return {
			assistences: 0,
			defeats: 0,
			goals: 0,
			victories: 0,
			matches: 0,
			winrate: 0,
		};
	}
}
