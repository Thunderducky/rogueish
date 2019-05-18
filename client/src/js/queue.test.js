import Queue from './queue';
describe('Normal Queue should work', () => {
    it('should work in it\'s base case', () => {
        const normalQueue = Queue.make();
        expect(normalQueue.length).toBe(0);
        normalQueue.enqueue("test");
        normalQueue.enqueue("test2");
        normalQueue.enqueue("test3");
        expect(normalQueue.length).toBe(3);
        let value = normalQueue.dequeue()
        expect(value).toBe("test");
        value = normalQueue.dequeue()
        expect(value).toBe("test2");

        expect(normalQueue.length).toBe(1);
        value = normalQueue.dequeue()
        expect(value).toBe("test3");
        // extra dequeues shouldn't break it
        value = normalQueue.dequeue()
        expect(value).toBe(null);
        expect(normalQueue.length).toBe(0);
    });
});

describe('Priority Queue should work', () => {
  it('should work in it\'s base case', () => {
    // cass sort ascending
      const priority = (a,b) => {
        return b - a;
      }
      const priorityQueue = Queue.make(priority);
      expect(priorityQueue.length).toBe(0);
      priorityQueue.enqueue(5);
      priorityQueue.enqueue(7);
      priorityQueue.enqueue(2);
      expect(priorityQueue.length).toBe(3);
      let value = priorityQueue.dequeue()
      expect(value).toBe(2);
      value = priorityQueue.dequeue()
      expect(value).toBe(5);

      expect(priorityQueue.length).toBe(1);
      value = priorityQueue.dequeue()
      expect(value).toBe(7);
      // extra dequeues shouldn't break it
      value = priorityQueue.dequeue()
      expect(value).toBe(null);
      expect(priorityQueue.length).toBe(0);
  });
});
