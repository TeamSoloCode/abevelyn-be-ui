export class Color {
  constructor(color: IColor) {
    const { uuid, name, createAt, updateAt, code } = color;
    this.uuid = uuid;
    this.name = name;
    this.code = code;
    this._createAt = createAt;
    this._updateAt = updateAt;
  }

  readonly uuid: string;
  readonly name: string;
  readonly code: string;

  private _createAt: Date;
  public get createAt(): Date {
    return this._createAt;
  }
  public set createAt(value: Date) {
    this._createAt = value;
  }

  private _updateAt: Date;
  public get updateAt(): Date {
    return this._updateAt;
  }
  public set updateAt(value: Date) {
    this._updateAt = value;
  }
}
