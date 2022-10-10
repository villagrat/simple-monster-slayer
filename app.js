// this f() will never access vue-controlled props or be called from inside HTML
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  // gets merged into a behind the scenes managed global OBJ
  data() {
    // return the OBJ that holds our data
    return {
      playerHealth: 100,
      monsterHealth: 100,
      /* When should something be a data property on our Vue app?:
      1. will need access to it inside the Vue instance
      2. Vue needs to be aware of when it changes
      */
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  // use 'this' keyword as we are in the Vue instance for computed properties
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      // Draw
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      }
      // Player lost
      else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      // Draw
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      }
      // Monster lost
      else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
  methods: {
    // reset to init state
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.logMessages = [];
    },
    // causes between 5 & 12 dmg
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      // we have access to our methods
      this.attackPlayer();
    },
    // causes between 15 & 8 dmg
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attack", attackValue);
    },
    // causes between 10 & 25 dmg
    // available once every 3 turns
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    // player health has 100 HP as upper limit
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      if ((this.playerHealth += healValue > 100)) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      // push adds @ end of arr[]
      // unshift adds @ beggining of the arr[]
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
