with open('src/App.js', 'r') as f:
    content = f.read()

old = 'const CITIES = ["Toutes","Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir"];'

new = '''const CITIES = [
  "Toutes",
  // Tanger-Tétouan-Al Hoceima
  "Tanger","Tétouan","Al Hoceima","Chefchaouen","Larache","Ksar El Kebir","Fnideq","Ouazzane",
  // Oriental
  "Oujda","Nador","Berkane","Taourirt","Guercif","Jerada","Saïdia",
  // Fès-Meknès
  "Fès","Meknès","Taza","Ifrane","Khénifra","Errachidia","Midelt","Guercif","Sefrou","Bhalil",
  // Rabat-Salé-Kénitra
  "Rabat","Salé","Kénitra","Témara","Skhirat","Sidi Kacem","Sidi Slimane","Khémisset",
  // Béni Mellal-Khénifra
  "Béni Mellal","Khouribga","Fkih Ben Salah","Kasba Tadla","Azilal",
  // Casablanca-Settat
  "Casablanca","Mohammedia","El Jadida","Settat","Berrechid","Benslimane","Sidi Bennour",
  // Marrakech-Safi
  "Marrakech","Safi","Essaouira","Kelaa des Sraghna","Chichaoua","Youssoufia",
  // Drâa-Tafilalet
  "Ouarzazate","Zagora","Tinghir","Errachidia","Midelt","Rissani",
  // Souss-Massa
  "Agadir","Tiznit","Taroudannt","Inezgane","Ait Melloul","Dcheira","Biougra",
  // Guelmim-Oued Noun
  "Guelmim","Tan-Tan","Sidi Ifni","Assa",
  // Laâyoune-Saguia al Hamra
  "Laâyoune","Boujdour","Smara","Tarfaya",
  // Dakhla-Oued Ed-Dahab
  "Dakhla","Aousserd",
];'''

if old in content:
    content = content.replace(old, new)
    print("Cities replaced!")
else:
    print("Not found!")

with open('src/App.js', 'w') as f:
    f.write(content)
