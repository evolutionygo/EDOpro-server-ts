/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Express } from "express";
import heapdump from "heapdump";

import { Logger } from "../../modules/shared/logger/domain/Logger";
import { CreateRoomController } from "../controllers/CreateRoomController";
import { GetRoomListController } from "../controllers/GetRoomListController";

export function loadRoutes(app: Express, logger: Logger): void {
	app.get("/api/getrooms", (req, res) => new GetRoomListController().run(req, res));
	app.post("/api/room", (req, res) => new CreateRoomController(logger).run(req, res));
	app.get("/api/snapshot", (req, res) => {
		heapdump.writeSnapshot((error, filename) => {
			if (error) {
				return res.status(500).json(error);
			}

			console.log(`Heap snapshot written to ${filename}`);

			return res.status(200).json({});
		});
	});
}
