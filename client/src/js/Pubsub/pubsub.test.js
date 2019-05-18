import PUBSUB from './pubsub';
describe('Can create a pubsub', () => {
    it('should be creatable', () => {
      expect(new PUBSUB()).toBeTruthy();
    });
    // it('should allow us to subscribe to topics', () => {
    //   expect(new PUBSUB()).toBeTruthy();
    // });
    // it('should allow us to post to those topics', () => {
    //   expect(new PUBSUB()).toBeTruthy();
    // });
    // it('should allow us to post to empty subscribers', () => {
    //   expect(new PUBSUB()).toBeTruthy();
    // });
    // it('should only have subscribers from the specific topic we posted to run', () => {
    //   expect(new PUBSUB()).toBeTruthy();
    // });
    // it('should let us unsubscribe', () => {
    //   expect(new PUBSUB()).toBeTruthy();
    // });
    // it('should let us clear a list', () => {
    //   expect(new PUBSUB()).toBeTruthy();
    // });
});
