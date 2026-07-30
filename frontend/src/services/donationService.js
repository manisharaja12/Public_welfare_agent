export const DONATION_TYPES = [
  { id: 'blood',    icon: '🩸', label: 'Blood' },
  { id: 'clothes',  icon: '👕', label: 'Clothes' },
  { id: 'books',    icon: '📚', label: 'Books' },
  { id: 'food',     icon: '🍱', label: 'Food' },
  { id: 'toys',     icon: '🧸', label: 'Toys' },
  { id: 'blankets', icon: '🛏', label: 'Blankets' },
]

export const VOLUNTEERS = [
  { name: 'Raj',   phone: '9876500001', vehicle: 'TN38AB1234', rating: '4.9' },
  { name: 'Priya', phone: '9876500002', vehicle: 'TN11CD5678', rating: '4.8' },
  { name: 'Arjun', phone: '9876500003', vehicle: 'TN22EF9012', rating: '4.7' },
  { name: 'Meena', phone: '9876500004', vehicle: 'TN33GH3456', rating: '5.0' },
]

export const BENEFICIARIES = {
  blood:    { count: '3 patients',   unit: 'units of blood', verb: 'saved' },
  clothes:  { count: '28 children',  unit: 'clothes',        verb: 'received your' },
  books:    { count: '45 children',  unit: 'books',          verb: 'received your' },
  food:     { count: '60 people',    unit: 'meals',          verb: 'received your' },
  toys:     { count: '32 children',  unit: 'toys',           verb: 'received your' },
  blankets: { count: '18 families',  unit: 'blankets',       verb: 'received your' },
}

export const ORGANISATIONS = {
  blood: [
    { name: 'Government Blood Bank', reason: 'Critically needs O+ and B+ donors this week.', distance: '1.2 km', type: 'Blood Bank', open: true, address: 'Civil Hospital Road, Coimbatore', phone: '9876501234', hours: '8 AM – 8 PM', needs: ['O+ Blood', 'B+ Blood', 'A- Blood', 'Platelet Donors'] },
    { name: 'Red Cross Society', reason: 'Running a blood donation camp for accident victims.', distance: '2.8 km', type: 'NGO', open: true, address: 'Race Course Road, Coimbatore', phone: '9876502345', hours: '9 AM – 5 PM', needs: ['All Blood Groups', 'Regular Donors', 'Emergency Donors'] },
    { name: 'City Hospital Blood Centre', reason: 'Urgent requirement for surgery patients.', distance: '3.5 km', type: 'Hospital', open: false, address: 'Avinashi Road, Coimbatore', phone: '9876503456', hours: '10 AM – 4 PM', needs: ['O- Blood', 'AB+ Blood', 'Rare Blood Groups'] },
  ],
  clothes: [
    { name: 'Helping Hands Orphanage', reason: "Currently needs children's clothes urgently.", distance: '3.2 km', type: 'Orphanage', open: true, address: 'Gandhipuram, Coimbatore', phone: '9876543210', hours: '9 AM – 6 PM', needs: ["Children's Clothes", 'Toys', 'School Bags', 'Shoes (Kids)'] },
    { name: 'Sneha Old Age Home', reason: 'Needs warm clothes for elderly residents.', distance: '4.1 km', type: 'Old Age Home', open: true, address: 'RS Puram, Coimbatore', phone: '9876504567', hours: '8 AM – 7 PM', needs: ["Men's Clothes", "Women's Clothes", 'Sweaters', 'Blankets'] },
    { name: 'Smile Foundation', reason: 'Distributing clothes to flood-affected families.', distance: '5.0 km', type: 'NGO', open: false, address: 'Peelamedu, Coimbatore', phone: '9876505678', hours: '10 AM – 5 PM', needs: ['All Clothes', 'Raincoats', 'Footwear', 'Undergarments (New)'] },
  ],
  books: [
    { name: 'Govt. Primary School', reason: 'Students from low-income families need textbooks.', distance: '1.8 km', type: 'School', open: true, address: 'Saibaba Colony, Coimbatore', phone: '9876506789', hours: '9 AM – 4 PM', needs: ['Class 1–5 Textbooks', 'Notebooks', 'Stationery', 'School Bags'] },
    { name: 'Parikrma Learning Centre', reason: 'Needs books for classes 6–10 students.', distance: '2.5 km', type: 'NGO School', open: true, address: 'Singanallur, Coimbatore', phone: '9876507890', hours: '8 AM – 6 PM', needs: ['Class 6–10 Textbooks', 'Science Books', 'Maths Guides', 'Dictionaries'] },
    { name: 'Public Library Trust', reason: 'Building a free library for underprivileged youth.', distance: '3.9 km', type: 'Library', open: true, address: 'Town Hall Road, Coimbatore', phone: '9876508901', hours: '10 AM – 7 PM', needs: ['Story Books', 'Novels', 'Reference Books', 'Magazines'] },
  ],
  food: [
    { name: 'Akshaya Patra Foundation', reason: 'Feeds 500+ school children daily — needs supplies.', distance: '2.0 km', type: 'NGO', open: true, address: 'Vadavalli, Coimbatore', phone: '9876509012', hours: '7 AM – 2 PM', needs: ['Rice', 'Dal', 'Vegetables', 'Cooking Oil', 'Spices'] },
    { name: 'Robin Hood Army', reason: 'Distributes surplus food to homeless every evening.', distance: '1.5 km', type: 'Volunteer Group', open: true, address: 'Ukkadam, Coimbatore', phone: '9876510123', hours: '5 PM – 9 PM', needs: ['Cooked Meals', 'Packed Food', 'Biscuits', 'Water Bottles'] },
    { name: 'Annadhanam Trust', reason: "Provides free meals to hospital patients' families.", distance: '4.2 km', type: 'Trust', open: true, address: 'Ramanathapuram, Coimbatore', phone: '9876511234', hours: '6 AM – 8 PM', needs: ['Cooked Rice', 'Sambar', 'Dry Ration Kits', 'Fruits'] },
  ],
  toys: [
    { name: "Rainbow Children's Home", reason: 'Children here rarely receive new toys or gifts.', distance: '2.7 km', type: 'Orphanage', open: true, address: 'Kuniyamuthur, Coimbatore', phone: '9876512345', hours: '9 AM – 6 PM', needs: ['Soft Toys', 'Board Games', 'Colouring Books', 'Puzzles'] },
    { name: 'Govt. Child Care Centre', reason: 'Needs toys for developmental activities.', distance: '3.3 km', type: 'Govt. Centre', open: true, address: 'Hopes College Road, Coimbatore', phone: '9876513456', hours: '10 AM – 5 PM', needs: ['Educational Toys', 'Building Blocks', 'Art Supplies', 'Story Books'] },
    { name: 'Little Stars NGO', reason: 'Organising a toy drive for underprivileged kids.', distance: '5.1 km', type: 'NGO', open: false, address: 'Podanur, Coimbatore', phone: '9876514567', hours: '9 AM – 5 PM', needs: ['All Toys', 'Sports Equipment', 'Dolls', 'Remote Control Toys'] },
  ],
  blankets: [
    { name: 'Night Shelter Trust', reason: 'Homeless people urgently need blankets this winter.', distance: '1.9 km', type: 'Shelter', open: true, address: 'Gandhipuram Bus Stand Area, Coimbatore', phone: '9876515678', hours: '8 AM – 8 PM', needs: ['Woollen Blankets', 'Shawls', 'Warm Clothes', 'Sleeping Mats'] },
    { name: 'Sneha Old Age Home', reason: 'Elderly residents need extra blankets for cold nights.', distance: '4.1 km', type: 'Old Age Home', open: true, address: 'RS Puram, Coimbatore', phone: '9876504567', hours: '8 AM – 7 PM', needs: ['Blankets', 'Sweaters', 'Warm Socks', 'Woollen Caps'] },
    { name: 'Flood Relief Camp', reason: 'Displaced families need blankets and warm supplies.', distance: '6.0 km', type: 'Relief Camp', open: true, address: 'Mettupalayam Road, Coimbatore', phone: '9876516789', hours: '24 Hours Open', needs: ['Blankets', 'Clothes', 'Food Packets', 'Medicines', 'Torches'] },
  ],
}

export const DETAIL_FIELDS = {
  blood:    [{ key: 'bloodGroup', label: 'Blood Group', placeholder: 'e.g. O+, A-, B+' }, { key: 'lastDonation', label: 'Last Blood Donation', placeholder: 'e.g. 6 months ago / Never' }, { key: 'city', label: 'Your City', placeholder: 'e.g. Coimbatore' }],
  clothes:  [{ key: 'clothType', label: 'Type of Clothes', placeholder: "e.g. Men's, Women's, Children's" }, { key: 'quantity', label: 'Quantity', placeholder: 'e.g. 15' }, { key: 'condition', label: 'Condition', placeholder: 'e.g. Good, Gently Used' }, { key: 'address', label: 'Pickup Address', placeholder: 'e.g. Coimbatore' }],
  books:    [{ key: 'bookType', label: 'Type of Books', placeholder: 'e.g. School Books, Story Books' }, { key: 'classRange', label: 'Class / Level', placeholder: 'e.g. 6–10, Primary' }, { key: 'quantity', label: 'Quantity', placeholder: 'e.g. 25' }, { key: 'address', label: 'Pickup Address', placeholder: 'e.g. Madurai' }],
  food:     [{ key: 'foodType', label: 'Type of Food', placeholder: 'e.g. Cooked Meals, Dry Ration' }, { key: 'quantity', label: 'Quantity / Servings', placeholder: 'e.g. 50 packets' }, { key: 'freshUntil', label: 'Fresh Until', placeholder: 'e.g. Today evening, 2 days' }, { key: 'address', label: 'Pickup Address', placeholder: 'e.g. Chennai' }],
  toys:     [{ key: 'toyType', label: 'Type of Toys', placeholder: 'e.g. Board games, Soft toys' }, { key: 'ageGroup', label: 'Age Group', placeholder: 'e.g. 3–8 years' }, { key: 'quantity', label: 'Quantity', placeholder: 'e.g. 10' }, { key: 'address', label: 'Pickup Address', placeholder: 'e.g. Salem' }],
  blankets: [{ key: 'blanketType', label: 'Type of Blankets', placeholder: 'e.g. Woollen, Cotton' }, { key: 'quantity', label: 'Quantity', placeholder: 'e.g. 20' }, { key: 'condition', label: 'Condition', placeholder: 'e.g. New, Good' }, { key: 'address', label: 'Pickup Address', placeholder: 'e.g. Trichy' }],
}
