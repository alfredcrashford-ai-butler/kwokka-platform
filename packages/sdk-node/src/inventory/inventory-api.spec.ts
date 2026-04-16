import { AuthAPI } from '../auth';
import { InventoryAPI } from './inventory-api';

describe(InventoryAPI, () => {
  let client: InventoryAPI;

  it('exists', () => {
    expect(InventoryAPI).toBeTruthy();
  });

  beforeEach(() => {
    const config = { clientId: '2', secret: '3' };
    client = new InventoryAPI(config, new AuthAPI(config));
  });

  describe(InventoryAPI.prototype.getItemByKey, () => {
    it('exists', () => expect(client.getItemByKey).toBeTruthy());
  });

  describe(InventoryAPI.prototype.getItemById, () => {
    it('exists', () => expect(client.getItemById).toBeTruthy());
  });

  describe(InventoryAPI.prototype.getDecorationById, () => {
    it('exists', () => expect(client.getDecorationById).toBeTruthy());
  });

  describe(InventoryAPI.prototype.getDecorationByKey, () => {
    it('exists', () => expect(client.getDecorationByKey).toBeTruthy());
  });

  describe(InventoryAPI.prototype.giveItemInstanceByItemId, () => {
    it('exists', () => expect(client.giveItemInstanceByItemId).toBeTruthy());
  });

  describe(InventoryAPI.prototype.takeItemInstanceByItemId, () => {
    it('exists', () => expect(client.takeItemInstanceByItemId).toBeTruthy());
  });

  describe(InventoryAPI.prototype.giveItemInstanceByItemKey, () => {
    it('exists', () => expect(client.giveItemInstanceByItemKey).toBeTruthy());
  });

  describe(InventoryAPI.prototype.takeItemInstanceByItemKey, () => {
    it('exists', () => expect(client.takeItemInstanceByItemKey).toBeTruthy());
  });

  describe(InventoryAPI.prototype.getItemInstanceByItemId, () => {
    it('exists', () => expect(client.getItemInstanceByItemId).toBeTruthy());
  });

  describe(InventoryAPI.prototype.getItemInstanceByItemKey, () => {
    it('exists', () => expect(client.getItemInstanceByItemKey).toBeTruthy());
  });

  // TODO: add tests https://mygameapp.atlassian.net/browse/KWOKKA-395
});
