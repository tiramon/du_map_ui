
export class Settings {
    showResourceIcons = false;
    showT1Ores = true;
    showT2Ores = true;
    showT3Ores = true;
    showT4Ores = true;
    showT5Ores = true;

    showResourceAmount = true;
    showT1ResourceAmount = false;
    showT2ResourceAmount = true;
    showT3ResourceAmount = true;
    showT4ResourceAmount = true;
    showT5ResourceAmount = true;

    public constructor(init?: Partial<Settings>) {
        Object.assign(this, init);
    }

    showOreIconsT(tier: number): boolean {
        if (tier === 1 ) {
            return this.showT1Ores;
        } else if (tier === 2) {
            return this.showT2Ores;
        } else if (tier === 3) {
            return this.showT3Ores;
        } else if (tier === 4) {
            return this.showT4Ores;
        } else if (tier === 5) {
            return this.showT5Ores;
        }
        return false;
    }
    showOreTextsT(tier: number): boolean {
        if (tier === 1 ) {
            return this.showT1ResourceAmount;
        } else if (tier === 2) {
            return this.showT2ResourceAmount;
        } else if (tier === 3) {
            return this.showT3ResourceAmount;
        } else if (tier === 4) {
            return this.showT4ResourceAmount;
        } else if (tier === 5) {
            return this.showT5ResourceAmount;
        }
        return false;
    }
}
