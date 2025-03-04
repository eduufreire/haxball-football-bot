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
	// isAFK: boolean;
	// celebrateGoal: string
}

export default class PlayerControl {
	private playersInMemory: Map<number, PlayerEntity> = new Map();

	public initializerPlayer(args: PlayerObject) {
		const player: PlayerEntity = {
			id: args.id,
			name: args.name,
			auth: args.auth,
			seasonStats: this.getStatsReseted(),
			allStats: this.getStatsReseted(),
		};

		// as duas opções abaixo servem para ir no banco de dados e verificar se possuem dados do player n temp
		// ou em todo o histórico
		if (player.id !== 0) {
			player.seasonStats = this.getStatsReseted();
		}

		if (player.id !== 0) {
			player.allStats = this.getStatsReseted();
		}

		this.playersInMemory.set(player.id, player);
	}

	public saveAndRemovePlayersStats(id: number) {
		const player = this.playersInMemory.get(id);
		if (player) {
			// atualizar no banco de dados
			console.log("atualizando no banco");
			this.playersInMemory.delete(id);
		}
	}

	public updateStats(id: number, stats: FieldsStats) {
		const player = this.playersInMemory.get(id);
		if (player) {
			player.seasonStats[stats] += 1;
		}
		console.log(this.playersInMemory);
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
