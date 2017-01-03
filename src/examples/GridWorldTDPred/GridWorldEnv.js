import R from '../../lib/Recurrent-js';


var GridWorld = function({numRows=5, numCols=5}={}) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.reset();
};


GridWorld.prototype = {
    reset: function() {
        let numCells = this.numCells = this.numRows * this.numCols;

        this.states = [];
        for (let ri = 0; ri < this.numRows; ri++) {
            for (let ci = 0; ci < this.numCols; ci++) {
                let id = this.xytos(ci, ri);
                this.states.push({
                    id: id,
                    x: ci,
                    y: ri,
                    reward: 0,
                    isCliff: false,
                    allowedActions: this.getAllowedActions(id),
                    V: 0,       // init value of the state
                    histZ: [],  // store etrace history 
                    Z: 0        // current eligibility trace
                });
            }
        }

        // default starting state
        this.startingState = this.states[0];
        // default terminal state
        this.terminalState = this.states[Math.floor(this.numCells / 2)];
        this.terminalState.reward = 1;

        // add some random cliff
        for (let i=0; i<numCells * 0.3; i++) {
            let ri = R.randi(0, numCells);
            if (!this.isTerminal(this.states[ri]) && ri !== this.startingState.id) {
                this.states[ri].isCliff = true;
            }
        }

        // add some rewards
        for (let i=0; i<numCells * 0.3; i++) {
            let ri = R.randi(0, numCells);
            if (!this.isTerminal(this.states[ri]) && ri !== this.startingState.id) {
                this.states[ri].isCliff = false;
                if (Math.random() < 0.2) {
                    this.states[ri].reward = 1;
                } else {
                    this.states[ri].reward = -1;
                }
            }
        }
    },

    calcReward: function(s0, action, s1) {
        // reward of being in s, taking action a, and ending up in ns
        let reward = s0.reward;
        // every non-exit step takes a bit of negative reward
        if (!this.isTerminal(s0)) reward -= 0.01;
        return reward;
    },

    calcNextState: function(s0, a0) {
        // gridworld is deterministic, so this is easy
        let s1;

        if (this.isTerminal(s0)) {
            s1 = this.initState();
        } else {
            let x = this.stox(s0.id);
            let y = this.stoy(s0.id);
            let nx, ny;
            if (a0 === 0) {nx = x - 1; ny = y;}
            if (a0 === 1) {nx = x; ny = y - 1;}
            if (a0 === 2) {nx = x + 1; ny = y;}
            if (a0 === 3) {nx = x; ny = y + 1;}
            // console.debug(a0, x, y, nx, ny);
            let s1Id = this.xytos(nx, ny);
            // console.debug(s1Id, this.states);
            s1 = this.states[s1Id];
            if (s1.isCliff) {
                s1 = s0;
            }
        }
        return s1;
    },

    gotoNextState: function(s0, a0) {
        let s1 = this.calcNextState(s0, a0);
        let reward = this.calcReward(s0, a0, s1);
        return [reward, s1];
    },

    isTerminal: function(state) {
        return state.id === this.terminalState.id ? true : false;
    },

    getAllowedActions: function(stateId) {
        // var actionMapping = {
        //     0: '←',
        //     1: '↑',
        //     2: '↓',
        //     3: '→'
        // };

        let x = this.stox(stateId);
        let y = this.stoy(stateId);
        let as = [];
        if (x > 0) {
            as.push(0);
        }
        if (y > 0) {
            as.push(1);
        }
        if (x < this.numCols - 1) {
            as.push(2);
        }
        if (y < this.numRows - 1) {
            as.push(3);
        }
        return as;
    },

    randomState: function() {
        return this.states[Math.floor(Math.random() * this.numCells)];
    },

    initState: function() {
        return this.startingState;
    },

    getNumStates: function() {
        return this.numCells;
    },

    // private functions
    stox: function(s) {
        return s % this.numCols;
    },

    stoy: function(s) {
        return Math.floor(s / this.numCols);
    },

    xytos: function(x, y) {
        return x + y * this.numCols;
    }
};


export default GridWorld;
