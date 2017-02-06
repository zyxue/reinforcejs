import GridWorld from './Env';


it('too big terminalStateId is reduced to the last cell', () => {
    const gw = new GridWorld({
        numRows: 2,
        numCols: 3,
        terminalStateId: 100,
    });
    expect(gw.terminalStateId).toBe(5);
});


function initGridWorld() {
    // a 2x3 toy example

    // Generated with http://asciiflow.com/
    // +--------------+
    // |S  0|///1|T  2|
    // |    |////|    |
    // +--------------+
    // |   3|   4|   5|
    // |    |    |    |
    // +----+----+-----

    return new GridWorld({
        numRows: 2,
        numCols: 3,
        cliffStateIds: [1],
        startingStateId: 0,
        terminalStateId: 2,
        stepReward: -0.01,
        terminalReward: 1
    });
}

it('proper initialization', () => {
    const gw = initGridWorld();
    expect(gw.numRows).toBe(2);
    expect(gw.numCols).toBe(3);
    expect(gw.numCells).toBe(6);
    expect(gw.cliffStateIds).toEqual([1]);
    expect(gw.startingStateId).toBe(0);
    expect(gw.terminalStateId).toBe(2);
    expect(gw.stepReward).toBe(-0.01);
    expect(gw.terminalReward).toBe(1);
});

describe('proper reset after initialization', () => {
    const gw = initGridWorld();
    it('6 cells in total', () => {
        expect(gw.states.length).toBe(6);
    });

    it('test a non-cliff state at the bottom left corner', () => {
        expect(gw.states[3]).toEqual({
            id: 3,
            x: 0,
            y: 1,
            reward: 0,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })

    it('test a non-cliff state at the bottom right corner', () => {
        expect(gw.states[5]).toEqual({
            id: 5,
            x: 2,
            y: 1,
            reward: 0,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })


    it('test a non-cliff state to the bottom', () => {
        expect(gw.states[4]).toEqual({
            id: 4,
            x: 1,
            y: 1,
            reward: 0,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })

    it('test a cliff state', () => {
        expect(gw.states[1]).toEqual({
            id: 1,
            x: 1,
            y: 0,
            reward: 0,
            isCliff: true,
            allowedActions: []
        });
    })

    it('correct startingState', () => {
        expect(gw.states[gw.startingStateId]).toEqual({
            id: 0,
            x: 0,
            y: 0,
            reward: 0,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })

    it('correct terminalState', () => {
        expect(gw.states[gw.terminalStateId]).toEqual({
            id: 2,
            x: 2,
            y: 0,
            reward: 1,
            isCliff: false,
            allowedActions: [0, 1, 2, 3]
        });
    })
});