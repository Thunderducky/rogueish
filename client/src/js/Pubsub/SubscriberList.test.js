import SubscriberList from './SubscriberList';
describe('Fulfill basic Subscriber Operations and mantain the order', () => {
    it('should be creatable', () => {
      expect(new SubscriberList()).toBeTruthy();
    });
    it('should allow us to subscribe', () => {
      const sl = new SubscriberList();
      expect(sl.length).toBe(0);
      const testFn = jest.fn();
      sl.subscribe((message, topic) => {
        // NOTE: this function should never be called in this test
        testFn(message, topic);
      });
      expect(sl.length).toBe(1);
      expect(testFn).not.toHaveBeenCalled();
    });
    it('should notify subscribers', () => {
      const sl = new SubscriberList();
      const testFn = jest.fn();
      const MESSAGE = {text: "testMessage"};
      const TOPIC = "testTopic";
      sl.subscribe((message, topic) => {
        // NOTE: this function should never be called in this test
        expect(message.text).toBe("testMessage");
        expect(topic).toBe("testTopic");
        testFn();
      });
      sl.notify(MESSAGE, TOPIC);
      expect(testFn).toHaveBeenCalled();
    });
    it('should allow us to subscribe once', () => {
      const sl = new SubscriberList();
      const testFn = jest.fn();
      const MESSAGE = {text: "testMessage"};
      const TOPIC = "testTopic";
      sl.subscribeOnce((message, topic) => {
        // NOTE: this function should never be called in this test
        expect(message.text).toBe("testMessage");
        expect(topic).toBe("testTopic");
        testFn();
      });
      expect(sl.length).toBe(1);
      sl.notify(MESSAGE, TOPIC);
      expect(testFn).toHaveBeenCalled();
      expect(sl.length).toBe(0);
    });
    it('should maintain the priority of subscribers', () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const fn3 = jest.fn();

      const subscriber1 = {
        priority: 0,
        fn: () => {
          fn1();
        }
      }
      const subscriber2 = {
        priority: 1,
        fn: () => {
          expect(fn1).toHaveBeenCalled();
          fn2();
        }
      }
      const subscriber3 = {
        priority: 2,
        fn: () => {
          expect(fn1).toHaveBeenCalled();
          expect(fn2).toHaveBeenCalled();
          fn3();
        }
      }
      const TOPIC = "testTopic";
      const MESSAGE = "eh";
      const sl = new SubscriberList();
      sl.subscribe(subscriber2.fn, subscriber2.priority);
      sl.subscribe(subscriber3.fn, subscriber3.priority);
      sl.subscribe(subscriber1.fn, subscriber1.priority);
      sl.notify(MESSAGE, TOPIC);
      expect(fn3).toHaveBeenCalled();
    });

    it('should maintain the priority of subscribers, even with unsubscribing', () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const fn3 = jest.fn();

      const subscriber1 = {
        priority: 0,
        fn: () => {
          fn1();
        }
      }
      const subscriber2 = {
        priority: 1,
        fn: () => {
          expect(fn1).toHaveBeenCalled();
          fn2();
        }
      }
      const subscriber3 = {
        priority: 2,
        fn: () => {
          expect(fn1).toHaveBeenCalled();
          expect(fn2).not.toHaveBeenCalled();
          fn3();
        }
      }
      const TOPIC = "testTopic";
      const MESSAGE = "eh";
      const sl = new SubscriberList();
      const sub2 = sl.subscribe(subscriber2.fn, subscriber2.priority);
      sl.subscribe(subscriber3.fn, subscriber3.priority);
      sl.subscribe(subscriber1.fn, subscriber1.priority);
      sl.unsubscribe(sub2);
      sl.notify(MESSAGE, TOPIC);
      expect(fn3).toHaveBeenCalled();
    });

    it('should unsubscribe properly', () => {
      const sl = new SubscriberList();
      const testFn = jest.fn();
      const MESSAGE = {text: "testMessage"};
      const TOPIC = "testTopic";
      const subId = sl.subscribe((message, topic) => {
        // NOTE: this function should never be called in this test
        expect(message.text).toBe("testMessage");
        expect(topic).toBe("testTopic");
        testFn();
      });
      sl.notify(MESSAGE, TOPIC);
      sl.notify(MESSAGE, TOPIC);
      sl.unsubscribe(subId);
      sl.notify(TOPIC, MESSAGE);
      expect(testFn).toHaveBeenCalledTimes(2);
    });
    it('should be able to call subscribers, even if empty', () => {
      expect(() => {
        const sl = new SubscriberList();
        const MESSAGE = {text: "testMessage"};
        const TOPIC = "testTopic";
        sl.notify(MESSAGE, TOPIC);
      }).not.toThrow();
    });
    it('should be able to clear all subscribers', () => {
      const sl = new SubscriberList();
      const testFn = jest.fn();
      const MESSAGE = {text: "testMessage"};
      const TOPIC = "testTopic";
      const subId = sl.subscribe((message, topic) => {
        // NOTE: this function should never be called in this test
        expect(message.text).toBe("testMessage");
        expect(topic).toBe("testTopic");
        testFn();
      });
      sl.clear();
      sl.notify(MESSAGE, TOPIC);
      expect(testFn).toHaveBeenCalledTimes(0);
    });

    // it('should be disable-able', () => {});
    // it('should be reenable-able', () => {});
});
