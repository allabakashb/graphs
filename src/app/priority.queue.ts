
export class PriorityQueue {

  comparator: any;
  private items: any = [];
  private size: any = 0;

  constructor(comparator: any) {

    this.comparator = comparator;
  }

  private static parent(index: any): any {
     return Math.floor((index - 1) / 2);
  }

  private static leftChild(index: any): any {
    return Math.floor(2 * index + 1);
  }

  private static rightChild(index): any {
    return Math.floor(2 * index + 2);
  }

  private static hasParent(index: any): boolean {
    return index > 0;
  }

  private hasLeftChild(index: any): boolean {
    return PriorityQueue.leftChild(index) < this.size;
  }

  private hasRightChild(index: any): boolean {
    return PriorityQueue.rightChild(index) < this.size;
  }

  private swap(index1, index2): void {
    const temp = this.items[index1];
    this.items[index1] = this.items[index2];
    this.items[index2] = temp;
  }

  private heapifyUp(index): void {
    while (PriorityQueue.hasParent(index)) {
      const parent = PriorityQueue.parent(index);
      if (this.comparator(this.items[index], this.items[parent]) < 0) {
        this.swap(index, PriorityQueue.parent(index));
      } else {
        break;
      }
      index = parent;
    }
  }

  private heapifyDown(index): void {
    while (this.hasLeftChild(index)) {
      let min = PriorityQueue.leftChild(index);
      if (this.hasRightChild(index) &&
        this.comparator(this.items[PriorityQueue.rightChild(index)], this.items[min]) < 0) {
        min = PriorityQueue.rightChild(index);
      }
      if (this.comparator(this.items[min], this.items[index]) < 0) {
        this.swap(min, index);
      } else {
        break;
      }
      index = min;
    }
  }

  public poll(): any {
    const item = this.items[0];
    this.items[0] = this.items[--this.size];
    this.heapifyDown(0);
    return item;
  }

  public add(item: any): void {
    this.items[this.size++] = item;
    this.heapifyUp(this.size - 1);
  }

  public isEmpty(): boolean {
    return this.size === 0;
  }
}
