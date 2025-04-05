import { SeasonStatus } from "@prisma/client";
import { prisma } from "../../prisma/client";

interface StatsRepository {
	save(id: number, name: string, auth: string): Promise<any>;
	getStatsPlayer(auth: string): Promise<any>;
	// getRank(byStats: string): Promise<any>;
}

export interface UpdateDTO {
	id: number;
	goals: number;
	assistences: number;
	matches: number;
	victories: number;
	defeats: number;
}

export class StatsPrisma implements StatsRepository {
	async save(id: number, name: string, auth: string) {
		return await prisma.user.create({
			data: {
				idInGame: id,
				auth,
				nickname: name,
			},
		});
	}

	async getStatsPlayer(auth: string): Promise<any> {
		return await prisma.user.findUnique({
			where: {
				auth,
			},
			include: {
				seasonStatus: {
					where: {
						seasons: {
							season: "04-2025",
						},
					},
				},
			},
		});
	}

	async updateStats(args: UpdateDTO): Promise<any> {
		const { id, goals, assistences, matches, victories, defeats } = args;
		return await prisma.seasonStatus.update({
			where: {
				id: id,
				fkUser: 3,
			},
			data: {
				goals: goals,
				assistences: assistences,
				matches: matches,
				wins: victories,
				defeats: defeats,
			},
		});
	}

	async getIdSeasonStats(idUser: number): Promise<any> {
		return await prisma.seasonStatus.findMany({
			select: {
				id: true,
			},
			where: {
				fkUser: idUser,
				fkSeason: 1,
			},
		});
	}
}

// const teste = new StatsPrisma();

// async function outroTeste() {
// 	const result = await teste.updateStats({
// 		id: 2,
// 		goals: 52,
// 		assistences: 15,
// 		matches: 5,
// 		victories: 3,
// 		defeats: 2,
// 	});

// 	console.log(result);
// }

// outroTeste()