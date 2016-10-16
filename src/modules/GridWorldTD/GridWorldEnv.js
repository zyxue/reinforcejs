import R from '../../lib/r';


var GridWorldEnv = function() {
    this.Rarr = null; // reward array
    this.T = null; // cell types, 0 = normal, 1 = cliff
    this.reset();
};


GridWorldEnv.prototype = {
    reset: function() {

        // hardcoding one gridworld for now
        this.horizontalNumStates = 10;         // number of states on x axis
        this.verticalNumStates = 10;         // number of states on y axis
        this.totalNumStates = this.horizontalNumStates * this.verticalNumStates; // number of states

        // specify some rewards
        let Rarr = R.zeros(this.totalNumStates);
        /* cliffs */
        let T = R.zeros(this.totalNumStates);

        let plusOneIdx = [55];
        for (let i = 0; i < plusOneIdx.length; i++) {
            Rarr[plusOneIdx[i]] = 1;
        }

        let negOneIdx = [54, 64, 65, 85, 86, 37, 33, 67, 57];
        for (let i = 0; i < negOneIdx.length; i++) {
            Rarr[negOneIdx[i]] = -1;
        }

        // make some cliffs
        for (let q = 0; q < 8; q++) {
            let off = (q + 1) * this.horizontalNumStates + 2;
            T[off] = 1;
            Rarr[off] = 0;
        }

        for (let q = 0; q < 6; q++) {
            let off = 4 * this.horizontalNumStates + q + 2;
            T[off] = 1;
            Rarr[off] = 0;
        }

        T[5 * this.horizontalNumStates + 2] = 0;
        Rarr[5 * this.horizontalNumStates + 2] = 0; // make a hole

        this.Rarr = Rarr;
        this.T = T;

    },

    reward: function(s, a, ns) {
        // reward of being in s, taking action a, and ending up in ns
        return this.Rarr[s];
    },

    nextStateDistribution: function(s, a) {
        let ns;
        // given (s,a) return distribution over s' (in sparse form)
        if (this.T[s] === 1) {
            // cliff! oh no!
            // var ns = 0; // reset to state zero (start)
        } else if (s === 55) {
            // agent wins! teleport to start
            ns = this.startState();
            while (this.T[ns] === 1) {
                ns = this.randomState();
            }
        } else {
            // ordinary space
            let nx, ny;
            let x = this.stox(s);
            let y = this.stoy(s);
            if (a === 0) {nx = x - 1; ny = y;}
            if (a === 1) {nx = x; ny = y - 1;}
            if (a === 2) {nx = x; ny = y + 1;}
            if (a === 3) {nx = x + 1; ny = y;}
            ns = nx * this.horizontalNumStates + ny;
            if (this.T[ns] === 1) {
                // actually never mind, this is a wall. reset the agent
                ns = s;
            }
        }
        // gridworld is deterministic, so return only a single next state
        return ns;
    },

    sampleNextState: function(s, a) {
        // gridworld is deterministic, so this is easy
        let ns = this.nextStateDistribution(s, a);
        let r = this.Rarr[s]; // observe the raw reward of being in s, taking a, and ending up in ns
        r -= 0.01; // every step takes a bit of negative reward
        let out = {
            'ns': ns,
            'r': r
        };
        if (s === 55 && ns === 0) {
            // episode is over
            out.reset_episode = true;
        }
        return out;
    },

    allowedActions: function(s) {
        let x = this.stox(s);
        let y = this.stoy(s);
        let as = [];
        if (x > 0) {
            as.push(0);
        }
        if (y > 0) {
            as.push(1);
        }
        if (y < this.horizontalNumStates - 1) {
            as.push(2);
        }
        if (x < this.verticalNumStates - 1) {
            as.push(3);
        }
        return as;
    },

    randomState: function() {
        return Math.floor(Math.random() * this.totalNumStates);
    },

    startState: function() {
        return 0;
    },

    getNumStates: function() {
        return this.totalNumStates;
    },

    getMaxNumActions: function() {
        return 4;
    },

    // private functions
    stox: function(s) {
        return Math.floor(s / this.horizontalNumStates);
    },

    stoy: function(s) {
        return s % this.horizontalNumStates;
    },

    xytos: function(x, y) {
        return x * this.horizontalNumStates + y;
    }
};


export default GridWorldEnv;
