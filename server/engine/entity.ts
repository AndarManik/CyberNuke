import { v4 as uuid } from "uuid";

import Engine from "./engine";
import Position from "../entity-components/position";
import Radius from "../entity-components/radius";

interface Identified {
  id: string;
}

interface Dynamic extends Identified {
  update(): void;
}

interface Rendered extends Identified {
  getState(): object;
}

interface Targeted extends Identified {
  position: Position;
  radius: Radius;
}

class Entity {
  entity: Identified;
  engine: Engine;
  groups: string[];

  constructor(entity: Identified, engine: Engine, ...groups: string[]) {
    this.entity = entity;
    this.engine = engine;
    this.groups = [];
    entity.id = uuid();

    this.addGroup(...groups, "all");
  }

  addGroup(...groups: string[]): this {
    this.groups.push(...groups);
    groups.forEach((group) => {
      const groupMap = this.engine[
        group as keyof typeof this.engine
      ] as unknown as Map<string, Identified>;
      groupMap.set(this.entity.id, this.entity);
    });
    return this;
  }

  removeGroup(...groups: string[]): this {
    this.groups = this.groups.filter((group) => !groups.includes(group));
    groups.forEach((group) => {
      const groupMap = this.engine[
        group as keyof typeof this.engine
      ] as unknown as Map<string, Identified>;
      groupMap.delete(this.entity.id);
    });
    return this;
  }

  remove(): void {
    this.groups.forEach((group) => {
      const groupMap = this.engine[
        group as keyof typeof this.engine
      ] as unknown as Map<string, Identified>;
      groupMap.delete(this.entity.id);
    });
    this.engine.all.delete(this.entity.id);
  }
}

export { Entity, Identified, Dynamic, Rendered, Targeted };
