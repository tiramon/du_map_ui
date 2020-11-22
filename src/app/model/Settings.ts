
export class Settings {
    showResourceIcons = true;
    showT1Ores = true;
    showT2Ores = true;
    showT3Ores = true;
    showT4Ores = true;
    showT5Ores = true;

    showOresT(tier: number): boolean {
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
}