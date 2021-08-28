import 'phaser';
import CollisionManager from './collisionManager';

export default class OverlapGroup {
  private overlaps: boolean[] = [];
  private overlapping = false;

  constructor(
    private collisionManager: CollisionManager,
    private enter: () => void,
    private exit: () => void
  ) {}

  public addZone(zone: Phaser.GameObjects.Zone) {
    const zoneIdx = this.overlaps.length;
    this.overlaps.push(false);

    this.collisionManager.addOverlap(
      zone,
      () => this.update(zoneIdx, true),
      () => this.update(zoneIdx, false)
    );
  }

  private update(idx: number, overlap: boolean) {
    this.overlaps[idx] = overlap;

    const previousOverlapping = this.overlapping;
    this.overlapping = this.overlaps.includes(true);

    if (this.overlapping !== previousOverlapping) {
      if (this.overlapping) this.enter();
      else this.exit();
    }
  }
}
