export default class AngleListener {
	hinge: HingeConstraint;
	listeners: Map<number, () => void>;
	isMonitoring: boolean;
	constructor(hinge: HingeConstraint) {
		this.hinge = hinge;
		this.isMonitoring = false;
		this.listeners = new Map();
		this.initialize();
	}
	initialize() {
		game.GetService("RunService").Stepped.Connect(() => {
			if (!this.isMonitoring) return;
			this.listeners.forEach((callback, angle) => {
				if (math.abs(this.hinge.CurrentAngle - angle) < 0.1) {
					callback();
					this.listeners.delete(angle);
					if (this.listeners.size() === 0) {
						this.isMonitoring = false;
					}
				}
			});
		});
	}
	addListener(angle: number, callback: () => void) {
		this.listeners.set(angle, callback);
		this.isMonitoring = true;
	}
	async waitTill(angle: number) {
		return new Promise<void>((resolve) => {
			this.addListener(angle, () => {
				resolve();
			});
		});
	}
}
