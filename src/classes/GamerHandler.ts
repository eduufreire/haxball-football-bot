import { Handler, TeamCaptains } from "../interface/Handler";
import { CONSTANTS } from "../utils/constants";
import { Room } from "./Room";
import { TeamControl } from "./TeamControl";

export class GameHandler implements Handler {
    constructor(
        private room: RoomObject = Room.getRoom(),
        private teamControl = new TeamControl(),
        private isChoiceMode: boolean = false,
        private teamCaptains: TeamCaptains | null = null
    ) {}

    public handler(): void {
        let spectatorsPlayers = this.getActiveSpecPlayers();
        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();
        this.updateTeamCaptains();

        if (missingPlayers > 0 && spectatorsPlayers.length <= missingPlayers) {
            this.teamControl.autoAddPlayers(spectatorsPlayers);
            return;
        }

        if (
            spectatorsPlayers.length > missingPlayers &&
            missingPlayers > 0 &&
            !this.isChoiceMode
        ) {
            this.enablePlayerChoiceMode();
        }
    }


    public choicePlayerForTeam(
        playerChoiced: number, idCaptain: number, team: number
    ): void {
        let spectatorsPlayers = this.getActiveSpecPlayers();

        if(!this.verifyIndexIsValid(playerChoiced)) {
            let invalidIndexMessage = `O número digitado é inválido para escolha`
            this.room.sendAnnouncement(invalidIndexMessage, idCaptain, 0xd9554c, "bold", 1);
            this.showSpectatorsPlayerForChoice()
            return;
        }

        let idPlayer = spectatorsPlayers[playerChoiced - 1].id;
        this.teamControl.movePlayerForTeam(idPlayer, team);

        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();
        if (missingPlayers === 0) {
            this.disablePlayerChoiceMode();
            this.updateTeamCaptains();
        }
    }


    private enablePlayerChoiceMode() {
        if (!this.isChoiceMode) {
            this.room.pauseGame(true);
            this.isChoiceMode = true;
        }
    }


    private disablePlayerChoiceMode() {
        this.room.pauseGame(false);
        this.isChoiceMode = false;
    }


    public controlAfterPlayerLeft(player: PlayerObject) {
        this.teamControl.verifyPlayerTeamAndRemove(
            player.team,
            player.id
        );
        // TODO: tratar stats do player apos saida
    }
    

    public showSpectatorsPlayerForChoice() {
        this.updateTeamCaptains();
        let spectatorsPlayers = this.getActiveSpecPlayers();

        let message = `Digite o NÚMERO do jogador OU !rand / !top / !bottom \n\n`;
        message += `Jogadores disponíveis para escolha: \n`;

        spectatorsPlayers.forEach((player, index) => {
            if (index === spectatorsPlayers.length - 1) {
                message += `${player.name}[${index + 1}]`;
                return;
            }
            message += `${player.name}[${index + 1}], `;
        });

        let idCaptain =
        this.verifyPreferenceChoice() === CONSTANTS.TEAMS.RED_NUMBER
            ? this.teamCaptains?.redID
            : this.teamCaptains?.blueID;
        this.room.sendAnnouncement(message, idCaptain, 0xe8a157, "bold", 1);
    }


    public getActiveSpecPlayers(): Array<PlayerObject> {
        // TODO: futuramente, aplicar filtro também para pessoas ausentes
        return this.room.getPlayerList().filter((p) => p.id != 0 && p.team === 0);
    }

    public verifyIsChoiceMode(): boolean {
        return this.isChoiceMode;
    }

    public getCaptains(): TeamCaptains | null {
        return this.teamCaptains;
    }

    public verifyPreferenceChoice(): number {
        return this.teamControl.verifyCaptainWithPreferenceChoice();
    }

    private verifyIndexIsValid(index: number) {
        let activePlayers = this.getActiveSpecPlayers();
        if (index < 0 || index > activePlayers.length) {
            return false;
        }
        return true;
    }

    private updateTeamCaptains(): void {
        this.teamCaptains = this.teamControl.getCaptains();
    }
}
