const categories = [
  'Living Room interior', 'Bedroom interior', 'Kitchen interior', 'Dining Room interior', 
  'Bathroom interior', 'Office Room interior', 'Kids Room interior', 'Balcony interior', 
  'Pooja Room interior', 'Commercial Space interior'
];

async function fetchIds() {
  const result = {};
  for (const cat of categories) {
    const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(cat)}&per_page=10`);
    const data = await res.json();
    result[cat.replace(' interior', '')] = data.results.map(i => i.id);
  }
  console.log(JSON.stringify(result, null, 2));
}

fetchIds();
