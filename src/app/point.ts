export class Point {
  // tslint:disable-next-line:variable-name
  private _x: any;
  // tslint:disable-next-line:variable-name
  private _y: any;
  // tslint:disable-next-line:variable-name
  private _c: any;
  // tslint:disable-next-line:variable-name
  private _v: any;
  // tslint:disable-next-line:variable-name
  private _class: any;
  // tslint:disable-next-line:variable-name
  private _fscore: any = Infinity;
  // tslint:disable-next-line:variable-name
  private _gscore: any = Infinity;

  constructor(x: any, y: any, c: any) {
    this._x = x;
    this._y = y;
    this._c = c;
  }

  get x(): any {
    return this._x;
  }

  set x(value: any) {
    this._x = value;
  }

  get y(): any {
    return this._y;
  }

  set y(value: any) {
    this._y = value;
  }

  get c(): any {
    return this._c;
  }

  set c(value: any) {
    this._c = value;
  }

  get v(): any {
    return this._v;
  }

  set v(value: any) {
    this._v = value;
  }
  get class(): any {
    return this._class;
  }

  set class(value: any) {
    this._class = value;
  }

  get fscore(): any {
    return this._fscore;
  }

  set fscore(value: any) {
    this._fscore = value;
  }

  get gscore(): any {
    return this._gscore;
  }

  set gscore(value: any) {
    this._gscore = value;
  }
}
