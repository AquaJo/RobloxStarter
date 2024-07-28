interface Cam extends Model {
	stengelchen: Part & {
		HingeConstraint: HingeConstraint;
	};
}

import { setTimeout } from "@rbxts/set-timeout";
import AngleListener from "shared/TS/angleListener";
const CollectionService = game.GetService("CollectionService");
const Workspace = game.GetService("Workspace");
const assets = game.GetService("ReplicatedStorage").WaitForChild("Assets");
const cameraHouse = assets.WaitForChild("CameraHouse") as Model;

setTimeout(() => {
	cameraHouse.Parent = Workspace;
	cameraHouse.MoveTo(new Vector3(0, 0, 0));
}, 2); // bruh not even ms

const taggedObjects = CollectionService.GetTagged("camera");

taggedObjects.forEach((object) => {
	print(object);
	const camera = object as Cam;
	const hingeConstraint = camera.stengelchen.HingeConstraint;
	(async () => {
		let counter = 0;
		const angleListener = new AngleListener(hingeConstraint);
		async function func() {
			if (counter % 2 === 0) {
				hingeConstraint.TargetAngle = -38 + 17;
			} else {
				hingeConstraint.TargetAngle = 57 - 17;
			}
			await angleListener.waitTill(hingeConstraint.TargetAngle);
			task.wait(0.75);
			counter++;
			func();
		}
		func(); // NEEDS TO BE CALLED UNDER FUNC INI EVEN IF ALLOWED IN JS, ADDED IT TO ESLINT
	})();
});
