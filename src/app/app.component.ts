import {Component} from '@angular/core';
import {ALGO_TYPES, CLASSES, NEIGHBORS, OBJ_TYPE} from './constants';
import {PriorityQueue} from './priority.queue';
import {Point} from './point';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'graphs';
  grid: any = [];
  rows: any = 0;
  cols: any = 0;
  obstacles: any = 0;
  algoTypes: any = [
    {value: ALGO_TYPES.BFS, label: 'BFS', algo: this.traversal, args: true},
    {value: ALGO_TYPES.DFS, label: 'DFS', algo: this.traversal, args: false},
    {value: ALGO_TYPES.DIJ, label: 'Dijkstra', algo: this.dijkstra, args: null},
    {value: ALGO_TYPES.ASTAR, label: 'A*', algo: this.astar, args: null}
  ];
  algoType: any = this.algoTypes[0];
  source: any;
  dest: any;
  searchSource: any = false;
  searchDest: any = false;
  searchObs: any = false;
  visitedCount: any = 0;
  pathCount: any = 0;
  minObs: any = 0;
  rowClass: any = '';
  algoClass: any = '';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe(value => {
      this.rows = value ? 15 : 30;
      this.cols = value ? 20 : 50;
      this.obstacles = value ? 50 : 300;
      this.minObs = value ? 50 : 100;
      this.rowClass = value ? 'row-sm' : 'row-lg';
      this.algoClass = value ? CLASSES.mr : '';
      this.createGrid();
    });
  }

  createGrid(): void {
    this.searchObs = false;
    this.searchSource = false;
    this.searchDest = false;
    this.visitedCount = 0;
    this.pathCount = 0;
    this.grid = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = new Array(this.cols);
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = new Point(i, j, Infinity);
      }
    }
    this.grid[0][0].v = OBJ_TYPE.SOURCE;
    this.grid[0][0].class = CLASSES.s;
    this.grid[0][0].c = 0;
    this.grid[this.rows - 1][this.cols - 1].v = OBJ_TYPE.DEST;
    this.grid[this.rows - 1][this.cols - 1].class = CLASSES.d;
    this.source = this.grid[0][0];
    this.dest = this.grid[this.rows - 1][this.cols - 1];
  }

  fillObstacles(): void {
    let obs = Math.floor(Math.random() * this.obstacles) + this.minObs;
    this.resetObstacles();
    while (obs > 0) {

      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);

      if (![CLASSES.s, CLASSES.d, CLASSES.x].includes(this.grid[row][col].class)) {
        this.grid[row][col].class = CLASSES.x;
        this.grid[row][col].v = OBJ_TYPE.OBSTACLE;
        --obs;
      }
    }
  }

  resetObstacles(): void {
    this.searchObs = false;
    this.searchSource = false;
    this.searchDest = false;
    this.visitedCount = 0;
    this.pathCount = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (![OBJ_TYPE.DEST, OBJ_TYPE.SOURCE].includes(this.grid[i][j].v)) {
          this.grid[i][j].v = '';
          this.grid[i][j].class = '';
        }
      }
    }
  }

  go(): any {
    this.searchObs = false;
    this.searchSource = false;
    this.searchDest = false;
    this.resetClasses();
    this.visitedCount = 0;
    this.pathCount = 0;
    this.source = this.source ? this.source : this.grid[0][0];
    this.dest = this.dest ? this.dest : this.grid[this.rows - 1][this.cols - 1];

    this.source.class = CLASSES.s;
    this.source.v = OBJ_TYPE.SOURCE;
    this.source.fscore = 0;
    this.source.gscore = 0;
    this.source.c = 0;

    this.dest.class = CLASSES.d;
    this.dest.v = OBJ_TYPE.DEST;

    const visited = new Set<Point>();
    visited.add(this.source);
    this.algoType.algo(this, visited, new Map<Point, Point>(), this.algoType.args);
  }

  resetClasses(): any {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if ([CLASSES.v, CLASSES.p].includes(this.grid[i][j].class)) {
          this.grid[i][j].class = '';
        }
        this.grid[i][j].c = Infinity;
        this.grid[i][j].gscore = Infinity;
        this.grid[i][j].fscore = Infinity;
      }
    }
  }

  astar(parent, visited, paths): any {
    const priorityQueue = new PriorityQueue(parent.comparatorAstar());
    priorityQueue.add(parent.source);

    while (!priorityQueue.isEmpty()) {
      const point: Point = priorityQueue.poll();
      if (point.v === OBJ_TYPE.DEST) {
        break;
      }
      parent.paint(point, CLASSES.v, parent);
      for (const nbr of NEIGHBORS) {
        const nx = nbr[0] + point.x;
        const ny = nbr[1] + point.y;
        if (parent.isInValid(nx, ny, parent, visited)) {
          continue;
        }
        const tempGScore = point.gscore + 1;
        if (tempGScore < parent.grid[nx][ny].gscore) {
          parent.grid[nx][ny].gscore = tempGScore;
          parent.grid[nx][ny].fscore = tempGScore + parent.heuristic(nx, ny, parent.dest.x, parent.dest.y);
          visited.add(parent.grid[nx][ny]);
          paths.set(parent.grid[nx][ny], point);
          priorityQueue.add(parent.grid[nx][ny]);
        }
      }
    }

    parent.createPath(paths, parent);
  }

  dijkstra(parent, visited, paths): any {
    const priorityQueue = new PriorityQueue(parent.comparatorDij());
    priorityQueue.add(parent.source);

    while (!priorityQueue.isEmpty()) {
      const point: Point = priorityQueue.poll();
      if (point.v === OBJ_TYPE.DEST) {
        break;
      }
      parent.paint(point, CLASSES.v, parent);

      for (const nbr of NEIGHBORS) {
        const nx = nbr[0] + point.x;
        const ny = nbr[1] + point.y;
        if (parent.isInValid(nx, ny, parent, visited)) {
          continue;
        }
        visited.add(parent.grid[nx][ny]);
        paths.set(parent.grid[nx][ny], point);
        if (parent.grid[nx][ny].c > point.c + 1) {
          parent.grid[nx][ny].c = point.c + 1;
          priorityQueue.add(parent.grid[nx][ny]);
        }
      }
    }

    parent.createPath(paths, parent);
  }

  traversal(parent, visited, paths, isBfs): any {

    const queue = [parent.source];
    while (queue.length !== 0) {

      const point: Point = isBfs ? queue.shift() : queue.pop();

      if (point.v === OBJ_TYPE.DEST) {
        break;
      }

      parent.paint(point, CLASSES.v, parent);
      for (const nbr of NEIGHBORS) {
        const nx = nbr[0] + point.x;
        const ny = nbr[1] + point.y;
        if (parent.isInValid(nx, ny, parent, visited)) {
          continue;
        }
        visited.add(parent.grid[nx][ny]);
        paths.set(parent.grid[nx][ny], point);
        queue.push(parent.grid[nx][ny]);
      }
    }

    parent.createPath(paths, parent);
  }

  private comparatorDij(): any {
    return (p1: Point, p2: Point) => {
      return p1.c - p2.c;
    };
  }

  private comparatorAstar(): any {
    return (p1: Point, p2: Point) => {
      return p1.fscore - p2.fscore;
    };
  }

  private createPath(paths: any, parent: any): void {
    const actualPath = [];
    let point: Point = parent.dest;
    while (paths.has(point)) {
      actualPath.push(paths.get(point));
      point = paths.get(point);
    }
    while (actualPath.length > 0) {
      parent.paint(actualPath.pop(), CLASSES.p, parent);
    }
  }

  private paint(point: Point, className: any, parent: any): void {

    if (point.x === parent.source.x && point.y === parent.source.y) {
      return;
    }

    setTimeout(() => {
      if (className === CLASSES.p) {
        ++parent.pathCount;
      }
      if (className === CLASSES.v) {
        ++parent.visitedCount;
      }
      point.class = className;
    }, 100);
  }

  private isInValid(x: any, y: any, parent: any, visited: Set<Point>): boolean {
    return x >= parent.rows || y >= parent.cols || x < 0 || y < 0 ||
      visited.has(parent.grid[x][y]) || parent.grid[x][y].v === OBJ_TYPE.OBSTACLE;
  }

  private heuristic(x1: any, y1: any, x2: any, y2: any): any {
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
  }

  highlight(col: Point): any {
    if (this.searchObs && !col.v) {
      col.class = CLASSES.hx;
      return;
    } else if (col.v === OBJ_TYPE.OBSTACLE) {
      return;
    }
    if (this.searchSource) {
      col.class = CLASSES.hs;
    } else if (this.searchDest) {
      col.class = CLASSES.hd;
    }
  }

  removeHighlight(col: Point): void {
    if (this.searchObs && !col.v) {
      col.class = '';
      return;
    } else if (col.v === OBJ_TYPE.OBSTACLE) {
      return;
    }
    if (this.searchSource) {
      col.class = '';
    } else if (this.searchDest) {
      col.class = '';
    }
  }

  fix(col: Point): void {
    if (this.searchSource) {
      this.resetSource();
      this.source = col;
      this.source.class = CLASSES.s;
      this.source.c = 0;
      this.source.gscore = 0;
      this.source.fscore = 0;
      this.source.v = OBJ_TYPE.SOURCE;
    } else if (this.searchDest) {
      this.resetDest();
      this.dest = col;
      this.dest.class = CLASSES.d;
      this.dest.c = Infinity;
      this.dest.gscore = Infinity;
      this.dest.fscore = Infinity;
      this.dest.v = OBJ_TYPE.DEST;
    } else if (this.searchObs) {
        if (col.v === OBJ_TYPE.OBSTACLE) {
          col.v = '';
          col.class = '';
        } else if (!col.v) {
          col.v = OBJ_TYPE.OBSTACLE;
          col.class = CLASSES.x;
        }
    }
    this.searchDest = false;
    this.searchSource = false;
  }

  setSource(): void {
    this.searchSource = !this.searchSource;
    this.searchDest = false;
    this.searchObs = false;
  }

  setDest(): void {
    this.searchDest = !this.searchDest;
    this.searchSource = false;
    this.searchObs = false;
  }

  setObstacle(): void {
    this.searchObs = !this.searchObs;
    this.searchSource = false;
    this.searchDest = false;
  }

  resetSource(): void {
    this.source.class = '';
    this.source.c = Infinity;
    this.source.gscore = Infinity;
    this.source.fscore = Infinity;
    this.source.v = '';
  }

  resetDest(): void {
    this.dest.class = '';
    this.dest.c = Infinity;
    this.dest.gscore = Infinity;
    this.dest.fscore = Infinity;
    this.dest.v = '';
  }
}
