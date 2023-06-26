import { YGOClientSocket } from "../../../socket-server/HostServer";
import { RoomMessageHandler } from "../../messages/application/RoomMessageHandler/RoomMessageHandler";
import { Choose } from "../../rock-paper-scissor/RockPaperScissor";
import { Room } from "../../room/domain/Room";

export class Listener {}

export class Client {
	public readonly listener: Listener;
	public readonly host: boolean;
	public readonly name: string;
	public readonly position: number;
	public readonly roomId: number;
	public readonly team: number;
	private _socket: YGOClientSocket;
	private _isReady: boolean;
	private _rpsChosen: Choose | null = null;
	private readonly _cache: Buffer[] = [];
	private _reconnecting = false;

	constructor({
		socket,
		host,
		name,
		position,
		roomId,
		isReady = false,
		team,
	}: {
		socket: YGOClientSocket;
		host: boolean;
		name: string;
		position: number;
		roomId: number;
		isReady?: boolean;
		team: number;
	}) {
		this._socket = socket;
		this.host = host;
		this.name = name;
		this.position = position;
		this.roomId = roomId;
		this._isReady = isReady;
		this.team = team;
	}

	get socket(): YGOClientSocket {
		return this._socket;
	}

	setSocket(socket: YGOClientSocket, clients: Client[], room: Room): void {
		this._socket = socket;
		this._socket.on("data", (data) => {
			const messageHandler = new RoomMessageHandler(data, this, clients, room);
			messageHandler.read();
		});
	}

	setRpsChosen(choise: Choose): void {
		this._rpsChosen = choise;
	}

	clearRpsChoise(): void {
		this._rpsChosen = null;
	}

	get rpsChoise(): Choose | null {
		return this._rpsChosen;
	}

	ready(): void {
		this._isReady = true;
	}

	notReady(): void {
		this._isReady = false;
	}

	get isReady(): boolean {
		return this._isReady;
	}

	sendMessage(message: Buffer): void {
		this._socket.write(message);
		this._cache.push(message);
	}

	get cache(): Buffer[] {
		return this._cache;
	}

	reconnecting(): void {
		this._reconnecting = true;
	}

	clearReconnecting(): void {
		this._reconnecting = false;
	}

	get isReconnecting(): boolean {
		return this._reconnecting;
	}
}
