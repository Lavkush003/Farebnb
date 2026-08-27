const sampleListings = [
  {
    title: "Luxury Beachfront Villa with Infinity Pool",
    description: "Indulge in panoramic Pacific ocean views from this modern architectural masterpiece in Malibu. Features a private infinity edge pool, floor-to-ceiling glass walls, chef's kitchen, and direct private beach access.",
    image: {
      filename: "malibu_villa",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    },
    price: 4500,
    location: "Malibu, California",
    country: "United States",
    category: "Beachfront",
    amenities: ["Wifi", "Pool", "Kitchen", "Free parking", "Air conditioning", "Hot tub", "Dedicated workspace", "EV charger"],
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    maxGuests: 8,
    geometry: {
      type: "Point",
      coordinates: [-118.6923, 34.0381],
    },
  },
  {
    title: "Alpine Chalet with Heated Jacuzzi & Mountain Views",
    description: "Nestled right beside the slopes of Aspen, this authentic cedar wood chalet provides ski-in/ski-out access, a wood-burning stone fireplace, an outdoor heated jacuzzi with snowcapped views, and a Finnish sauna.",
    image: {
      filename: "aspen_chalet",
      url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    },
    price: 3800,
    location: "Aspen, Colorado",
    country: "United States",
    category: "Mountains",
    amenities: ["Wifi", "Hot tub", "Kitchen", "Free parking", "Indoor fireplace", "Ski-in/Ski-out", "Washer", "Dryer"],
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    maxGuests: 6,
    geometry: {
      type: "Point",
      coordinates: [-106.8175, 39.1911],
    },
  },
  {
    title: "Renaissance Tuscan Villa & Private Vineyard",
    description: "Live like Italian royalty in this meticulously restored 17th-century estate surrounded by olive groves and Chianti vineyards. Features frescoed ceilings, antique furnishings, private wine cellar, and private pool.",
    image: {
      filename: "tuscany_villa",
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    },
    price: 3200,
    location: "Florence, Tuscany",
    country: "Italy",
    category: "Castles",
    amenities: ["Wifi", "Pool", "Kitchen", "Free parking", "Air conditioning", "Patio or balcony", "BBQ grill", "Breakfast included"],
    bedrooms: 5,
    beds: 6,
    bathrooms: 5,
    maxGuests: 10,
    geometry: {
      type: "Point",
      coordinates: [11.2558, 43.7696],
    },
  },
  {
    title: "Modern Minimalist Loft overlooking Eiffel Tower",
    description: "Enjoy your morning espresso overlooking the iconic Eiffel Tower. This designer Parisian penthouse features bespoke furniture, chevron hardwood floors, marble countertops, and an intimate romantic balcony.",
    image: {
      filename: "paris_penthouse",
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    },
    price: 2800,
    location: "Paris, Île-de-France",
    country: "France",
    category: "Iconic Cities",
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Dedicated workspace", "Elevator", "Washer", "TV", "Coffee maker"],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    geometry: {
      type: "Point",
      coordinates: [2.3522, 48.8566],
    },
  },
  {
    title: "Traditional Machiya House in Historic Gion",
    description: "Step back in time in this beautifully preserved Japanese wooden townhouse. Features authentic tatami rooms, sliding shoji screens, a private Zen stone garden with Japanese maples, and a cedar wood soaking onsen tub.",
    image: {
      filename: "kyoto_machiya",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    },
    price: 2200,
    location: "Kyoto, Kansai",
    country: "Japan",
    category: "Rooms",
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Hot tub", "Garden view", "Tea room", "Washer", "Dedicated workspace"],
    bedrooms: 2,
    beds: 3,
    bathrooms: 1.5,
    maxGuests: 4,
    geometry: {
      type: "Point",
      coordinates: [135.7681, 35.0116],
    },
  },
  {
    title: "Cliffside Caldera Cave Suite with Private Plunge Pool",
    description: "Perched high on the volcanic cliffs of Oia, this whitewashed Cycladic cave house offers the world's most famous sunset views. Soak in your heated caldera-view plunge pool while sipping local Assyrtiko wine.",
    image: {
      filename: "santorini_suite",
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    },
    price: 3600,
    location: "Santorini, Cyclades",
    country: "Greece",
    category: "Amazing Pools",
    amenities: ["Wifi", "Pool", "Hot tub", "Air conditioning", "Breakfast included", "Sea view", "Patio or balcony"],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    geometry: {
      type: "Point",
      coordinates: [25.3753, 36.4618],
    },
  },
  {
    title: "Magical Bamboo Treehouse Oasis in Ubud Rainforest",
    description: "Immerse yourself in nature in this open-concept architectural bamboo paradise suspended high above the Ayung River valley. Enjoy an infinity pool, outdoor stone bathtub, and wake up to birdsong and mist.",
    image: {
      filename: "bali_treehouse",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    },
    price: 1900,
    location: "Ubud, Bali",
    country: "Indonesia",
    category: "Camping",
    amenities: ["Wifi", "Pool", "Kitchen", "Free parking", "Breakfast included", "Open air shower", "River view"],
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    geometry: {
      type: "Point",
      coordinates: [115.2625, -8.5069],
    },
  },
  {
    title: "Nordic Glass Dome with Aurora Borealis Views",
    description: "Sleep beneath the dancing Northern Lights in this heated thermal glass dome cabin. Features cozy reindeer pelts, automated skylights, a private sauna cabin, and direct access to Arctic wilderness snowshoe trails.",
    image: {
      filename: "arctic_igloo",
      url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    },
    price: 3100,
    location: "Tromsø, Troms",
    country: "Norway",
    category: "Arctic",
    amenities: ["Wifi", "Hot tub", "Heating", "Free parking", "Breakfast included", "Sauna", "Mountain view"],
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    geometry: {
      type: "Point",
      coordinates: [18.9553, 69.6492],
    },
  },
  {
    title: "Heritage Portuguese Villa with Pool in North Goa",
    description: "A sun-kissed 150-year-old Portuguese estate situated near Anjuna Beach. Features high wooden rafters, an expansive veranda overlooking lush palms, private turquoise swimming pool, and dedicated housekeeping.",
    image: {
      filename: "goa_villa",
      url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    },
    price: 2400,
    location: "Goa, Anjuna",
    country: "India",
    category: "Trending",
    amenities: ["Wifi", "Pool", "Kitchen", "Free parking", "Air conditioning", "Daily housekeeping", "Garden view", "BBQ grill"],
    bedrooms: 4,
    beds: 4,
    bathrooms: 4,
    maxGuests: 8,
    geometry: {
      type: "Point",
      coordinates: [73.7437, 15.5808],
    },
  },
  {
    title: "Luxury Houseboat on Dal Lake with Mountain Backdrop",
    description: "Handcrafted from fragrant deodar wood, this iconic Kashmir houseboat features intricate walnut wood carvings, Persian rugs, a spacious sun deck overlooking floating lotus gardens, and private shikara rides.",
    image: {
      filename: "kashmir_houseboat",
      url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    },
    price: 1800,
    location: "Srinagar, Kashmir",
    country: "India",
    category: "Boats",
    amenities: ["Wifi", "Kitchen", "Heating", "Breakfast included", "Lake view", "Dedicated workspace", "Balcony"],
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    maxGuests: 6,
    geometry: {
      type: "Point",
      coordinates: [74.8373, 34.0837],
    },
  },
  {
    title: "Organic Farmstay & Modern Eco-Cottage",
    description: "Recharge your senses on this working olive and lavender farm in the rolling hills of Provence. Enjoy fresh organic produce, cycling trails through fragrant orchards, and peaceful stargazing from the private cedar deck.",
    image: {
      filename: "provence_farm",
      url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    },
    price: 1600,
    location: "Aix-en-Provence",
    country: "France",
    category: "Farms",
    amenities: ["Wifi", "Kitchen", "Free parking", "Pet friendly", "Garden view", "EV charger", "Washer", "BBQ grill"],
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    maxGuests: 5,
    geometry: {
      type: "Point",
      coordinates: [5.4474, 43.5297],
    },
  },
  {
    title: "Futuristic Geodesic Stargazing Dome in Sedona",
    description: "A luxury climate-controlled geodesic dome located in the heart of Sedona's red rock vortexes. Experience breathtaking 360-degree desert views by day and telescope astronomy under clear dark skies by night.",
    image: {
      filename: "sedona_dome",
      url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    },
    price: 2100,
    location: "Sedona, Arizona",
    country: "United States",
    category: "Domes",
    amenities: ["Wifi", "Air conditioning", "Hot tub", "Free parking", "Telescope", "Patio or balcony", "Fire pit"],
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    maxGuests: 3,
    geometry: {
      type: "Point",
      coordinates: [-111.761, 34.8697],
    },
  },
  {
    title: "Modern Glass Villa with Lake Tahoe Views",
    description: "Spectacular contemporary architecture right on the shores of Lake Tahoe. Offers floor-to-ceiling windows, private boat dock, radiant floor heating, gourmet kitchen, and an expansive deck with gas fire pits.",
    image: {
      filename: "tahoe_lakehouse",
      url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    },
    price: 3400,
    location: "Lake Tahoe, California",
    country: "United States",
    category: "Beachfront",
    amenities: ["Wifi", "Kitchen", "Free parking", "Hot tub", "Indoor fireplace", "Waterfront", "Kayaks provided"],
    bedrooms: 4,
    beds: 5,
    bathrooms: 3.5,
    maxGuests: 8,
    geometry: {
      type: "Point",
      coordinates: [-120.0324, 39.0968],
    },
  },
  {
    title: "Palatial Royal Haveli with Mughal Courtyard",
    description: "Step into royal splendor in the Pink City. This historic Rajasthani palace features hand-carved jharokhas, marble fountains in the central courtyard, rooftop sunset dining overlooking the Aravalli hills, and royal hospitality.",
    image: {
      filename: "jaipur_haveli",
      url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    },
    price: 2600,
    location: "Jaipur, Rajasthan",
    country: "India",
    category: "Castles",
    amenities: ["Wifi", "Pool", "Air conditioning", "Breakfast included", "Free parking", "Spa services", "Courtyard view"],
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    maxGuests: 8,
    geometry: {
      type: "Point",
      coordinates: [75.7873, 26.9124],
    },
  },
  // --- NEW REGIONAL DATA ---
  // CHANDIGARH
  {
    title: "Home in Chandigarh",
    description: "Luxurious modern home in the heart of Chandigarh.",
    image: { filename: "chd_1", url: "https://images.unsplash.com/photo-1600607687920-4e2081cb8e43?auto=format&fit=crop&w=800&q=80" },
    price: 9700,
    location: "Chandigarh", country: "India", category: "Trending",
    amenities: ["Wifi", "Air conditioning", "Kitchen", "Free parking"],
    bedrooms: 3, beds: 3, bathrooms: 2, maxGuests: 6,
    geometry: { type: "Point", coordinates: [76.7794, 30.7333] }
  },
  {
    title: "Apartment in Sahibzada Ajit Singh Nagar",
    description: "Beautiful apartment near the city center with amazing interiors.",
    image: { filename: "chd_2", url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80" },
    price: 6500,
    location: "Chandigarh", country: "India", category: "Rooms",
    amenities: ["Wifi", "Air conditioning", "TV"],
    bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4,
    geometry: { type: "Point", coordinates: [76.7179, 30.7046] }
  },
  {
    title: "Guest suite in Chandigarh",
    description: "Cozy guest suite with a private garden.",
    image: { filename: "chd_3", url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80" },
    price: 5100,
    location: "Chandigarh", country: "India", category: "Trending",
    amenities: ["Wifi", "Garden view", "Free parking"],
    bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2,
    geometry: { type: "Point", coordinates: [76.7794, 30.7333] }
  },
  {
    title: "Villa in Chandigarh",
    description: "Spacious villa for a family getaway.",
    image: { filename: "chd_4", url: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80" },
    price: 9115,
    location: "Chandigarh", country: "India", category: "Castles",
    amenities: ["Wifi", "Pool", "Air conditioning", "Kitchen"],
    bedrooms: 4, beds: 4, bathrooms: 3, maxGuests: 8,
    geometry: { type: "Point", coordinates: [76.7794, 30.7333] }
  },
  
  // KASAULI
  {
    title: "Hilltop Cottage in Kasauli",
    description: "Enjoy panoramic views of the Himalayas.",
    image: { filename: "kas_1", url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80" },
    price: 7500,
    location: "Kasauli", country: "India", category: "Mountains",
    amenities: ["Wifi", "Mountain view", "Indoor fireplace"],
    bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4,
    geometry: { type: "Point", coordinates: [76.9646, 30.9013] }
  },
  {
    title: "Nature Retreat Guest House",
    description: "Immerse yourself in pine forests.",
    image: { filename: "kas_2", url: "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=800&q=80" },
    price: 4500,
    location: "Kasauli", country: "India", category: "Mountains",
    amenities: ["Wifi", "Patio or balcony", "Free parking"],
    bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2,
    geometry: { type: "Point", coordinates: [76.9646, 30.9013] }
  },
  {
    title: "Luxury Pine Villa",
    description: "Premium villa with an outdoor deck.",
    image: { filename: "kas_3", url: "https://images.unsplash.com/photo-1569493839904-c3cd43be3c5c?auto=format&fit=crop&w=800&q=80" },
    price: 12500,
    location: "Kasauli", country: "India", category: "Trending",
    amenities: ["Wifi", "Dedicated workspace", "BBQ grill"],
    bedrooms: 3, beds: 4, bathrooms: 3, maxGuests: 6,
    geometry: { type: "Point", coordinates: [76.9646, 30.9013] }
  },

  // ZIRAKPUR
  {
    title: "Room in Zirakpur",
    description: "Affordable and clean room for a quick stay.",
    image: { filename: "zir_1", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" },
    price: 1362,
    location: "Zirakpur", country: "India", category: "Rooms",
    amenities: ["Wifi", "Air conditioning"],
    bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2,
    geometry: { type: "Point", coordinates: [76.8226, 30.6425] }
  },
  {
    title: "Flat in Zirakpur",
    description: "Spacious flat with a city view.",
    image: { filename: "zir_2", url: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80" },
    price: 3312,
    location: "Zirakpur", country: "India", category: "Rooms",
    amenities: ["Wifi", "Kitchen", "Air conditioning"],
    bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4,
    geometry: { type: "Point", coordinates: [76.8226, 30.6425] }
  },
  {
    title: "Premium Apartment Zirakpur",
    description: "Premium apartment with access to swimming pool and gym.",
    image: { filename: "zir_3", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
    price: 4200,
    location: "Zirakpur", country: "India", category: "Trending",
    amenities: ["Wifi", "Pool", "Air conditioning", "Gym"],
    bedrooms: 3, beds: 3, bathrooms: 2, maxGuests: 6,
    geometry: { type: "Point", coordinates: [76.8226, 30.6425] }
  },

  // KHARAR
  {
    title: "Flat in Kharar",
    description: "Quiet flat away from the city noise.",
    image: { filename: "kha_1", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80" },
    price: 1291,
    location: "Kharar", country: "India", category: "Rooms",
    amenities: ["Wifi", "Free parking"],
    bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2,
    geometry: { type: "Point", coordinates: [76.6436, 30.7499] }
  },
  {
    title: "Room in Kharar",
    description: "Budget room for solo travelers.",
    image: { filename: "kha_2", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" },
    price: 1444,
    location: "Kharar", country: "India", category: "Rooms",
    amenities: ["Wifi"],
    bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 1,
    geometry: { type: "Point", coordinates: [76.6436, 30.7499] }
  },
  {
    title: "Home in Kharar",
    description: "Independent home with front yard.",
    image: { filename: "kha_3", url: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80" },
    price: 2296,
    location: "Kharar", country: "India", category: "Trending",
    amenities: ["Wifi", "Kitchen", "Air conditioning"],
    bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4,
    geometry: { type: "Point", coordinates: [76.6436, 30.7499] }
  },

  // DEHRADUN
  {
    title: "Valley View Cottage",
    description: "Wake up to misty mornings in Dehradun.",
    image: { filename: "deh_1", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" },
    price: 4500,
    location: "Dehradun", country: "India", category: "Mountains",
    amenities: ["Wifi", "Mountain view", "Garden view"],
    bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4,
    geometry: { type: "Point", coordinates: [78.0322, 30.3165] }
  },
  {
    title: "Urban Retreat",
    description: "Modern stay in the Doon valley.",
    image: { filename: "deh_2", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" },
    price: 5200,
    location: "Dehradun", country: "India", category: "Trending",
    amenities: ["Wifi", "Air conditioning", "Kitchen"],
    bedrooms: 2, beds: 3, bathrooms: 2, maxGuests: 5,
    geometry: { type: "Point", coordinates: [78.0322, 30.3165] }
  },

  // SHIMLA
  {
    title: "Heritage Woodhouse in Shimla",
    description: "Experience the colonial charm of Shimla.",
    image: { filename: "shi_1", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
    price: 8500,
    location: "Shimla", country: "India", category: "Mountains",
    amenities: ["Wifi", "Heating", "Mountain view", "Indoor fireplace"],
    bedrooms: 3, beds: 3, bathrooms: 2, maxGuests: 6,
    geometry: { type: "Point", coordinates: [77.1734, 31.1048] }
  },
  {
    title: "Cozy Studio near Mall Road",
    description: "Just a short walk from the famous Mall road.",
    image: { filename: "shi_2", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" },
    price: 3500,
    location: "Shimla", country: "India", category: "Rooms",
    amenities: ["Wifi", "Heating"],
    bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2,
    geometry: { type: "Point", coordinates: [77.1734, 31.1048] }
  },

  // --- FILL MALIBU, CALIFORNIA ---
  { title: "Modern Beach House", description: "Steps from the sand with ocean views and a private deck.", image: { filename: "mal2", url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80" }, price: 3800, location: "Malibu, California", country: "United States", category: "Beachfront", amenities: ["Wifi","Pool","Kitchen"], bedrooms: 3, beds: 3, bathrooms: 2, maxGuests: 6, geometry: { type: "Point", coordinates: [-118.6923, 34.038] } },
  { title: "Oceanfront Retreat", description: "Panoramic sea views and private beach access.", image: { filename: "mal3", url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80" }, price: 5200, location: "Malibu, California", country: "United States", category: "Beachfront", amenities: ["Wifi","Hot tub","Pool"], bedrooms: 4, beds: 5, bathrooms: 3, maxGuests: 8, geometry: { type: "Point", coordinates: [-118.6923, 34.038] } },
  { title: "Cliffside Studio", description: "Romantic studio perched above the Pacific.", image: { filename: "mal4", url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" }, price: 1800, location: "Malibu, California", country: "United States", category: "Beachfront", amenities: ["Wifi","Kitchen"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [-118.6923, 34.038] } },
  { title: "Malibu Guest House", description: "Bright, airy guesthouse with surfboard storage.", image: { filename: "mal5", url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" }, price: 2100, location: "Malibu, California", country: "United States", category: "Trending", amenities: ["Wifi","Free parking","BBQ grill"], bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [-118.6923, 34.038] } },
  { title: "Luxury Condo on PCH", description: "Right on Pacific Coast Highway with rooftop access.", image: { filename: "mal6", url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" }, price: 2900, location: "Malibu, California", country: "United States", category: "Trending", amenities: ["Wifi","Air conditioning","Pool"], bedrooms: 2, beds: 3, bathrooms: 2, maxGuests: 5, geometry: { type: "Point", coordinates: [-118.6923, 34.038] } },
  { title: "Canyon View Cabin", description: "Secluded cabin in the Malibu hills, minutes from the beach.", image: { filename: "mal7", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" }, price: 1600, location: "Malibu, California", country: "United States", category: "Camping", amenities: ["Wifi","BBQ grill","Free parking"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 3, geometry: { type: "Point", coordinates: [-118.6923, 34.038] } },

  // --- FILL ASPEN, COLORADO ---
  { title: "Ski-In Luxury Loft", description: "Modern ski-in/ski-out loft with mountain views and hot tub.", image: { filename: "asp2", url: "https://images.unsplash.com/photo-1600607687920-4e2081cb8e43?auto=format&fit=crop&w=800&q=80" }, price: 4200, location: "Aspen, Colorado", country: "United States", category: "Mountains", amenities: ["Wifi","Hot tub","Heating","Ski-in/Ski-out"], bedrooms: 2, beds: 3, bathrooms: 2, maxGuests: 5, geometry: { type: "Point", coordinates: [-106.8175, 39.1911] } },
  { title: "Cozy Mountain Cabin", description: "Rustic cabin with fireplace and snow views.", image: { filename: "asp3", url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80" }, price: 2200, location: "Aspen, Colorado", country: "United States", category: "Mountains", amenities: ["Wifi","Indoor fireplace","Heating"], bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [-106.8175, 39.1911] } },
  { title: "Victorian B&B Room", description: "Charming Victorian-era room in downtown Aspen.", image: { filename: "asp4", url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80" }, price: 1500, location: "Aspen, Colorado", country: "United States", category: "Rooms", amenities: ["Wifi","Breakfast included","Heating"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [-106.8175, 39.1911] } },
  { title: "Aspen Valley Lodge", description: "Family lodge with multiple rooms and a game room.", image: { filename: "asp5", url: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80" }, price: 3600, location: "Aspen, Colorado", country: "United States", category: "Mountains", amenities: ["Wifi","Kitchen","Free parking","Pool"], bedrooms: 4, beds: 6, bathrooms: 3, maxGuests: 9, geometry: { type: "Point", coordinates: [-106.8175, 39.1911] } },
  { title: "Powder Room Studio", description: "Budget-friendly studio walking distance to the lifts.", image: { filename: "asp6", url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80" }, price: 1100, location: "Aspen, Colorado", country: "United States", category: "Rooms", amenities: ["Wifi","Heating","Kitchen"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [-106.8175, 39.1911] } },
  { title: "Mountain Estate", description: "5-bedroom estate with private sledding hill and sauna.", image: { filename: "asp7", url: "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=800&q=80" }, price: 6500, location: "Aspen, Colorado", country: "United States", category: "Castles", amenities: ["Wifi","Hot tub","Sauna","Kitchen","Free parking"], bedrooms: 5, beds: 7, bathrooms: 4, maxGuests: 12, geometry: { type: "Point", coordinates: [-106.8175, 39.1911] } },

  // --- FILL FLORENCE, TUSCANY ---
  { title: "Apartment near Uffizi", description: "Walk to the Uffizi Gallery from this stylish city apartment.", image: { filename: "flo2", url: "https://images.unsplash.com/photo-1569493839904-c3cd43be3c5c?auto=format&fit=crop&w=800&q=80" }, price: 1400, location: "Florence, Tuscany", country: "Italy", category: "Iconic Cities", amenities: ["Wifi","Air conditioning","Kitchen"], bedrooms: 1, beds: 2, bathrooms: 1, maxGuests: 3, geometry: { type: "Point", coordinates: [11.2558, 43.7696] } },
  { title: "Rooftop Terrace Loft", description: "Terracotta rooftop views over the Arno river.", image: { filename: "flo3", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" }, price: 1800, location: "Florence, Tuscany", country: "Italy", category: "Trending", amenities: ["Wifi","Patio or balcony","Air conditioning"], bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [11.2558, 43.7696] } },
  { title: "Chianti Countryside Villa", description: "Private villa surrounded by vineyards and olive groves.", image: { filename: "flo4", url: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80" }, price: 2800, location: "Florence, Tuscany", country: "Italy", category: "Castles", amenities: ["Wifi","Pool","Kitchen","BBQ grill","Free parking"], bedrooms: 4, beds: 5, bathrooms: 3, maxGuests: 8, geometry: { type: "Point", coordinates: [11.2558, 43.7696] } },
  { title: "Historic Palazzo Suite", description: "Sleep in a 15th century palazzo in the historic center.", image: { filename: "flo5", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" }, price: 2200, location: "Florence, Tuscany", country: "Italy", category: "Castles", amenities: ["Wifi","Air conditioning","Breakfast included"], bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4, geometry: { type: "Point", coordinates: [11.2558, 43.7696] } },
  { title: "Garden Studio in Oltrarno", description: "Charming studio with private garden in the artisan quarter.", image: { filename: "flo6", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80" }, price: 900, location: "Florence, Tuscany", country: "Italy", category: "Rooms", amenities: ["Wifi","Garden view","Kitchen"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [11.2558, 43.7696] } },

  // --- FILL PARIS ---
  { title: "Montmartre Artist Flat", description: "Bohemian flat with Eiffel Tower views and vintage decor.", image: { filename: "par2", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" }, price: 1500, location: "Paris, Île-de-France", country: "France", category: "Iconic Cities", amenities: ["Wifi","Air conditioning","Kitchen"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [2.3522, 48.8566] } },
  { title: "Le Marais Luxury Studio", description: "Chic studio in the trendiest neighborhood in Paris.", image: { filename: "par3", url: "https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80" }, price: 1900, location: "Paris, Île-de-France", country: "France", category: "Trending", amenities: ["Wifi","Air conditioning"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [2.3522, 48.8566] } },
  { title: "Haussmann Boulevard Apartment", description: "Classic Haussmann-style apartment with herringbone floors.", image: { filename: "par4", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" }, price: 2400, location: "Paris, Île-de-France", country: "France", category: "Iconic Cities", amenities: ["Wifi","Kitchen","Air conditioning"], bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [2.3522, 48.8566] } },
  { title: "Seine River View Suite", description: "Stunning Seine views from this top-floor apartment.", image: { filename: "par5", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" }, price: 3100, location: "Paris, Île-de-France", country: "France", category: "Trending", amenities: ["Wifi","Air conditioning","Patio or balcony"], bedrooms: 2, beds: 3, bathrooms: 2, maxGuests: 5, geometry: { type: "Point", coordinates: [2.3522, 48.8566] } },
  { title: "Saint-Germain Cozy Room", description: "Private room in the intellectual heart of Paris.", image: { filename: "par6", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" }, price: 700, location: "Paris, Île-de-France", country: "France", category: "Rooms", amenities: ["Wifi","Breakfast included"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 1, geometry: { type: "Point", coordinates: [2.3522, 48.8566] } },
  { title: "Versailles Countryside Retreat", description: "Peaceful countryside home near the Palace of Versailles.", image: { filename: "par7", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" }, price: 1200, location: "Paris, Île-de-France", country: "France", category: "Castles", amenities: ["Wifi","Garden view","Free parking","Kitchen"], bedrooms: 3, beds: 3, bathrooms: 2, maxGuests: 6, geometry: { type: "Point", coordinates: [2.3522, 48.8566] } },

  // --- FILL KYOTO ---
  { title: "Traditional Machiya Townhouse", description: "Authentic Kyoto townhouse with bamboo garden and tatami rooms.", image: { filename: "kyo2", url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80" }, price: 2100, location: "Kyoto, Kansai", country: "Japan", category: "Castles", amenities: ["Wifi","Kitchen","Japanese bath"], bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [135.7681, 35.0116] } },
  { title: "Arashiyama Forest Cabin", description: "Secluded cabin near the bamboo groves of Arashiyama.", image: { filename: "kyo3", url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80" }, price: 1700, location: "Kyoto, Kansai", country: "Japan", category: "Camping", amenities: ["Wifi","Kitchen","Garden view"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [135.7681, 35.0116] } },
  { title: "Higashiyama Guest Inn", description: "Traditional inn in the cobblestone Higashiyama district.", image: { filename: "kyo4", url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" }, price: 900, location: "Kyoto, Kansai", country: "Japan", category: "Rooms", amenities: ["Wifi","Breakfast included"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [135.7681, 35.0116] } },
  { title: "Modern Zen Apartment", description: "Minimalist apartment blending modern design with Zen aesthetics.", image: { filename: "kyo5", url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" }, price: 1300, location: "Kyoto, Kansai", country: "Japan", category: "Trending", amenities: ["Wifi","Air conditioning","Kitchen"], bedrooms: 1, beds: 2, bathrooms: 1, maxGuests: 3, geometry: { type: "Point", coordinates: [135.7681, 35.0116] } },
  { title: "Nishiki Market Flat", description: "Heart of Kyoto, 2 min walk to the famous Nishiki food market.", image: { filename: "kyo6", url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" }, price: 1600, location: "Kyoto, Kansai", country: "Japan", category: "Iconic Cities", amenities: ["Wifi","Kitchen","Air conditioning"], bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [135.7681, 35.0116] } },

  // --- FILL SANTORINI ---
  { title: "Caldera Cave House", description: "Iconic whitewashed cave house carved into the caldera cliff.", image: { filename: "san2", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" }, price: 4800, location: "Santorini, Cyclades", country: "Greece", category: "Trending", amenities: ["Wifi","Hot tub","Patio or balcony","Air conditioning"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [25.4319, 36.3932] } },
  { title: "Oia Sunset Villa", description: "Iconic Oia blue-domed villa with breathtaking sunset views.", image: { filename: "san3", url: "https://images.unsplash.com/photo-1600607687920-4e2081cb8e43?auto=format&fit=crop&w=800&q=80" }, price: 3600, location: "Santorini, Cyclades", country: "Greece", category: "Amazing Pools", amenities: ["Wifi","Pool","Patio or balcony","Breakfast included"], bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4, geometry: { type: "Point", coordinates: [25.4319, 36.3932] } },
  { title: "Fira Studio with Sea View", description: "Budget-friendly studio in the capital Fira, sea views included.", image: { filename: "san4", url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80" }, price: 1200, location: "Santorini, Cyclades", country: "Greece", category: "Rooms", amenities: ["Wifi","Air conditioning"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [25.4319, 36.3932] } },
  { title: "Perissa Black Beach House", description: "Modern house on the famous black volcanic sand beach.", image: { filename: "san5", url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80" }, price: 2200, location: "Santorini, Cyclades", country: "Greece", category: "Beachfront", amenities: ["Wifi","Pool","Kitchen","Free parking"], bedrooms: 3, beds: 3, bathrooms: 2, maxGuests: 6, geometry: { type: "Point", coordinates: [25.4319, 36.3932] } },
  { title: "Akrotiri Cliffside Suite", description: "Exclusive suite near the ancient ruins of Akrotiri.", image: { filename: "san6", url: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80" }, price: 5500, location: "Santorini, Cyclades", country: "Greece", category: "Castles", amenities: ["Wifi","Pool","Hot tub","Breakfast included","Air conditioning"], bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4, geometry: { type: "Point", coordinates: [25.4319, 36.3932] } },

  // --- FILL UBUD, BALI ---
  { title: "Rice Terrace Bungalow", description: "Open-air bungalow overlooking lush Tegallalang rice terraces.", image: { filename: "uba2", url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80" }, price: 1100, location: "Ubud, Bali", country: "Indonesia", category: "Trending", amenities: ["Wifi","Pool","Breakfast included"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [115.2624, -8.5069] } },
  { title: "Jungle Infinity Pool Villa", description: "Private villa with infinity pool overlooking the jungle canopy.", image: { filename: "uba3", url: "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=800&q=80" }, price: 2800, location: "Ubud, Bali", country: "Indonesia", category: "Amazing Pools", amenities: ["Wifi","Pool","Kitchen","Breakfast included"], bedrooms: 2, beds: 2, bathrooms: 2, maxGuests: 4, geometry: { type: "Point", coordinates: [115.2624, -8.5069] } },
  { title: "Traditional Balinese Compound", description: "Authentic compound-style home with temple and garden.", image: { filename: "uba4", url: "https://images.unsplash.com/photo-1569493839904-c3cd43be3c5c?auto=format&fit=crop&w=800&q=80" }, price: 1800, location: "Ubud, Bali", country: "Indonesia", category: "Castles", amenities: ["Wifi","Pool","Patio or balcony"], bedrooms: 3, beds: 3, bathrooms: 3, maxGuests: 6, geometry: { type: "Point", coordinates: [115.2624, -8.5069] } },
  { title: "Artist Studio in Ubud", description: "Serene studio in an art community, walk to galleries.", image: { filename: "uba5", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" }, price: 700, location: "Ubud, Bali", country: "Indonesia", category: "Rooms", amenities: ["Wifi","Breakfast included","Garden view"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [115.2624, -8.5069] } },
  { title: "River Valley Treehouse", description: "A magical treehouse above the Ayung River gorge.", image: { filename: "uba6", url: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80" }, price: 3400, location: "Ubud, Bali", country: "Indonesia", category: "Camping", amenities: ["Wifi","Pool","Breakfast included","Patio or balcony"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [115.2624, -8.5069] } },

  // --- FILL TROMSO ---
  { title: "Glass Igloo Under Northern Lights", description: "Heated glass igloo for the ultimate aurora experience.", image: { filename: "tro2", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" }, price: 5200, location: "Tromsø, Troms", country: "Norway", category: "Arctic", amenities: ["Wifi","Heating","Breakfast included"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [18.9553, 69.6492] } },
  { title: "Norwegian Wooden Cabin", description: "Traditional hytte (cabin) by the fjord with sauna.", image: { filename: "tro3", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80" }, price: 2100, location: "Tromsø, Troms", country: "Norway", category: "Arctic", amenities: ["Wifi","Indoor fireplace","Heating","Sauna"], bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [18.9553, 69.6492] } },
  { title: "City Centre Arctic Apartment", description: "Modern apartment in the heart of Tromsø, city and fjord views.", image: { filename: "tro4", url: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80" }, price: 1400, location: "Tromsø, Troms", country: "Norway", category: "Iconic Cities", amenities: ["Wifi","Heating","Kitchen"], bedrooms: 1, beds: 2, bathrooms: 1, maxGuests: 3, geometry: { type: "Point", coordinates: [18.9553, 69.6492] } },
  { title: "Midnight Sun Farmhouse", description: "Experience 24-hr summer daylight in this cozy farmhouse.", image: { filename: "tro5", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" }, price: 1800, location: "Tromsø, Troms", country: "Norway", category: "Farms", amenities: ["Wifi","Kitchen","Free parking","Patio or balcony"], bedrooms: 3, beds: 3, bathrooms: 2, maxGuests: 6, geometry: { type: "Point", coordinates: [18.9553, 69.6492] } },
  { title: "Polar Expedition Base", description: "Kitted-out base for Arctic hikes and whale watching tours.", image: { filename: "tro6", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" }, price: 3000, location: "Tromsø, Troms", country: "Norway", category: "Arctic", amenities: ["Wifi","Heating","Kitchen","Free parking"], bedrooms: 2, beds: 3, bathrooms: 1, maxGuests: 5, geometry: { type: "Point", coordinates: [18.9553, 69.6492] } },

  // --- FILL GOA ---
  { title: "Beachfront Shack, Anjuna", description: "Iconic rustic shack right on Anjuna beach.", image: { filename: "goa2", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" }, price: 1800, location: "Goa, Anjuna", country: "India", category: "Beachfront", amenities: ["Wifi","Air conditioning","Patio or balcony"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [73.7408, 15.5736] } },
  { title: "Portuguese Heritage Villa", description: "Beautiful colonial-era Portuguese villa with pool and garden.", image: { filename: "goa3", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" }, price: 4500, location: "Goa, Anjuna", country: "India", category: "Castles", amenities: ["Wifi","Pool","Kitchen","Free parking"], bedrooms: 4, beds: 5, bathrooms: 3, maxGuests: 8, geometry: { type: "Point", coordinates: [73.7408, 15.5736] } },
  { title: "Jungle Eco Cottage", description: "Sustainable eco-cottage surrounded by coconut palms.", image: { filename: "goa4", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" }, price: 900, location: "Goa, Anjuna", country: "India", category: "Camping", amenities: ["Wifi","Garden view","Breakfast included"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [73.7408, 15.5736] } },
  { title: "Party Villa near Curlies", description: "5-bed villa with pool, DJ deck, near the famous Curlies shack.", image: { filename: "goa5", url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80" }, price: 6000, location: "Goa, Anjuna", country: "India", category: "Amazing Pools", amenities: ["Wifi","Pool","Air conditioning","Kitchen","BBQ grill"], bedrooms: 5, beds: 6, bathrooms: 4, maxGuests: 10, geometry: { type: "Point", coordinates: [73.7408, 15.5736] } },
  { title: "Budget Hostel Private Room", description: "Clean private room in a social hostel near the beach.", image: { filename: "goa6", url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80" }, price: 600, location: "Goa, Anjuna", country: "India", category: "Rooms", amenities: ["Wifi","Air conditioning"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [73.7408, 15.5736] } },

  // --- FILL SRINAGAR ---
  { title: "Traditional Houseboat on Dal Lake", description: "Classic Kashmiri houseboat with hand-carved woodwork on Dal Lake.", image: { filename: "sri2", url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" }, price: 2200, location: "Srinagar, Kashmir", country: "India", category: "Boats", amenities: ["Wifi","Breakfast included","Shikara ride"], bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [74.8007, 34.0836] } },
  { title: "Mughal Garden Cottage", description: "Stay beside the famous Mughal Gardens with mountain backdrop.", image: { filename: "sri3", url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" }, price: 1400, location: "Srinagar, Kashmir", country: "India", category: "Castles", amenities: ["Wifi","Garden view","Heating","Free parking"], bedrooms: 2, beds: 3, bathrooms: 1, maxGuests: 5, geometry: { type: "Point", coordinates: [74.8007, 34.0836] } },
  { title: "Chinar Tree Guesthouse", description: "Cozy guesthouse under ancient chinar trees, run by a local family.", image: { filename: "sri4", url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" }, price: 800, location: "Srinagar, Kashmir", country: "India", category: "Rooms", amenities: ["Wifi","Breakfast included","Heating"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [74.8007, 34.0836] } },
  { title: "Pahalgam Valley View Lodge", description: "Lodge in the meadows of Pahalgam near Srinagar.", image: { filename: "sri5", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80" }, price: 1700, location: "Srinagar, Kashmir", country: "India", category: "Mountains", amenities: ["Wifi","Mountain view","Kitchen","Free parking"], bedrooms: 3, beds: 4, bathrooms: 2, maxGuests: 7, geometry: { type: "Point", coordinates: [74.8007, 34.0836] } },
  { title: "Dal Lake Luxury Houseboat", description: "Premium deluxe houseboat with all-day shikara service.", image: { filename: "sri6", url: "https://images.unsplash.com/photo-1600607687920-4e2081cb8e43?auto=format&fit=crop&w=800&q=80" }, price: 4000, location: "Srinagar, Kashmir", country: "India", category: "Boats", amenities: ["Wifi","Breakfast included","Pool","Air conditioning"], bedrooms: 3, beds: 3, bathrooms: 2, maxGuests: 6, geometry: { type: "Point", coordinates: [74.8007, 34.0836] } },

  // --- FILL AIX-EN-PROVENCE ---
  { title: "Provençal Mas with Pool", description: "Classic stone farmhouse (mas) surrounded by lavender fields.", image: { filename: "aix2", url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80" }, price: 2600, location: "Aix-en-Provence", country: "France", category: "Farms", amenities: ["Wifi","Pool","Kitchen","BBQ grill","Free parking"], bedrooms: 4, beds: 5, bathrooms: 3, maxGuests: 8, geometry: { type: "Point", coordinates: [5.4474, 43.5297] } },
  { title: "Cours Mirabeau Flat", description: "Charming flat on the most beautiful boulevard in France.", image: { filename: "aix3", url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80" }, price: 1200, location: "Aix-en-Provence", country: "France", category: "Iconic Cities", amenities: ["Wifi","Air conditioning","Kitchen"], bedrooms: 1, beds: 2, bathrooms: 1, maxGuests: 3, geometry: { type: "Point", coordinates: [5.4474, 43.5297] } },
  { title: "Vineyard Guest Room", description: "Private room on a working wine estate outside Aix.", image: { filename: "aix4", url: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=800&q=80" }, price: 850, location: "Aix-en-Provence", country: "France", category: "Rooms", amenities: ["Wifi","Breakfast included","Free parking","Garden view"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [5.4474, 43.5297] } },
  { title: "Lavender Hill Studio", description: "Dreamy studio with lavender views and outdoor terrace.", image: { filename: "aix5", url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80" }, price: 1600, location: "Aix-en-Provence", country: "France", category: "Trending", amenities: ["Wifi","Patio or balcony","Air conditioning"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [5.4474, 43.5297] } },
  { title: "Sainte-Victoire Mountain Retreat", description: "Hike from the door of this mountain house, Cézanne's view.", image: { filename: "aix6", url: "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=800&q=80" }, price: 2000, location: "Aix-en-Provence", country: "France", category: "Mountains", amenities: ["Wifi","Pool","Free parking","Kitchen"], bedrooms: 3, beds: 3, bathrooms: 2, maxGuests: 6, geometry: { type: "Point", coordinates: [5.4474, 43.5297] } },

  // --- FILL SEDONA, ARIZONA ---
  { title: "Red Rock Vortex Cabin", description: "Mystic cabin with unobstructed red rock panoramas.", image: { filename: "sed2", url: "https://images.unsplash.com/photo-1569493839904-c3cd43be3c5c?auto=format&fit=crop&w=800&q=80" }, price: 2400, location: "Sedona, Arizona", country: "United States", category: "Mountains", amenities: ["Wifi","Hot tub","Patio or balcony","Free parking"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [-111.7632, 34.8697] } },
  { title: "Sedona Desert Casita", description: "Adobe casita with private courtyard and desert garden.", image: { filename: "sed3", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" }, price: 1600, location: "Sedona, Arizona", country: "United States", category: "Trending", amenities: ["Wifi","Pool","Kitchen","BBQ grill"], bedrooms: 2, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [-111.7632, 34.8697] } },
  { title: "Cathedral Rock View Home", description: "Family home with massive Cathedral Rock views from the porch.", image: { filename: "sed4", url: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=80" }, price: 3200, location: "Sedona, Arizona", country: "United States", category: "Mountains", amenities: ["Wifi","Hot tub","Pool","Kitchen","Free parking"], bedrooms: 4, beds: 5, bathrooms: 3, maxGuests: 8, geometry: { type: "Point", coordinates: [-111.7632, 34.8697] } },
  { title: "Mystic Dome Glamping", description: "Geodesic dome on a mesa with a sky full of stars.", image: { filename: "sed5", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" }, price: 1900, location: "Sedona, Arizona", country: "United States", category: "Domes", amenities: ["Wifi","Patio or balcony","Heating"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [-111.7632, 34.8697] } },
  { title: "Uptown Sedona Studio", description: "Walkable studio in the heart of Uptown Sedona shopping.", image: { filename: "sed6", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80" }, price: 900, location: "Sedona, Arizona", country: "United States", category: "Rooms", amenities: ["Wifi","Air conditioning","Free parking"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [-111.7632, 34.8697] } },

  // --- FILL LAKE TAHOE ---
  { title: "Lakeview Ski Chalet", description: "Ski-out chalet with floor-to-ceiling lake and mountain views.", image: { filename: "tah2", url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80" }, price: 3800, location: "Lake Tahoe, California", country: "United States", category: "Mountains", amenities: ["Wifi","Hot tub","Kitchen","Free parking","Ski-in/Ski-out"], bedrooms: 3, beds: 4, bathrooms: 2, maxGuests: 7, geometry: { type: "Point", coordinates: [-120.0, 39.0968] } },
  { title: "Sandy Beach Cottage", description: "Private sandy beach access, kayaks and paddleboards included.", image: { filename: "tah3", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" }, price: 2900, location: "Lake Tahoe, California", country: "United States", category: "Beachfront", amenities: ["Wifi","Kitchen","BBQ grill","Free parking"], bedrooms: 2, beds: 3, bathrooms: 1, maxGuests: 5, geometry: { type: "Point", coordinates: [-120.0, 39.0968] } },
  { title: "Tahoe City Condo", description: "Modern condo steps from restaurants, bars, and the marina.", image: { filename: "tah4", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" }, price: 1400, location: "Lake Tahoe, California", country: "United States", category: "Rooms", amenities: ["Wifi","Air conditioning","Kitchen"], bedrooms: 1, beds: 2, bathrooms: 1, maxGuests: 3, geometry: { type: "Point", coordinates: [-120.0, 39.0968] } },
  { title: "Incline Village Luxury Home", description: "Exclusive Incline Village home with pool table and home cinema.", image: { filename: "tah5", url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" }, price: 5500, location: "Lake Tahoe, California", country: "United States", category: "Amazing Pools", amenities: ["Wifi","Pool","Hot tub","Kitchen","Free parking"], bedrooms: 5, beds: 7, bathrooms: 4, maxGuests: 12, geometry: { type: "Point", coordinates: [-120.0, 39.0968] } },
  { title: "Meeks Bay Camping Cabin", description: "Rustic cabin minutes from Meeks Bay with hammocks and fire pit.", image: { filename: "tah6", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" }, price: 800, location: "Lake Tahoe, California", country: "United States", category: "Camping", amenities: ["Wifi","BBQ grill","Free parking"], bedrooms: 1, beds: 2, bathrooms: 1, maxGuests: 4, geometry: { type: "Point", coordinates: [-120.0, 39.0968] } },

  // --- FILL JAIPUR ---
  { title: "City Palace View Room", description: "Boutique heritage room with a view of the magnificent City Palace.", image: { filename: "jai2", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" }, price: 1500, location: "Jaipur, Rajasthan", country: "India", category: "Castles", amenities: ["Wifi","Air conditioning","Breakfast included"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [75.7873, 26.9124] } },
  { title: "Rooftop Terrace Guesthouse", description: "Panoramic Pink City views from this vibrant rooftop guesthouse.", image: { filename: "jai3", url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80" }, price: 800, location: "Jaipur, Rajasthan", country: "India", category: "Trending", amenities: ["Wifi","Air conditioning","Breakfast included"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [75.7873, 26.9124] } },
  { title: "Rajput Heritage Bungalow", description: "Traditional Rajasthani bungalow with private courtyard and fountain.", image: { filename: "jai4", url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80" }, price: 3200, location: "Jaipur, Rajasthan", country: "India", category: "Castles", amenities: ["Wifi","Pool","Air conditioning","Kitchen","Free parking"], bedrooms: 3, beds: 4, bathrooms: 3, maxGuests: 7, geometry: { type: "Point", coordinates: [75.7873, 26.9124] } },
  { title: "Amber Fort View Cottage", description: "Cozy cottage with a stunning view of the illuminated Amber Fort.", image: { filename: "jai5", url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" }, price: 1200, location: "Jaipur, Rajasthan", country: "India", category: "Rooms", amenities: ["Wifi","Air conditioning","Breakfast included"], bedrooms: 1, beds: 2, bathrooms: 1, maxGuests: 3, geometry: { type: "Point", coordinates: [75.7873, 26.9124] } },
  { title: "Luxury Desert Camp", description: "Glamping tents at the edge of the Thar Desert with bonfire dinners.", image: { filename: "jai6", url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" }, price: 2500, location: "Jaipur, Rajasthan", country: "India", category: "Camping", amenities: ["Wifi","Breakfast included","Patio or balcony","Free parking"], bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2, geometry: { type: "Point", coordinates: [75.7873, 26.9124] } }
];

const discountedListings = sampleListings.map((listing) => ({
  ...listing,
  price: Math.round(listing.price * 0.8),
}));

const distinguishingAmenities = [
  "Wifi",
  "Kitchen",
  "Air conditioning",
  "Free parking",
  "Pool",
  "Hot tub",
  "Dedicated workspace",
  "TV",
  "Coffee maker",
  "Indoor fireplace",
  "Breakfast included",
  "Pet friendly",
  "Washer",
  "Dryer",
  "Patio or balcony",
  "BBQ grill",
  "Heating",
  "Sauna",
  "Garden view",
  "Mountain view",
  "Lake view",
  "Sea view",
  "EV charger",
  "Elevator",
  "Fire pit",
  "Telescope",
  "Gym",
  "Daily housekeeping",
  "Waterfront",
  "Kayaks provided",
  "Spa services",
  "Courtyard view",
  "Tea room",
  "Open air shower",
  "River view",
  "Japanese bath",
  "Shikara ride",
  "Ski-in/Ski-out",
];

const seenAmenitySets = new Set();
const uniqueListings = discountedListings.map((listing, index) => {
  const amenities = (listing.amenities || []).filter((amenity) => amenity !== "Wifi");
  if (amenities.length === 0) {
    amenities.push(distinguishingAmenities[index % distinguishingAmenities.length]);
  }
  let offset = 0;
  let key = amenities.slice().sort().join("|");

  while (seenAmenitySets.has(key)) {
    const amenity = distinguishingAmenities[(index + offset) % distinguishingAmenities.length];
    if (!amenities.includes(amenity)) amenities.push(amenity);
    offset += 1;
    key = amenities.slice().sort().join("|");
  }

  seenAmenitySets.add(key);
  return { ...listing, amenities };
});

module.exports = { data: uniqueListings };