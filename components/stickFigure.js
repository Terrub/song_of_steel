import { Utils } from "../utils.js";
import { Vector } from "./vector.js";

export class StickFigure {
  velocity;

  constructor(velocity) {
    this.velocity = velocity;

    this.color = "#444";
    this.thickness = 6;
    this.bones = {
      head: { point: new Vector(0, 96), connection: null },
      neck: { point: new Vector(0, 80), connection: "head" },
      leftShoulder: { point: new Vector(-10, 78), connection: "neck" },
      rightShoulder: { point: new Vector(10, 78), connection: "neck" },
      leftElbow: { point: new Vector(-18, 60), connection: "leftShoulder" },
      rightElbow: { point: new Vector(12, 60), connection: "rightShoulder" },
      leftHand: { point: new Vector(-15, 42), connection: "leftElbow" },
      rightHand: { point: new Vector(15, 42), connection: "rightElbow" },
      pelvis: { point: new Vector(0, 42), connection: "neck" },
      leftHip: { point: new Vector(-10, 47), connection: "pelvis" },
      rightHip: { point: new Vector(10, 47), connection: "pelvis" },
      leftKnee: { point: new Vector(-15, 23), connection: "leftHip" },
      rightKnee: { point: new Vector(25, 23), connection: "rightHip" },
      leftFoot: { point: new Vector(-30, 0), connection: "leftKnee" },
      rightFoot: { point: new Vector(30, 0), connection: "rightKnee" },
    };
  }

  offsetBones(numTics) {
    // assume idle pose
    const breathOffset = Math.cos(numTics * 0.0625) * 0.0625;

    this.bones.head.point.y += breathOffset;
    this.bones.neck.point.y += breathOffset;
    this.bones.pelvis.point.y += breathOffset;
    this.bones.leftShoulder.point.y += -breathOffset;
    this.bones.rightShoulder.point.y += -breathOffset;
    this.bones.leftKnee.point.x += -breathOffset;
    this.bones.rightKnee.point.x += -breathOffset;
  }

  draw(renderer, position, numTics) {
    this.offsetBones(numTics);

    for (const boneName in this.bones) {
      const bone = this.bones[boneName];
      const connection = this.bones[bone.connection];
      if (Utils.isDefined(connection)) {
        renderer.drawLine(
          position.x + bone.point.x,
          position.y + bone.point.y,
          position.x + connection.point.x,
          position.y + connection.point.y,
          this.color,
          this.thickness
        );
      } else {
        renderer.drawRect(
          position.x + bone.point.x - 8,
          position.y + bone.point.y - 10,
          16,
          20,
          this.color
        );
      }
    }
  }
}
