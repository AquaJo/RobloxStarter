import { setTimeout } from "@rbxts/set-timeout";
const Workspace = game.GetService("Workspace");
const assets = game.GetService("ReplicatedStorage").WaitForChild("Assets");
const cameraHouse = assets.WaitForChild("CameraHouse") as Model;

setTimeout(() => {
	print("HI");
	cameraHouse.Parent = Workspace;
	cameraHouse.MoveTo(new Vector3(0, 0, 0));
}, 2); // bruh not even ms
