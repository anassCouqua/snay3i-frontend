with open('src/App.js', 'r') as f:
    content = f.read()

old = '''const CITIES = [
  "Toutes","Casablanca","Rabat","Marrakech","Fès","Tanger","Agadir",
  "Meknès","Oujda","Kénitra","Tétouan","Salé","El Jadida","Safi",
  "Mohammedia","Khouribga","Beni Mellal","Nador","Settat","Berrechid",
  "Ksar El Kebir","Larache","Errachidia","Guelmim","Tiznit",
  "Ouarzazate","Chefchaouen","Al Hoceima","Dakhla","Laâyoune",
];'''

new = '''const CITIES = [
  "Toutes",
  "Tanger","Tétouan","Al Hoceima","Chefchaouen","Larache","Ksar El Kebir","Ouazzane",
  "Rabat","Salé","Kénitra","Témara","Sidi Kacem",
  "Casablanca","Mohammedia","El Jadida","Berrechid","Settat","Benslimane",
  "Marrakech","Safi","Essaouira","Kelaa des Sraghna",
  "Fès","Meknès","Taza","Ifrane","Khénifra","Errachidia","Midelt",
  "Oujda","Nador","Berkane","Taourirt","Guercif",
  "Ouarzazate","Zagora","Tinghir",
  "Agadir","Tiznit","Guelmim","Taroudannt","Inezgane",
  "Laâyoune","Dakhla","Boujdour","Smara","Tan-Tan",
];'''

if old in content:
    content = content.replace(old, new)
    print("Replaced!")
else:
    print("Not found - checking...")
    idx = content.find('const CITIES')
    print(repr(content[idx:idx+200]))

with open('src/App.js', 'w') as f:
    f.write(content)
