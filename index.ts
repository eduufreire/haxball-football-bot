
// Local path as example, but may refer to installed npm package
import roomBuilder from "./src/room-builder";
import HaxballJS from "haxball.js";

HaxballJS.then((HBInit => roomBuilder(HBInit)))
