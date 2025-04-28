export interface TournamentType {
   id: string;
   name: string;
   type: "Solo" | "Squad" | "DUO";
   createdAt: string;  
}

export interface MatchType {
   id: string;
   team1: TeamType;
   team2: TeamType;
   result: null | "WIN" | "LOSE";
   createdAt: string;
}

export interface TeamType {
	id: string;
	name: string;
	leader: string;
   position: number;
   players: PlayerType[];
	createdAt: string;
}

export interface PlayerType {
	id: string;
	name: string;
	level?: number;
   device: string
	createdAt: number | string;
}