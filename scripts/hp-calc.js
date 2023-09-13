const allInputs = document.querySelector('#all-inputs');

const hitpointsOutput = document.querySelector('#hitpoints-output');
const bannedRaceClassComboWarning = document.querySelector('#banned-race-class');

const profile = {
  playerRace: "human",
  racialHitDie: 10,
  playerClass: "warrior",
  classDieBonus: 10,
  conScore: 0,
  conHealthBonus: 0,
  playerLevel: 1,
  healthSkill: 0
};

const raceParser = {
  "human": 10,
  "half-elf": 10,
  "elf": 9,
  "hobbit": 8,
  "gnome": 9,
  "dwarf": 11,
  "half-orc": 11,
  "half-troll": 12,
  "dunadan": 10,
  "high-elf": 10,
  "yeek": 8,
  "goblin": 10,
  "ent": 14,
  "draconian": 12,
  "kobold": 8,
  "dark-elf": 10,
  "vampire": 11,
  "enlightened-maia": 11,
  "corrupted-maia": 11
};

const classParser = {
  "warrior": 10,
  "istar": 0,
  "priest": 5,
  "rogue": 5,
  "mimic": 6,
  "archer": 5,
  "paladin": 8,
  "ranger": 7,
  "adventurer": 6,
  "druid": 5,
  "shaman": 3,
  "runemaster": 4,
  "mindcrafter": 6,
  "death-knight": 8,
  "hell-knight": 8
};

const constitutionParser = {
  "three": -5,
  "four": -4,
  "five": -3,
  "six": -2,
  "seven": -1,
  "eight": -1,
  "nine": 0,
  "ten": 0,
  "eleven": 0,
  "twelve": 0,
  "thirteen": 1,
  "fourteen": 1,
  "fifteen": 1,
  "sixteen": 2,
  "seventeen": 2,
  "eighteen": 3,
  "eighteen-ten": 4,
  "eighteen-twenty": 5,
  "eighteen-thirty": 6,
  "eighteen-forty": 7,
  "eighteen-fifty": 8,
  "eighteen-sixty": 9,
  "eighteen-seventy": 10,
  "eighteen-eighty": 11,
  "eighteen-ninety": 12,
  "eighteen-one-hundred": 13,
  "eighteen-one-hundred-ten": 14,
  "eighteen-one-hundred-twenty": 15,
  "eighteen-one-hundred-thirty": 16,
  "eighteen-one-hundred-forty": 17,
  "eighteen-one-hundred-fifty": 18,
  "eighteen-one-hundred-sixty": 19,
  "eighteen-one-hundred-seventy": 20,
  "eighteen-one-hundred-eighty": 21,
  "eighteen-one-hundred-ninety": 22,
  "eighteen-two-hundred": 23,
  "eighteen-two-hundred-ten": 24,
  "eighteen-two-hundred-twenty": 25
};

const parseSelector = {
  "racialHitDie": raceParser,
  "classDieBonus": classParser,
  "conHealthBonus": constitutionParser
};

const derivativeProperties = {
  "playerRace": "racialHitDie",
  "playerClass": "classDieBonus",
  "conScore": "conHealthBonus"
}

const patternSelector = {
  "playerLevel": /^[1-9][0-9]?$/,
  "healthSkill": /^(([1-4]?\d(.\d\d?\d?)?)|(50(.00?0?)?))$/
};

const classBans = {
  "human": ["death-knight", "hell-knight"],
  "half-elf": ["death-knight", "hell-knight"],
  "elf": ["death-knight", "hell-knight"],
  "hobbit": ["death-knight", "hell-knight"],
  "gnome": ["death-knight", "hell-knight"],
  "dwarf": ["death-knight", "hell-knight"],
  "half-orc": ["death-knight", "hell-knight"],
  "half-troll": ["death-knight", "hell-knight"],
  "dunadan": ["death-knight", "hell-knight"],
  "high-elf": ["death-knight", "hell-knight"],
  "yeek": ["death-knight", "hell-knight"],
  "goblin": ["death-knight", "hell-knight"],
  "ent": ["rogue", "archer", "death-knight", "hell-knight"],
  "draconian": ["death-knight", "hell-knight"],
  "kobold": ["death-knight", "hell-knight"],
  "dark-elf": ["paladin", "death-knight", "hell-knight"],
  "vampire": ["priest", "mimic", "paladin", "druid", "shaman", "hell-knight"],
  "enlightened-maia": ["warrior", "archer", "death-knight", "hell-knight"],
  "corrupted-maia": ["warrior", "archer", "death-knight"]
};

const averageRoll = function(levels, dieSize) {
  return Math.floor((dieSize + 1) * (levels - 1) / 2) + dieSize;
}

const getPlayerHPEff = function(level, dieSize) {
  const averageRollWithDie = level => averageRoll(level, dieSize);
  if (level <= 50) {
    return averageRollWithDie(level); /* the usual way */
  } else {
    /* reduce post-king gain */
    let playerHPEff = averageRollWithDie(50);
    if (level <= 70) {
      return playerHPEff + Math.floor((averageRollWithDie(level) - averageRollWithDie(50)) / 2);
    } else {
      playerHPEff += Math.floor((averageRollWithDie(70) - averageRollWithDie(50)) / 2);
      if (level <= 85) {
        return playerHPEff + Math.floor((averageRollWithDie(level) - averageRollWithDie(70)) / 3);
      } else {
        playerHPEff += Math.floor((averageRollWithDie(85) - averageRollWithDie(70)) / 3);
        return playerHPEff + Math.floor((averageRollWithDie(level) - averageRollWithDie(85)) / 4);
      }
    }
  }
}

const recompute = function(p) {

  const level = p.playerLevel;
  const hitDie = p.racialHitDie + p.classDieBonus;
  const playerHPEff = getPlayerHPEff(level, hitDie);

  const bonusCap = Math.floor((level + 5) * (level + 5) / 100);
  const bonus = p.conHealthBonus > bonusCap ? bonusCap : p.conHealthBonus;
  const afterBonus = Math.floor((playerHPEff * 2 * (20 + bonus)) / 45);

  const howWeak = (576 - hitDie * hitDie) + 105;
  const cubicScalingFactor = (level <= 50) ? Math.floor(level * level * level / 2500) : 50;
  const weaklingBoost = Math.floor((cubicScalingFactor * howWeak) / 105);

  const fromHealthSkill = Math.floor(p.healthSkill * 2);

  const playerFormHP = afterBonus + weaklingBoost + fromHealthSkill;

  const corruptedBonus = ((p.playerRace === "corrupted-maia") && level >= 20) ?
    (level <= 50 ? (level - 20) * 2 : 60 + (level - 50)) :
    0;

  return playerFormHP + corruptedBonus;

};

const displayValueIn = function(value, container) {
  container.textContent = value;
}

const clearDisplay = function(container) {
  container.textContent = "";
}

const updateOutput = function() {
  
  const playerHitpoints = recompute(profile);
  displayValueIn(playerHitpoints, hitpointsOutput);

  const banned = classBans[profile.playerRace].includes(profile.playerClass);
  if (banned) {
    bannedRaceClassComboWarning.removeAttribute("hidden");
  } else {
    bannedRaceClassComboWarning.setAttribute("hidden", "");
  }

};

updateOutput();

allInputs.addEventListener('change', e => {
  const changedFieldID = e.target.id;
  const changedFieldType = e.target.type;
  const changedFieldValue = e.target.value;
  if (changedFieldType === 'select-one') {
    profile[changedFieldID] = changedFieldValue;
    const derivativeProperty = derivativeProperties[changedFieldID];
    profile[derivativeProperty] = parseSelector[derivativeProperty][changedFieldValue];
  } else if (changedFieldType === 'checkbox') {
    profile[changedFieldID] = e.target.checked;
  } else if (changedFieldType === 'number') {
    profile[changedFieldID] = Number(changedFieldValue);
  } else {
    console.log(changedFieldType);
    console.log(changedFieldValue);
  }
  updateOutput();
});

allInputs.addEventListener('input', e => {
  const changedFieldID = e.target.id;
  if (e.target.type === 'text') {
    const validInput = patternSelector[changedFieldID].test(e.target.value);
    if (validInput) {
      e.target.removeAttribute("invalid");
      profile[changedFieldID] = Number(e.target.value);
    } else {
      e.target.setAttribute("invalid", "");
    }
  }
  updateOutput();
});
