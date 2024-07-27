print("HEYY FROM WORKSPACE");

const tweenService = game.GetService("TweenService");
const tweenInfo = new TweenInfo(1, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, 0, false, 0);

const testblock = script.Parent!.WaitForChild("part") as Part;
const currentPosition = testblock.Position;
const newPosition = currentPosition.add(new Vector3(30, 0, 0)); // Add +30 in the x direction

const tween = tweenService.Create(testblock, tweenInfo, { Position: newPosition });
tween.Play();
tween.Completed.Wait();
print("Tween completed");

// now + 50 in z direction with the help of cframes
const currentCFrame = testblock.CFrame;
const newCFrame = currentCFrame.mul(new CFrame(0, 0, 50));
const tween2 = tweenService.Create(testblock, tweenInfo, { CFrame: newCFrame });
tween2.Play();
