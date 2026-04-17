import { InteractionCard } from './interaction-card';

function getInstance() {
  const InlineClass = class extends InteractionCard {
    public interactionDoneEffect = jest.fn();

    public canInteract = jest.fn();

    public interactCard = jest.fn();

    public isInteractionDone = jest.fn();
    public applyPenalty = jest.fn();
  };

  return new InlineClass();
}

describe('InteractionCard', () => {
  it('exists', () => {
    expect(InteractionCard).toBeTruthy();
  });

  describe('endTurnEffect()', () => {
    it('exists', () => {
      const interactionCard = getInstance();

      expect(interactionCard.endTurnEffect).toBeTruthy();
    });
  });
});
