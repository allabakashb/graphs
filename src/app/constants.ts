export const CLASSES = {
  x: 'red-bg',
  s: 'source',
  d: 'dest',
  v: 'visited',
  p: 'path',
  hs: 'h-source',
  hd: 'h-dest',
  hx: 'h-red-bg',
  mr: 'mr-10'
};

export const ALGO_TYPES = {
  ASTAR: 'astar',
  DIJ: 'dij',
  BFS: 'bfs',
  DFS: 'dfs'
};

export const OBJ_TYPE = {
  SOURCE: 's',
  DEST: 'd',
  OBSTACLE: 'x',
  PATH: 'p',
  VISITED: 'v'
};

export const NEIGHBORS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];

