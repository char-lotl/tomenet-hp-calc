// Assigning names to DOM objects corresponding to key page elements.
const allInputs = document.querySelector('#all-inputs');

const hitpointsOutput = document.querySelector('#hitpoints-output');
const mimicHitpointsOutput = document.querySelector('#mimic-hitpoints-output');

// Default character profile values.
const profile = {
  playerRace: "human",
  racialHitDie: 10,
  playerClass: "warrior",
  classDieBonus: 10,
  conScore: 0,
  conHealthBonus: 0,
  playerLevel: 1,
  healthSkill: 0,
  natureSkill: 0,
  mimicHitDice: 1,
  mimicHitDieSize: 1,
  mimicRlvl: 1
};

// Pairs character ancestries with hit dice.
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

// Pairs character classes with hit die modifiers.
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

// Pairs constitution scores with their associated HP adjustment score.
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

// Pairs selector element names with the objects that parse their selections into meaningful values.
const parseSelector = {
  "racialHitDie": raceParser,
  "classDieBonus": classParser,
  "conHealthBonus": constitutionParser
};

// Associates dependent properties with the directly modifiable character property they depend on.
const derivativeProperties = {
  "playerRace": "racialHitDie",
  "playerClass": "classDieBonus",
  "conScore": "conHealthBonus"
}

// Associates entry fields with their corresponding validation regexes.
const patternSelector = {
  "playerLevel": /^[1-9][0-9]?$/,                             // 1 to 99
  "healthSkill": /^([1-4]?\d(\.\d\d?\d?)?|50(.00?0?)?)$/,     // 0.000 to 50.000, decimals optional
  "natureSkill": /^([1-4]?\d(\.\d\d?\d?)?|50(.00?0?)?)$/,     // ditto
  "mimicHitDice": /^(400|[1-3][0-9][0-9]|[1-9][0-9]?)$/,      // 1 to 400
  "mimicHitDieSize": /^(300|[1-2][0-9][0-9]|[1-9][0-9]?)$/,   // 1 to 300
  "mimicRlvl": /^(9[0-8]?|[1-8][0-9]?|0)$/                    // 1 to 98
};

// Array of all monsters in TomeNET that are valid shapeshifting targets,
// together with a relevant fragment of their data.
// Format: index, name, char, hit dice, hit die size, monster level.
// TODO: Make mimicry forms inputtable by name.
const monsterdex = [
  [1, "Filthy street urchin", "t", 1, 4, 0],
  [2, "Scrawny cat", "f", 1, 2, 0],
  [3, "Sparrow", "B", 1, 1, 0],
  [4, "Chaffinch", "B", 1, 1, 1],
  [5, "Wild rabbit", "r", 1, 2, 1],
  [6, "Woodsman", "t", 3, 3, 1],
  [7, "Scruffy little dog", "C", 1, 3, 0],
  [9, "Blubbering idiot", "t", 1, 2, 0],
  [10, "Boil-covered wretch", "t", 1, 2, 0],
  [11, "Village idiot", "t", 4, 4, 0],
  [12, "Pitiful-looking beggar", "t", 1, 4, 0],
  [13, "Mangy-looking leper", "t", 1, 1, 0],
  [14, "Agent of the black market", "t", 2, 8, 0],
  [15, "Singing, happy drunk", "t", 2, 3, 0],
  [16, "Aimless-looking merchant", "t", 3, 3, 0],
  [17, "Mean-looking mercenary", "t", 5, 8, 0],
  [18, "Battle-scarred veteran", "t", 7, 8, 0],
  [20, "Grey mold", "m", 1, 2, 1],
  [21, "Large white snake", "J", 3, 6, 1],
  [22, "Grey mushroom patch", ",", 1, 2, 1],
  [23, "Newt", "R", 2, 6, 1],
  [24, "Giant white centipede", "c", 3, 5, 1],
  [25, "White icky thing", "i", 2, 5, 1],
  [26, "Clear icky thing", "i", 2, 5, 1],
  [27, "Giant white mouse", "r", 1, 3, 1],
  [28, "Large brown snake", "J", 4, 6, 1],
  [29, "Small kobold", "k", 2, 7, 1],
  [30, "Kobold", "k", 3, 7, 2],
  [31, "White worm mass", "w", 4, 4, 1],
  [32, "Floating eye", "e", 3, 6, 1],
  [33, "Rock lizard", "R", 3, 4, 1],
  [34, "Grid bug", "I", 2, 4, 1],
  [35, "Jackal", "C", 1, 4, 1],
  [36, "Soldier ant", "a", 2, 5, 1],
  [37, "Fruit bat", "b", 1, 6, 1],
  [38, "Insect swarm", "I", 1, 5, 1],
  [40, "Shrieker mushroom patch", ",", 1, 1, 2],
  [41, "Blubbering icky thing", "i", 5, 6, 2],
  [42, "Metallic green centipede", "c", 4, 4, 3],
  [43, "Novice warrior", "p", 9, 4, 2],
  [44, "Novice rogue", "p", 8, 4, 2],
  [45, "Novice priest", "p", 7, 4, 2],
  [46, "Novice mage", "p", 6, 4, 2],
  [47, "Yellow mushroom patch", ",", 1, 1, 2],
  [48, "White jelly", "j", 8, 8, 2],
  [49, "Giant black ant", "a", 3, 6, 2],
  [50, "Salamander", "R", 4, 6, 2],
  [51, "White harpy", "H", 2, 5, 2],
  [52, "Blue yeek", "y", 2, 6, 2],
  [56, "Giant green frog", "R", 2, 8, 2],
  [58, "Green worm mass", "w", 6, 4, 2],
  [59, "Large yellow snake", "J", 4, 8, 2],
  [60, "Cave spider", "S", 2, 6, 2],
  [61, "Crow", "B", 3, 5, 2],
  [62, "Wild cat", "f", 3, 5, 2],
  [64, "Green ooze", "j", 3, 4, 3],
  [65, "Poltergeist", "G", 2, 5, 3],
  [66, "Yellow jelly", "j", 10, 8, 3],
  [67, "Metallic blue centipede", "c", 4, 5, 4],
  [68, "Raven", "B", 4, 5, 4],
  [69, "Giant white louse", "I", 1, 1, 3],
  [70, "Giant yellow centipede", "c", 3, 6, 2],
  [71, "Black naga", "n", 6, 8, 3],
  [72, "Spotted mushroom patch", ",", 1, 1, 3],
  [73, "Silver jelly", "j", 10, 8, 3],
  [74, "Scruffy-looking hobbit", "h", 3, 5, 3],
  [75, "Giant white ant", "a", 3, 6, 3],
  [76, "Yellow mold", "m", 8, 8, 3],
  [77, "Metallic red centipede", "c", 4, 8, 5],
  [78, "Yellow worm mass", "w", 4, 8, 3],
  [79, "Clear worm mass", "w", 4, 4, 3],
  [80, "Radiation eye", "e", 6, 6, 3],
  [81, "Yellow light", "*", 2, 6, 4],
  [82, "Cave lizard", "R", 3, 6, 4],
  [83, "Novice ranger", "p", 6, 8, 4],
  [84, "Blue jelly", "j", 12, 8, 4],
  [85, "Creeping copper coins", "$", 7, 24, 4],
  [86, "Giant white rat", "r", 2, 2, 4],
  [87, "Snotling", "o", 5, 5, 4],
  [88, "Swordfish", "~", 4, 7, 4],
  [89, "Blue worm mass", "w", 5, 8, 4],
  [90, "Large grey snake", "J", 6, 8, 4],
  [91, "Skeleton kobold", "s", 5, 8, 5],
  [93, "Novice mage", "p", 6, 4, 6],
  [94, "Green naga", "n", 9, 8, 5],
  [95, "Giant leech", "w", 6, 8, 5],
  [96, "Barracuda", "~", 6, 8, 5],
  [97, "Novice paladin", "p", 6, 8, 4],
  [98, "Zog", "h", 13, 9, 5],
  [99, "Blue ooze", "j", 3, 4, 5],
  [100, "Green glutton ghost", "G", 3, 4, 5],
  [101, "Green jelly", "j", 22, 8, 5],
  [102, "Large kobold", "k", 13, 9, 5],
  [103, "Grey icky thing", "i", 4, 8, 5],
  [104, "Disenchanter eye", "e", 7, 8, 5],
  [105, "Red worm mass", "w", 5, 8, 5],
  [106, "Copperhead snake", "J", 4, 6, 5],
  [107, "Death sword", "|", 6, 6, 6],
  [108, "Purple mushroom patch", ",", 1, 1, 6],
  [109, "Novice priest", "p", 7, 4, 6],
  [110, "Novice warrior", "p", 9, 4, 6],
  [111, "Nibelung", "h", 8, 4, 6],
  [113, "Brown mold", "m", 15, 8, 6],
  [114, "Giant brown bat", "b", 3, 8, 6],
  [115, "Rat-thing", "r", 9, 9, 6],
  [116, "Novice rogue", "p", 8, 4, 6],
  [117, "Creeping silver coins", "$", 12, 24, 6],
  [118, "Snaga", "o", 8, 8, 6],
  [119, "Rattlesnake", "J", 6, 7, 6],
  [120, "Giant slug", "w", 12, 9, 6],
  [121, "Giant pink frog", "R", 5, 8, 7],
  [122, "Dark-elf", "h", 7, 10, 7],
  [123, "Zombified kobold", "z", 6, 8, 7],
  [124, "Crypt creep", "s", 6, 8, 7],
  [125, "Rotting corpse", "z", 8, 8, 8],
  [126, "Cave orc", "o", 11, 9, 7],
  [127, "Wood spider", "S", 3, 6, 7],
  [128, "Manes", "u", 8, 8, 7],
  [129, "Bloodshot eye", "e", 10, 8, 7],
  [130, "Red naga", "n", 11, 8, 7],
  [131, "Red jelly", "j", 26, 8, 7],
  [132, "Green icky thing", "i", 5, 8, 7],
  [133, "Lost soul", "G", 2, 8, 7],
  [134, "Night lizard", "R", 4, 8, 7],
  [136, "Skeleton orc", "s", 10, 8, 8],
  [139, "Nurgling", "u", 9, 8, 8],
  [141, "Brown yeek", "y", 4, 8, 8],
  [142, "Novice ranger", "p", 6, 8, 8],
  [143, "Giant salamander", "R", 6, 7, 8],
  [145, "Carnivorous flying monkey", "H", 20, 8, 8],
  [146, "Green mold", "m", 21, 8, 8],
  [147, "Novice paladin", "p", 6, 8, 8],
  [148, "Lemure", "u", 13, 9, 8],
  [149, "Hill orc", "o", 13, 9, 8],
  [150, "Bandit", "p", 8, 8, 10],
  [151, "Hunting hawk", "B", 8, 8, 8],
  [152, "Phantom warrior", "G", 5, 5, 8],
  [153, "Gremlin", "u", 5, 5, 8],
  [154, "Yeti", "Y", 12, 10, 9],
  [155, "Bloodshot icky thing", "i", 7, 8, 9],
  [156, "Giant grey rat", "r", 2, 3, 9],
  [157, "Black harpy", "H", 3, 8, 9],
  [158, "Skaven", "r", 11, 8, 9],
  [160, "Cave bear", "q", 12, 12, 9],
  [161, "Rock mole", "r", 10, 10, 9],
  [162, "Mindcrafter", "p", 9, 8, 20],
  [163, "Baby blue dragon", "d", 10, 10, 9],
  [164, "Baby white dragon", "d", 10, 10, 9],
  [165, "Baby green dragon", "d", 10, 10, 9],
  [166, "Baby black dragon", "d", 10, 10, 9],
  [167, "Baby red dragon", "d", 10, 10, 9],
  [168, "Giant red ant", "a", 4, 8, 9],
  [171, "King cobra", "J", 8, 10, 9],
  [172, "Eagle", "B", 9, 9, 12],
  [173, "War bear", "q", 13, 13, 9],
  [174, "Killer bee", "I", 2, 4, 9],
  [175, "Giant spider", "S", 10, 10, 10],
  [176, "Giant white tick", "S", 12, 8, 10],
  [178, "Dark-elven mage", "h", 7, 10, 10],
  [179, "Kamikaze yeek", "y", 4, 8, 10],
  [181, "Servant of Glaaki", "z", 9, 9, 10],
  [182, "Dark-elven warrior", "h", 10, 14, 10],
  [183, "Sand-dweller", "u", 9, 9, 10],
  [184, "Clear mushroom patch", ",", 1, 1, 10],
  [187, "Giant tan bat", "b", 3, 8, 10],
  [188, "Owlbear", "H", 12, 12, 10],
  [189, "Blue horror", "u", 14, 9, 10],
  [190, "Hairy mold", "m", 15, 8, 10],
  [191, "Grizzly bear", "q", 18, 18, 16],
  [192, "Disenchanter mold", "m", 16, 8, 10],
  [193, "Pseudo dragon", "d", 20, 10, 10],
  [194, "Tengu", "u", 16, 9, 10],
  [195, "Creeping gold coins", "$", 18, 24, 10],
  [196, "Wolf", "C", 6, 6, 10],
  [197, "Giant fruit fly", "I", 2, 2, 10],
  [198, "Panther", "f", 10, 8, 10],
  [199, "Brigand", "p", 9, 8, 10],
  [201, "Shadow Creature of Fiona", "h", 9, 8, 10],
  [202, "Undead mass", "j", 8, 8, 10],
  [203, "Chaos shapechanger", "H", 20, 9, 11],
  [204, "Baby multi-hued dragon", "d", 13, 10, 11],
  [205, "Vorpal bunny", "r", 10, 10, 11],
  [207, "Hippocampus", "H", 20, 9, 11],
  [208, "Zombified orc", "z", 11, 8, 11],
  [209, "Hippogriff", "H", 20, 9, 11],
  [210, "Black mamba", "J", 10, 8, 12],
  [211, "White wolf", "C", 7, 7, 12],
  [212, "Grape jelly", "j", 52, 8, 12],
  [213, "Nether worm mass", "w", 5, 8, 12],
  [214, "Abyss worm mass", "w", 5, 8, 12],
  [216, "Swordsman", "p", 12, 8, 12],
  [217, "Skaven shaman", "r", 10, 8, 12],
  [218, "Baby bronze dragon", "d", 10, 10, 9],
  [219, "Baby gold dragon", "d", 10, 10, 9],
  [220, "Evil eye", "e", 15, 8, 18],
  [221, "Mine-dog", "C", 6, 6, 12],
  [222, "Hellcat", "f", 9, 8, 12],
  [223, "Moon beast", "q", 9, 10, 12],
  [224, "Master yeek", "y", 12, 9, 12],
  [225, "Priest", "p", 12, 8, 12],
  [226, "Dark-elven priest", "h", 7, 10, 12],
  [227, "Air spirit", "E", 8, 8, 12],
  [228, "Skeleton human", "s", 10, 8, 12],
  [229, "Zombified human", "z", 12, 8, 12],
  [230, "Tiger", "f", 12, 10, 12],
  [231, "Moaning spirit", "G", 5, 8, 12],
  [232, "Stegocentipede", "c", 13, 8, 12],
  [233, "Spotted jelly", "j", 13, 8, 12],
  [234, "Drider", "S", 10, 13, 13],
  [235, "Mongbat", "b", 10, 10, 13],
  [236, "Killer brown beetle", "K", 13, 8, 13],
  [238, "Ogre", "O", 13, 9, 13],
  [239, "Creeping mithril coins", "$", 20, 24, 13],
  [240, "Illusionist", "p", 12, 8, 13],
  [241, "Druid", "p", 12, 12, 13],
  [242, "Pink horror", "u", 15, 9, 13],
  [243, "Cloaker", "(", 7, 7, 13],
  [244, "Black orc", "o", 12, 10, 13],
  [245, "Ochre jelly", "j", 13, 8, 13],
  [247, "Lurker", ".", 20, 10, 14],
  [248, "Tangleweed", "#", 5, 5, 10],
  [249, "Vlasta", "R", 12, 6, 14],
  [250, "Giant white dragon fly", "F", 3, 8, 14],
  [251, "Snaga sapper", "o", 8, 8, 14],
  [252, "Blue icky thing", "i", 10, 6, 14],
  [253, "Gibbering mouther", "j", 8, 6, 14],
  [254, "Wolfhound of Flora", "C", 9, 9, 14],
  [255, "Hill giant", "P", 30, 15, 20],
  [256, "Flesh golem", "g", 12, 8, 14],
  [257, "Warg", "C", 8, 8, 16],
  [258, "Cheerful leprechaun", "h", 2, 5, 14],
  [259, "Giant flea", "I", 1, 2, 14],
  [261, "Clay golem", "g", 14, 8, 15],
  [262, "Black ogre", "O", 20, 9, 15],
  [263, "Dweller on the threshold", "Y", 30, 8, 15],
  [264, "Half-orc", "o", 16, 10, 15],
  [265, "Dark naga", "n", 22, 11, 15],
  [266, "Poison ivy", "#", 5, 5, 10],
  [267, "Magic mushroom patch", ",", 1, 1, 15],
  [268, "Plaguebearer of Nurgle", "z", 9, 10, 15],
  [269, "Guardian naga", "n", 24, 11, 15],
  [270, "Wererat", "r", 20, 8, 15],
  [271, "Light hound", "Z", 6, 6, 15],
  [272, "Dark hound", "Z", 6, 6, 15],
  [273, "Flying skull", "s", 10, 10, 15],
  [274, "Mi-Go", "I", 13, 8, 15],
  [275, "Giant tarantula", "S", 10, 15, 15],
  [276, "Giant clear centipede", "c", 5, 8, 15],
  [277, "Mirkwood spider", "S", 9, 8, 15],
  [278, "Frost giant", "P", 32, 15, 23],
  [279, "Griffon", "H", 30, 8, 15],
  [280, "Homunculus", "u", 8, 8, 15],
  [281, "Gnome mage", "h", 7, 8, 15],
  [282, "Clear hound", "Z", 6, 6, 15],
  [283, "Umber hulk", "X", 20, 10, 16],
  [284, "Rust monster", "q", 20, 15, 16],
  [285, "Ogrillon", "O", 22, 9, 16],
  [286, "Gelatinous cube", "j", 36, 10, 16],
  [287, "Giant green dragon fly", "F", 3, 8, 16],
  [288, "Fire giant", "P", 34, 16, 25],
  [289, "Hummerhorn", "I", 2, 2, 16],
  [290, "Lizard man", "h", 16, 10, 16],
  [292, "Crebain", "B", 3, 5, 16],
  [293, "Berserker", "p", 60, 25, 45],
  [294, "Quasit", "u", 6, 8, 16],
  [295, "Sphinx", "H", 60, 5, 17],
  [296, "Imp", "u", 6, 8, 17],
  [297, "Forest troll", "T", 20, 10, 17],
  [298, "Freezing sphere", "*", 6, 6, 17],
  [299, "Jumping fireball", "*", 6, 6, 17],
  [300, "Ball lightning", "*", 6, 6, 17],
  [301, "2-headed hydra", "M", 100, 3, 17],
  [302, "Swamp thing", "H", 8, 12, 17],
  [303, "Water spirit", "E", 9, 8, 17],
  [304, "Giant red scorpion", "S", 11, 8, 17],
  [305, "Earth spirit", "E", 13, 8, 17],
  [306, "Fire spirit", "E", 10, 9, 18],
  [307, "Fire hound", "Z", 10, 6, 18],
  [308, "Cold hound", "Z", 10, 6, 18],
  [309, "Energy hound", "Z", 10, 6, 18],
  [310, "Lesser Mimic", "m", 10, 10, 18],
  [311, "Door Mimic", "+", 10, 10, 18],
  [312, "Blink dog", "C", 8, 8, 18],
  [313, "Uruk", "o", 18, 10, 16],
  [316, "Shambling mound", ",", 20, 6, 18],
  [317, "Giant Venus Flytrap", "#", 10, 10, 15],
  [318, "Chaos beastman", "H", 20, 8, 18],
  [319, "Daemonette of Slaanesh", "u", 12, 8, 18],
  [320, "Giant bronze dragon fly", "F", 3, 8, 18],
  [321, "Stone giant", "P", 35, 18, 28],
  [322, "Giant black dragon fly", "F", 3, 8, 20],
  [323, "Stone golem", "g", 28, 8, 19],
  [324, "Red mold", "m", 17, 8, 19],
  [325, "Giant gold dragon fly", "F", 3, 8, 22],
  [326, "Stunwall", "#", 4, 8, 18],
  [327, "Ghast", "z", 30, 10, 30],
  [328, "Neekerbreeker", "I", 3, 2, 19],
  [329, "Huorn", "#", 50, 10, 19],
  [331, "Phase spider", "S", 6, 8, 20],
  [332, "Lizard king", "h", 18, 11, 20],
  [334, "Wyvern", "d", 90, 5, 22],
  [335, "Great eagle", "B", 85, 5, 20],
  [336, "Livingstone", "#", 6, 8, 20],
  [337, "Earth hound", "Z", 15, 8, 20],
  [338, "Air hound", "Z", 15, 8, 20],
  [339, "Sabre-tooth tiger", "f", 20, 14, 20],
  [340, "Acid hound", "Z", 15, 8, 20],
  [341, "Chimaera", "H", 20, 15, 20],
  [342, "Quylthulg", "Q", 6, 8, 20],
  [343, "Sasquatch", "Y", 20, 19, 20],
  [344, "Weir", "C", 10, 12, 20],
  [345, "Ranger", "p", 18, 11, 20],
  [346, "Paladin", "p", 25, 11, 20],
  [347, "Werewolf", "C", 20, 22, 20],
  [348, "Dark-elven lord", "h", 18, 15, 20],
  [349, "Cloud giant", "P", 35, 20, 31],
  [351, "Blue dragon bat", "b", 4, 4, 21],
  [352, "Mimic", "m", 10, 14, 21],
  [353, "Ultimate Mimic", "m", 15, 40, 35],
  [354, "Fire vortex", "v", 9, 9, 21],
  [355, "Acid vortex", "v", 9, 9, 21],
  [357, "Arch-vile", "u", 11, 11, 21],
  [358, "Cold vortex", "v", 9, 9, 21],
  [359, "Energy vortex", "v", 9, 9, 21],
  [360, "Globefish", "~", 10, 10, 21],
  [361, "Giant firefly", "I", 3, 2, 24],
  [362, "Mummified orc", "z", 15, 8, 21],
  [363, "Wolf chieftain", "C", 22, 22, 26],
  [364, "Serpent man", "J", 15, 10, 22],
  [365, "Vampiric mist", "#", 10, 8, 22],
  [366, "Killer stag beetle", "K", 15, 8, 22],
  [367, "Iron golem", "g", 80, 12, 22],
  [369, "Giant yellow scorpion", "S", 12, 8, 22],
  [370, "Jade monk", "p", 10, 9, 23],
  [371, "Black ooze", "j", 6, 8, 23],
  [372, "Hardened warrior", "p", 15, 11, 23],
  [374, "Fleshhound of Khorne", "C", 25, 25, 30],
  [375, "Dark-elven warlock", "h", 7, 10, 23],
  [376, "Master rogue", "p", 15, 9, 23],
  [377, "Red dragon bat", "b", 3, 8, 23],
  [378, "Killer white beetle", "K", 18, 8, 23],
  [379, "Ice skeleton", "s", 16, 9, 23],
  [381, "Forest wight", "W", 12, 8, 24],
  [385, "Phantom beast", "G", 12, 12, 24],
  [386, "Giant silver ant", "a", 9, 8, 23],
  [387, "4-headed hydra", "M", 100, 7, 24],
  [389, "Tyrannosaur", "R", 200, 3, 24],
  [390, "Mummified human", "z", 17, 9, 24],
  [391, "Vampire bat", "b", 9, 10, 24],
  [394, "Banshee", "G", 6, 8, 24],
  [395, "Carrion crawler", "c", 20, 12, 25],
  [396, "Xiclotlan", "#", 25, 13, 25],
  [397, "Silent watcher", "g", 80, 25, 35],
  [398, "Pukelman", "g", 80, 12, 25],
  [399, "Disenchanter beast", "q", 30, 30, 25],
  [400, "Dark-elven druid", "h", 20, 20, 25],
  [401, "Stone troll", "T", 23, 10, 25],
  [402, "Black", "j", 12, 12, 25],
  [403, "Hill troll", "T", 21, 10, 21],
  [404, "Wereworm", "w", 100, 11, 25],
  [405, "Killer red beetle", "K", 20, 8, 25],
  [406, "Disenchanter bat", "b", 6, 8, 26],
  [407, "Gnoph-Keh", "q", 20, 8, 26],
  [408, "Giant grey ant", "a", 19, 8, 26],
  [411, "Giant fire tick", "S", 16, 8, 26],
  [412, "Displacer beast", "f", 25, 10, 26],
  [414, "Werebear", "q", 25, 25, 24],
  [415, "Cave ogre", "O", 30, 9, 26],
  [416, "White wraith", "W", 15, 8, 26],
  [417, "Angel", "A", 45, 10, 26],
  [418, "Ghoul", "z", 15, 9, 25],
  [420, "Hellblade", "|", 13, 13, 27],
  [421, "Killer fire beetle", "K", 22, 8, 27],
  [422, "Beast of Nurgle", "q", 15, 7, 27],
  [423, "Creeping adamantite coins", "$", 20, 50, 27],
  [424, "Algroth", "T", 21, 12, 27],
  [425, "Flamer of Tzeentch", ",", 60, 15, 27],
  [426, "Roper", "#", 30, 10, 27],
  [427, "Headless", "H", 25, 12, 27],
  [428, "Vibration hound", "Z", 25, 10, 27],
  [429, "Nexus hound", "Z", 25, 10, 27],
  [430, "Half-ogre", "O", 35, 9, 27],
  [432, "Vampire", "V", 25, 12, 27],
  [433, "Gorgimaera", "H", 25, 20, 27],
  [434, "Shantak", "H", 25, 20, 27],
  [435, "Colbran", "g", 80, 12, 27],
  [436, "Spirit naga", "n", 30, 15, 28],
  [437, "Corpser", ",", 30, 15, 28],
  [438, "Fiend of Slaanesh", "S", 15, 20, 28],
  [440, "5-headed hydra", "M", 100, 10, 28],
  [442, "Black knight", "p", 30, 10, 28],
  [443, "Seahorse", "~", 111, 7, 28],
  [444, "Cyclops", "P", 60, 20, 40],
  [445, "Clairvoyant", "p", 25, 10, 28],
  [446, "Purple worm", "w", 65, 8, 29],
  [447, "Catoblepas", "q", 30, 10, 29],
  [448, "Lesser wall monster", "#", 13, 8, 28],
  [449, "Mage", "p", 15, 8, 28],
  [450, "Mind flayer", "h", 15, 10, 28],
  [452, "Deep one", "u", 35, 12, 28],
  [453, "Basilisk", "R", 20, 30, 28],
  [454, "Ice troll", "T", 24, 10, 28],
  [455, "Dhole", "w", 65, 8, 29],
  [456, "Archangel", "A", 85, 10, 34],
  [457, "Greater Mimic", "m", 10, 35, 29],
  [458, "Chaos tile", ".", 3, 5, 29],
  [459, "Young blue dragon", "d", 27, 10, 29],
  [460, "Young white dragon", "d", 27, 10, 29],
  [461, "Young green dragon", "d", 27, 10, 29],
  [462, "Young bronze dragon", "d", 27, 10, 29],
  [463, "Aklash", "T", 30, 8, 29],
  [464, "Mithril golem", "g", 80, 15, 30],
  [465, "Skeleton troll", "s", 20, 10, 30],
  [466, "Skeletal tyrannosaur", "R", 50, 10, 30],
  [469, "Giant blue ant", "a", 8, 8, 30],
  [470, "Grave wight", "W", 12, 10, 30],
  [471, "Shadow drake", "d", 30, 10, 33],
  [472, "Manticore", "H", 25, 10, 30],
  [473, "Giant army ant", "a", 19, 6, 30],
  [474, "Killer slicer beetle", "K", 25, 10, 30],
  [475, "Gorgon", "H", 30, 20, 31],
  [476, "Gug", "P", 22, 11, 26],
  [477, "Ghost", "G", 13, 8, 31],
  [478, "Death watch beetle", "K", 25, 12, 31],
  [479, "Mountain ogre", "O", 40, 9, 30],
  [480, "Nexus quylthulg", "Q", 10, 12, 32],
  [482, "Giant squid", "~", 150, 10, 41],
  [483, "Ghoulking", "z", 40, 12, 32],
  [484, "Doombat", "b", 24, 14, 32],
  [485, "Ninja", "p", 13, 12, 32],
  [486, "Memory moss", ",", 1, 2, 32],
  [487, "Storm giant", "P", 40, 20, 35],
  [488, "Spectator", "e", 15, 13, 28],
  [490, "Biclops", "P", 65, 20, 43],
  [491, "Half-troll", "T", 25, 14, 34],
  [492, "Ivory monk", "p", 38, 9, 33],
  [496, "Cave troll", "T", 24, 12, 33],
  [497, "Anti-paladin", "p", 30, 20, 33],
  [498, "Chaos master", "p", 30, 10, 37],
  [499, "Barrow wight", "W", 15, 10, 33],
  [500, "Skeleton ettin", "s", 45, 10, 33],
  [501, "Chaos drake", "d", 50, 10, 33],
  [502, "Law drake", "d", 50, 10, 33],
  [503, "Balance drake", "d", 60, 10, 33],
  [504, "Ethereal drake", "d", 40, 10, 33],
  [507, "Shade", "G", 14, 20, 33],
  [508, "Spectre", "G", 14, 20, 33],
  [509, "Water troll", "T", 36, 10, 35],
  [510, "Fire elemental", "E", 30, 8, 33],
  [511, "Cherub", "A", 130, 10, 39],
  [512, "Water elemental", "E", 25, 8, 33],
  [513, "Multi-hued hound", "Z", 30, 10, 33],
  [514, "Invisible stalker", "E", 19, 12, 35],
  [515, "Carrion crawler", "c", 20, 12, 34],
  [516, "Master thief", "p", 18, 10, 34],
  [518, "Lich", "L", 30, 10, 34],
  [519, "Gas spore", "e", 25, 10, 34],
  [520, "Master vampire", "V", 34, 20, 36],
  [521, "Oriental vampire", "V", 40, 30, 40],
  [522, "Greater mummy", "z", 34, 10, 36],
  [523, "Bloodletter of Khorne", "U", 30, 8, 34],
  [524, "Giant grey scorpion", "S", 18, 20, 34],
  [525, "Earth elemental", "E", 30, 10, 34],
  [526, "Air elemental", "E", 30, 5, 34],
  [527, "Shimmering mold", "m", 32, 8, 27],
  [528, "Gargoyle", "u", 18, 12, 34],
  [529, "Malicious leprechaun", "h", 4, 5, 35],
  [530, "Eog golem", "g", 100, 20, 34],
  [532, "Dagashi", "p", 13, 25, 35],
  [533, "Headless ghost", "G", 20, 25, 35],
  [534, "Dread", "G", 25, 20, 35],
  [535, "Leng spider", "S", 16, 20, 35],
  [536, "Gauth", "e", 15, 20, 36],
  [537, "Smoke elemental", "E", 15, 10, 36],
  [538, "Olog", "T", 42, 10, 36],
  [539, "Halfling slinger", "h", 30, 9, 35],
  [540, "Gravity hound", "Z", 35, 10, 35],
  [541, "Acidic cytoplasm", "j", 40, 10, 35],
  [542, "Inertia hound", "Z", 35, 10, 35],
  [543, "Impact hound", "Z", 35, 10, 35],
  [544, "Shardstorm", "v", 32, 10, 37],
  [545, "Ooze elemental", "E", 13, 10, 36],
  [546, "Young black dragon", "d", 30, 10, 31],
  [547, "Mumak", "q", 90, 10, 35],
  [548, "Giant fire ant", "a", 20, 10, 35],
  [549, "Mature white dragon", "d", 50, 10, 34],
  [550, "Xorn", "X", 16, 10, 36],
  [552, "Mist giant", "#", 35, 10, 36],
  [553, "Phantom", "G", 20, 25, 36],
  [554, "Grey wraith", "W", 19, 10, 36],
  [555, "Revenant", "W", 2, 111, 36],
  [556, "Young multi-hued dragon", "d", 32, 10, 32],
  [557, "Raal's Tome of Destruction", "?", 50, 15, 36],
  [558, "Colossus", "g", 30, 100, 36],
  [559, "Young gold dragon", "d", 30, 10, 31],
  [560, "Mature blue dragon", "d", 50, 10, 34],
  [561, "Mature green dragon", "d", 50, 10, 34],
  [562, "Mature bronze dragon", "d", 50, 10, 34],
  [563, "Young red dragon", "d", 30, 10, 31],
  [564, "Nightblade", "h", 19, 13, 36],
  [565, "Trapper", ".", 60, 10, 36],
  [566, "Bodak", "u", 35, 10, 36],
  [568, "Mezzodaemon", "u", 40, 10, 36],
  [569, "Elder thing", "u", 35, 10, 36],
  [570, "Ice elemental", "E", 35, 10, 37],
  [571, "Necromancer", "p", 28, 10, 36],
  [574, "Chaos spawn", "e", 21, 21, 38],
  [575, "Mummified troll", "z", 25, 10, 34],
  [576, "Storm of Unmagic", "v", 32, 20, 53],
  [577, "Crypt thing", "L", 80, 10, 37],
  [578, "Chaos butterfly", "I", 60, 10, 37],
  [579, "Time elemental", "E", 35, 10, 39],
  [580, "Flying polyp", "~", 35, 10, 37],
  [582, "Will o' the wisp", "E", 20, 10, 38],
  [583, "Shan", "I", 20, 8, 37],
  [584, "Magma elemental", "E", 35, 10, 37],
  [585, "Black pudding", "j", 40, 10, 37],
  [586, "Killer iridescent beetle", "K", 25, 15, 37],
  [587, "Nexus vortex", "v", 32, 10, 37],
  [588, "Plasma vortex", "v", 32, 10, 37],
  [589, "Mature red dragon", "d", 62, 10, 36],
  [590, "Mature gold dragon", "d", 62, 10, 36],
  [591, "Crystal drake", "d", 45, 10, 33],
  [592, "Mature black dragon", "d", 62, 10, 36],
  [593, "Mature multi-hued dragon", "d", 62, 10, 38],
  [594, "Sky whale", "~", 80, 10, 38],
  [597, "Death knight", "p", 60, 10, 38],
  [599, "Time vortex", "v", 32, 10, 38],
  [600, "Shimmering vortex", "v", 32, 10, 38],
  [601, "Ancient blue dragon", "D", 72, 15, 40],
  [602, "Ancient bronze dragon", "D", 72, 15, 40],
  [603, "Beholder", "e", 16, 100, 40],
  [604, "Emperor wight", "W", 38, 10, 38],
  [605, "Seraph", "A", 180, 10, 45],
  [607, "Black wraith", "W", 50, 10, 38],
  [608, "Nightgaunt", "U", 24, 10, 38],
  [609, "Baron of hell", "U", 150, 12, 38],
  [611, "Monastic lich", "L", 12, 100, 39],
  [612, "Nether wraith", "W", 48, 10, 39],
  [613, "Hellhound", "C", 48, 10, 35],
  [614, "7-headed hydra", "M", 100, 12, 39],
  [617, "Ancient white dragon", "D", 72, 15, 40],
  [618, "Ancient green dragon", "D", 72, 15, 40],
  [619, "Chthonian", "w", 100, 10, 39],
  [620, "Eldrak", "T", 75, 10, 38],
  [621, "Ettin", "T", 15, 100, 39],
  [622, "Night mare", "q", 15, 100, 39],
  [623, "Vampire lord", "V", 20, 100, 42],
  [624, "Ancient black dragon", "D", 100, 15, 41],
  [625, "Weird fume", "#", 35, 10, 40],
  [626, "Spawn of Ubbo-Sathla", "j", 30, 10, 40],
  [630, "Spirit troll", "G", 10, 100, 40],
  [631, "War troll", "T", 50, 10, 40],
  [632, "Disenchanter worm mass", "w", 10, 8, 40],
  [633, "Rotting quylthulg", "Q", 48, 10, 45],
  [634, "Lesser titan", "P", 24, 100, 50],
  [635, "9-headed hydra", "M", 100, 15, 40],
  [636, "Enchantress", "p", 52, 10, 40],
  [637, "Ranger chieftain", "p", 50, 20, 41],
  [638, "Sorcerer", "p", 52, 10, 40],
  [639, "Xaren", "X", 32, 10, 40],
  [640, "Giant roc", "B", 80, 13, 40],
  [641, "Minotaur", "H", 100, 12, 40],
  [643, "Death drake", "D", 21, 100, 45],
  [644, "Ancient red dragon", "D", 100, 15, 41],
  [645, "Ancient gold dragon", "D", 100, 15, 41],
  [646, "Great crystal drake", "D", 21, 100, 45],
  [647, "Wyrd sister", "p", 50, 11, 40],
  [648, "Vrock", "U", 40, 10, 40],
  [649, "Death quasit", "u", 44, 10, 40],
  [652, "Fallen angel", "A", 100, 25, 49],
  [653, "Giant headless", "H", 30, 12, 41],
  [657, "Dark-elven sorcerer", "h", 80, 10, 41],
  [658, "Master lich", "L", 18, 100, 41],
  [659, "Byakhee", "U", 40, 10, 41],
  [661, "Archon", "A", 100, 40, 55],
  [662, "Formless spawn of Tsathoggua", "U", 22, 20, 41],
  [663, "Hunting horror", "U", 30, 17, 42],
  [664, "Undead beholder", "e", 27, 100, 45],
  [665, "Shadow", "G", 10, 20, 37],
  [666, "Iron lich", "L", 22, 100, 42],
  [667, "Dread", "G", 25, 20, 42],
  [668, "Greater basilisk", "R", 20, 100, 42],
  [671, "Zephyr Lord", "W", 80, 10, 43],
  [672, "Juggernaut of Khorne", "g", 90, 19, 43],
  [673, "Mumak", "q", 90, 10, 63],
  [675, "Ancient multi-hued dragon", "D", 100, 26, 43],
  [676, "Ethereal dragon", "D", 21, 100, 45],
  [677, "Dark young of Shub-Niggurath", "U", 12, 100, 43],
  [678, "Colour out of space", ".", 12, 100, 43],
  [680, "Death leprechaun", "h", 6, 6, 44],
  [682, "Lloigor", "v", 100, 15, 44],
  [685, "Shoggoth", "j", 50, 20, 44],
  [688, "11-headed hydra", "M", 100, 18, 44],
  [689, "Patriarch", "p", 52, 10, 40],
  [690, "Dreadmaster", "G", 12, 100, 44],
  [691, "Drolem", "g", 30, 100, 44],
  [693, "Warrior of the Dawn", "p", 25, 25, 45],
  [694, "Lesser black reaver", "L", 25, 100, 45],
  [696, "Grand master thief", "p", 15, 100, 46],
  [699, "Knight Templar", "p", 60, 20, 44],
  [700, "Leprechaun fanatic", "h", 6, 6, 46],
  [701, "Dracolich", "D", 35, 100, 55],
  [702, "Greater titan", "P", 38, 100, 58],
  [703, "Dracolisk", "D", 35, 100, 55],
  [704, "Winged Horror", "B", 25, 80, 48],
  [705, "Spectral tyrannosaur", "R", 70, 50, 46],
  [709, "Hru", "P", 40, 100, 66],
  [711, "Death mold", "m", 100, 20, 47],
  [716, "Behemoth", "H", 50, 100, 49],
  [718, "Greater wall monster", "#", 15, 40, 44],
  [719, "Nycadaemon", "U", 29, 99, 51],
  [720, "Barbazu", "U", 120, 10, 55],
  [721, "Goat of Mendes", "q", 18, 111, 50],
  [722, "Nightwing", "W", 60, 60, 61],
  [723, "Maulotaur", "H", 200, 13, 50],
  [724, "Nether hound", "Z", 60, 10, 51],
  [725, "Time hound", "Z", 60, 10, 51],
  [726, "Plasma hound", "Z", 60, 10, 51],
  [727, "Demonic quylthulg", "Q", 48, 10, 45],
  [728, "Great Storm Wyrm", "D", 40, 100, 63],
  [731, "Hell knight", "p", 15, 100, 52],
  [736, "Great unclean one", "U", 80, 80, 53],
  [737, "Lord of Chaos", "p", 45, 55, 60],
  [738, "Old Sorcerer", "p", 52, 25, 54],
  [739, "Ethereal hound", "Z", 60, 15, 55],
  [740, "Lesser kraken", "~", 30, 100, 54],
  [741, "Great Ice Wyrm", "D", 40, 100, 63],
  [742, "Demilich", "L", 35, 100, 54],
  [744, "Nightcrawler", "W", 80, 60, 69],
  [745, "Lord of Change", "U", 50, 70, 54],
  [746, "Keeper of Secrets", "H", 60, 70, 64],
  [748, "Hand druj", "s", 60, 10, 57],
  [749, "Eye druj", "s", 10, 100, 58],
  [750, "Skull druj", "s", 14, 100, 59],
  [751, "Chaos vortex", "v", 32, 20, 53],
  [752, "Aether vortex", "v", 40, 20, 54],
  [756, "Great Hell Wyrm", "D", 50, 100, 67],
  [758, "Bloodthirster", "U", 60, 70, 50],
  [759, "Draconic quylthulg", "Q", 48, 10, 45],
  [763, "Bile Demon", "U", 35, 100, 61],
  [768, "Nightwalker", "W", 80, 70, 73],
  [773, "Osyluth", "U", 40, 100, 65],
  [774, "Dreadlord", "G", 30, 100, 62],
  [775, "Greater kraken", "~", 40, 100, 60],
  [776, "Archlich", "L", 45, 100, 64],
  [778, "Jabberwock", "H", 32, 100, 68],
  [779, "Chaos hound", "Z", 60, 30, 65],
  [781, "Beholder hive-mother", "e", 40, 100, 67],
  [782, "Leviathan", "~", 50, 100, 67],
  [783, "Great Wyrm of Chaos", "D", 60, 100, 75],
  [784, "Great Wyrm of Law", "D", 60, 100, 75],
  [785, "Great Wyrm of Balance", "D", 70, 100, 80],
  [786, "Shambler", "E", 50, 100, 67],
  [787, "Gelugon", "U", 45, 100, 69],
  [790, "Great Wyrm of Many Colours", "D", 70, 100, 80],
  [793, "Sky Drake", "D", 60, 100, 77],
  [795, "Horned Reaper", "U", 50, 100, 72],
  [798, "Black reaver", "L", 50, 100, 74],
  [799, "Master mindcrafter", "p", 80, 10, 40],
  [800, "Greater demonic quylthulg", "Q", 15, 100, 71],
  [801, "Greater draconic quylthulg", "Q", 15, 100, 71],
  [802, "Greater rotting quylthulg", "Q", 15, 100, 71],
  [807, "Greater Balrog", "U", 75, 100, 80],
  [811, "Aether hound", "Z", 60, 40, 74],
  [812, "Pit Fiend", "U", 60, 100, 77],
  [815, "Unmaker", "E", 6, 66, 77],
  [816, "Cyberdemon", "U", 70, 101, 77],
  [821, "Master quylthulg", "Q", 30, 100, 76],
  [829, "Black Dog", "C", 58, 50, 78],
  [836, "Star-spawn of Cthulhu", "U", 75, 100, 86],
  [847, "Great Wyrm of Power", "D", 111, 111, 85],
  [866, "Elite uruk", "o", 20, 10, 20],
  [874, "Rot jelly", "j", 20, 8, 5],
  [879, "Pike", "~", 2, 7, 2],
  [880, "Electric eel", "J", 15, 15, 20],
  [881, "Giant crayfish", "~", 4, 10, 4],
  [882, "Mermaid", "h", 5, 8, 4],
  [883, "Box jellyfish", "~", 10, 10, 10],
  [884, "Giant piranha", "~", 6, 8, 10],
  [885, "Piranha", "~", 2, 6, 3],
  [886, "Bullywug", "h", 6, 10, 7],
  [887, "Bullywug warrior", "h", 8, 10, 8],
  [888, "Bullywug shaman", "h", 6, 10, 8],
  [889, "Whale", "~", 22, 22, 20],
  [890, "Sand mite", "~", 3, 10, 10],
  [891, "Octopus", "~", 60, 6, 15],
  [892, "Giant octopus", "~", 100, 6, 30],
  [893, "Eye of the deep", "e", 16, 100, 40],
  [894, "Murk dweller", "S", 200, 5, 27],
  [895, "Drowned soul", "G", 9, 8, 11],
  [896, "Tiger shark", "~", 10, 5, 12],
  [897, "Hammerhead shark", "~", 16, 10, 16],
  [898, "Great white shark", "~", 100, 6, 24],
  [899, "Aquatic golem", "g", 25, 10, 19],
  [900, "Aquatic kobold", "k", 13, 9, 5],
  [901, "White shark", "~", 30, 10, 18],
  [902, "Scrag", "T", 40, 10, 37],
  [904, "Aquatic elf", "h", 14, 8, 9],
  [905, "Aquatic elven warrior", "h", 20, 8, 10],
  [906, "Aquatic elven shaman", "h", 12, 8, 10],
  [907, "Stargazer", "~", 15, 9, 21],
  [908, "Elder stargazer", "~", 20, 10, 29],
  [909, "Flounder", "~", 10, 5, 13],
  [910, "Giant turtle", "R", 5, 8, 7],
  [911, "Baby dragon turtle", "d", 10, 10, 9],
  [912, "Young dragon turtle", "d", 30, 10, 31],
  [913, "Mature dragon turtle", "d", 50, 10, 38],
  [914, "Ancient dragon turtle", "D", 70, 10, 41],
  [915, "Fastitocalon", "D", 40, 100, 52],
  [916, "Undead stargazer", "~", 18, 9, 25],
  [917, "Killer whale", "~", 20, 50, 25],
  [918, "Merrow", "O", 30, 9, 28],
  [919, "Water naga", "n", 30, 10, 24],
  [920, "Devilfish", "~", 10, 5, 12],
  [921, "Undead devilfish", "~", 10, 5, 15],
  [923, "Aquatic hound", "Z", 15, 5, 20],
  [924, "Water demon", "U", 35, 20, 40],
  [925, "Ixitxachitl", "~", 12, 8, 12],
  [926, "Ixitxachitl priest", "~", 10, 10, 19],
  [927, "Vampiric ixitxachitl", "~", 15, 15, 26],
  [937, "Novice mindcrafter", "p", 6, 8, 8],
  [938, "Great Swamp Wyrm", "D", 40, 100, 63],
  [939, "Great Bile Wyrm", "D", 50, 100, 67],
  [955, "Green Dragonrider", "D", 50, 50, 30],
  [956, "Blue Dragonrider", "D", 60, 60, 40],
  [957, "Brown Dragonrider", "D", 65, 65, 50],
  [958, "Bronze Dragonrider", "D", 70, 70, 60],
  [959, "Gold Dragonrider", "D", 80, 80, 70],
  [960, "Thread", ",", 3, 5, 50],
  [963, "Aranea", "S", 20, 10, 30],
  [964, "Elder aranea", "S", 30, 20, 40],
  [965, "Giant brown tick", "S", 16, 8, 25],
  [968, "Bat of Gorgoroth", "b", 20, 10, 28],
  [975, "Death orb", "E", 40, 100, 80],
  [976, "Bronze dragon worm", "w", 10, 15, 20],
  [977, "Gold dragon worm", "w", 10, 15, 20],
  [986, "3-headed hydra", "M", 100, 5, 20],
  [988, "Mystic", "p", 35, 10, 33],
  [989, "Elder vampire", "V", 44, 100, 54],
  [991, "Demonologist", "p", 28, 10, 36],
  [992, "Hezrou", "U", 52, 10, 41],
  [993, "Glabrezu", "U", 70, 10, 43],
  [994, "Nalfeshnee", "U", 90, 10, 45],
  [995, "Marilith", "U", 20, 70, 47],
  [996, "Lesser Balrog", "U", 20, 100, 49],
  [997, "Master mystic", "p", 11, 100, 50],
  [998, "Grand master mystic", "p", 22, 100, 57],
  [999, "Erinyes", "U", 24, 10, 38],
  [1000, "Novice mindcrafter", "p", 6, 8, 4],
  [1002, "Great Wyrm of Perplexity", "D", 40, 100, 63],
  [1003, "Hound of Tindalos", "Z", 60, 15, 59],
  [1004, "Great Wyrm of Thunder", "D", 50, 100, 67],
  [1005, "Silver mouse", "r", 1, 3, 4],
  [1008, "Giant black louse", "I", 1, 2, 14],
  [1013, "Bone golem", "g", 35, 100, 61],
  [1014, "Snake of Yig", "J", 48, 10, 38],
  [1015, "Bronze golem", "g", 40, 100, 65],
  [1016, "Dimensional shambler", "h", 40, 10, 29],
  [1017, "Cultist", "p", 14, 8, 17],
  [1018, "Cult leader", "p", 52, 14, 47],
  [1019, "Servitor of the outer gods", "H", 100, 35, 41],
  [1020, "Avatar of Nyarlathotep", "p", 25, 25, 45],
  [1023, "Blue dragon worm", "w", 10, 15, 20],
  [1024, "White dragon worm", "w", 10, 15, 20],
  [1025, "Green dragon worm", "w", 10, 15, 20],
  [1026, "Black dragon worm", "w", 10, 15, 20],
  [1027, "Red dragon worm", "w", 10, 15, 20],
  [1028, "Multi-hued dragon worm", "w", 10, 20, 23],
  [1031, "Sandworm", "w", 20, 15, 22],
  [1038, "Water hound", "Z", 45, 10, 43],
  [1044, "Positivist", "p", 15, 8, 15],
  [1045, "Unmagic mushroom patch", ",", 1, 1, 15],
  [1047, "Unbeliever", "p", 15, 10, 20],
  [1048, "Unbeliever", "p", 15, 10, 30],
  [1049, "Master Unbeliever", "p", 11, 100, 50],
  [1050, "True Believer", "p", 30, 100, 57],
  [1054, "Goldfish", "~", 1, 1, 0],
  [1055, "Carp", "~", 2, 4, 0],
  [1056, "Gunfish", "~", 5, 8, 13],
  [1057, "Sirene", "h", 10, 12, 22],
  [1058, "Swordsmaster", "p", 30, 40, 40],
  [1059, "Grand Swordsmaster", "p", 50, 50, 60],
  [1060, "Incubus", "U", 15, 12, 35],
  [1061, "Succubus", "U", 15, 12, 35],
  [1062, "Mandragora", ",", 40, 20, 72],
  [1064, "Dark mist", "#", 10, 8, 22],
  [1065, "Psychedelic ball", "*", 6, 6, 30],
  [1068, "Nether Guard", "N", 150, 150, 98],
  [1069, "Gorm", "R", 30, 100, 50],
  [1070, "Cave Gorm", "R", 40, 100, 60],
  [1071, "Sky Blade", "A", 200, 35, 70],
  [1072, "Solar Blade", "A", 300, 35, 80],
  [1073, "Star Blade", "A", 400, 35, 90],
  [1079, "Gold ant", "a", 10, 10, 25],
  [1080, "Minion of Doom", "p", 10, 300, 97],
  [1082, "Void Jumpgate Mimic", "+", 50, 10, 26],
  [1083, "Ironwing", "B", 150, 300, 98],
  [1084, "Force vortex", "v", 50, 70, 97],
  [1089, "Forest Ghoul", "z", 30, 5, 0],
  [1090, "Spook", "G", 30, 5, 0],
  [1091, "Rampant Zombie", "z", 30, 5, 0],
  [1092, "Vampire Apparition", "V", 30, 5, 0],
  [1093, "Lost Goblin", "h", 30, 5, 0],
  [1094, "Moving Bones", "s", 30, 5, 0],
  [1095, "Frankenstein's Monster", "U", 40, 5, 0],
  [1096, "Freddy Krueger", "z", 40, 5, 0],
  [1099, "Electric eye", "e", 12, 8, 12],
  [1106, "Baby silver dragon", "d", 10, 10, 9],
  [1107, "Young silver dragon", "d", 28, 10, 30],
  [1108, "Mature silver dragon", "d", 56, 10, 35],
  [1109, "Ancient silver dragon", "D", 90, 15, 41],
  [1110, "Great Wyrm of Radiance", "D", 46, 100, 65],
  [1127, "Firebird", "B", 29, 100, 52],
  [1128, "Swamp Serpent", "J", 22, 100, 39],
  [1129, "Mountain Serpent", "J", 27, 100, 47],
  [1130, "Sea Serpent", "J", 55, 100, 56],
  [1131, "Horned Serpent", "J", 36, 100, 66],
  [1143, "Nether vortex", "v", 40, 20, 97]
];

// Die roll expected value calculator.
const averageRoll = function(levels, dieSize) {
  return Math.floor((dieSize + 1) * (levels - 1) / 2) + dieSize;
}

// Computes an internal game value relevant to HP computation.
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

// Indicates the classes which have access to Nature magic.
const classHasNature = {
  "warrior": false,
  "istar": true,         //
  "priest": false,
  "rogue": false,
  "mimic": false,
  "archer": false,
  "paladin": false,
  "ranger": true,        //
  "adventurer": true,    //
  "druid": true,         //
  "shaman": true,        //
  "runemaster": false,
  "mindcrafter": false,
  "death-knight": false,
  "hell-knight": false
}

// Determines whether a given player character can use Nature magic.
const shouldApplyNature = function(p) {
  return (classHasNature[p.playerClass] && (p.playerRace != "vampire"));
}

// Computes the "Nature HP Supplement", a feature designed to boost the HP of
// classes with low durability.
const applyNatureBonus = function(p, mhp) {
  let remainingBonus = Math.floor(p.natureSkill);
  if (!remainingBonus) return mhp;

  const effLevel = (p.playerLevel > 50 ) ? 50 : p.playerLevel;
  const threshold = Math.floor((effLevel + 10) * (effLevel + 10) * (effLevel + 10) / 270);
  const increment = effLevel * 2;

  let beforeThreshold = threshold - mhp;
  if (beforeThreshold >= 4) {
    const bonusUntilThreshold = Math.floor(beforeThreshold / 4);
    const bonusToSpend = bonusUntilThreshold > remainingBonus ? remainingBonus : bonusUntilThreshold;
    mhp += bonusToSpend * 4;
    remainingBonus -= bonusToSpend;
  }
  if (!remainingBonus) return mhp;

  beforeThreshold = threshold + increment - mhp;
  if (beforeThreshold >= 3) {
    const bonusUntilThreshold = Math.floor(beforeThreshold / 3);
    const bonusToSpend = bonusUntilThreshold > remainingBonus ? remainingBonus : bonusUntilThreshold;
    mhp += bonusToSpend * 3;
    remainingBonus -= bonusToSpend;
  }
  if (!remainingBonus) return mhp;

  beforeThreshold = threshold + 2 * increment - mhp;
  if (beforeThreshold >= 2) {
    const bonusUntilThreshold = Math.floor(beforeThreshold / 2);
    const bonusToSpend = bonusUntilThreshold > remainingBonus ? remainingBonus : bonusUntilThreshold;
    mhp += bonusToSpend * 2;
    remainingBonus -= bonusToSpend;
  }
  if (!remainingBonus) return mhp;

  beforeThreshold = threshold + 3 * increment - mhp;
  if (beforeThreshold > 0) {
    const bonusToSpend = beforeThreshold > remainingBonus ? remainingBonus : beforeThreshold;
    mhp += bonusToSpend;
  }
  return mhp;

};

// The full HP computation, following closely the original C code,
// though in more of a functional style.
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

  const monsterHP = p.mimicHitDice * p.mimicHitDieSize;
  const monsterRlvl = (p.playerClass === "hell-knight" ||
                        (p.playerRace === "corrupted-maia" && p.playerClass === "priest")
                      ) ? 80 : p.mimicRlvl;

  const raceClassHPbonus = playerFormHP - ((playerFormHP * 16) / hitDie); // relative to human mimic
  const reducedInfluenceHP = playerFormHP - Math.trunc(raceClassHPbonus / 2);

  const mHPLimPreliminary = Math.floor(50000 / (Math.floor(50000 / monsterHP) + 20));
  const mHPLim = mHPLimPreliminary < reducedInfluenceHP ? reducedInfluenceHP : mHPLimPreliminary;
  const finalHP = Math.floor(((mHPLim * 2) + (reducedInfluenceHP * 3)) / 5) + Math.trunc(raceClassHPbonus / 2);

  const corruptedBonus = ((p.playerRace === "corrupted-maia") && level >= 20) ?
    (level <= 50 ? (level - 20) * 2 : 60 + (level - 50)) :
    0;

  const postKingMimicBonus = Math.floor(((level - 50) * ((monsterRlvl > 80 ? 80 : monsterRlvl) + 30)) / 25);
  const effectiveMimicBonus = (level > 50) ? postKingMimicBonus : 0;

  const nonMimicHPAfterBonuses = playerFormHP + corruptedBonus;
  const mimicHPAfterBonuses = finalHP + effectiveMimicBonus + corruptedBonus;

  const nonMimicAfterNature = shouldApplyNature(p) ? applyNatureBonus(p, nonMimicHPAfterBonuses) : nonMimicHPAfterBonuses;
  const mimicAfterNature = shouldApplyNature(p) ? applyNatureBonus(p, mimicHPAfterBonuses) : mimicHPAfterBonuses;

  return [nonMimicAfterNature, mimicAfterNature];

};

const displayValueIn = function(value, container) {
  container.textContent = value;
}

const clearDisplay = function(container) {
  container.textContent = "";
}

// Wiring up the outputs.
const updateOutput = function() {
  
  const [playerHitpoints, mimicryHitpoints] = recompute(profile);
  displayValueIn(playerHitpoints, hitpointsOutput);
  displayValueIn(mimicryHitpoints, mimicHitpointsOutput);

};

updateOutput();

// Wiring up the inputs.
allInputs.addEventListener('change', e => {
  const changedFieldID = e.target.id;
  const changedFieldType = e.target.type;
  const changedFieldValue = e.target.value;
  if (changedFieldType === 'select-one') {
    profile[changedFieldID] = changedFieldValue;
    const derivativeProperty = derivativeProperties[changedFieldID];
    profile[derivativeProperty] = parseSelector[derivativeProperty][changedFieldValue];
    if (changedFieldID === 'playerRace') {
      allInputs.setAttribute("displayingrace", changedFieldValue);
    }
    if (changedFieldID === 'playerClass') {
      allInputs.setAttribute("displayingclass", changedFieldValue);
    }
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
