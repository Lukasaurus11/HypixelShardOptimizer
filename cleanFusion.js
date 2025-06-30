const fs = require('fs');

// Load your shard JSON
const data = JSON.parse(fs.readFileSync('shards.json', 'utf8'));

// Loop through each shard
for (const shardName in data.shards) {
  const shard = data.shards[shardName];

  const flatFusion = shard.fusion;
  const groupedFusion = [];

  // Deduplicate and group into pairs (2-step recipes assumed)
  for (let i = 0; i < flatFusion.length; i += 2) {
    const recipe = [];

    for (let j = i; j < i + 2 && j < flatFusion.length; j++) {
      const part = flatFusion[j];

      // Skip empty entries
      if (!part.shards && !part.type && !part.family && !part.rarity) continue;

      // Normalize shard string into array
      const cleanPart = {
        ...(part.type ? { type: part.type } : {}),
        ...(part.rarity ? { rarity: part.rarity } : {}),
        ...(part.family ? { family: part.family } : {}),
      };

      if (part.shards) {
        cleanPart.shards = Array.isArray(part.shards)
          ? part.shards
          : [part.shards];
      }

      recipe.push(cleanPart);
    }

    if (recipe.length) groupedFusion.push(recipe);
  }

  shard.fusion = groupedFusion;
}

// Save the cleaned file
fs.writeFileSync('shards_cleaned.json', JSON.stringify(data, null, 2));
console.log('Cleaned fusion recipes written to shards_cleaned.json');
