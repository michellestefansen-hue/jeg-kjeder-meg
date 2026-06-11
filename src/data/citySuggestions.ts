// ─── By-spesifikke aktivitetsforslag (delt mellom Explore og Lykkehjul) ───────
export interface ActivitySuggestion {
  emoji: string
  title: string
  desc: string
}

export const CITY_SUGGESTIONS: Record<string, ActivitySuggestion[]> = {
  Oslo: [
    { emoji: '🎢', title: 'Tusenfryd', desc: 'Norges største fornøyelsespark' },
    { emoji: '🏊', title: 'Frognerbadet', desc: 'Utendørs svømmebad om sommeren' },
    { emoji: '🎨', title: 'Munch-museet', desc: 'Verdensklasse kunst i Bjørvika' },
    { emoji: '⛵', title: 'Båttur i Oslofjorden', desc: 'Øyer og sol' },
    { emoji: '🛍️', title: 'Karl Johans gate', desc: 'Shopping i sentrum' },
    { emoji: '🧁', title: 'Kafé på Grünerløkka', desc: 'Kaffe og kaker' },
    { emoji: '🎳', title: 'Bowling', desc: 'Klassisk lagmoro' },
    { emoji: '🎬', title: 'Kino', desc: 'Se siste nytt på lerretet' },
  ],
  Bergen: [
    { emoji: '🚡', title: 'Fløibanen', desc: 'Gondolbane med utsikt over byen' },
    { emoji: '🐟', title: 'Fisketorget', desc: 'Sjømat og matopplevelser' },
    { emoji: '🏔️', title: 'Vidden-tur', desc: 'Vandring mellom de syv fjell' },
    { emoji: '🎵', title: 'Konsert på USF', desc: 'Musikk og kultur ved sjøen' },
    { emoji: '🍦', title: 'Iskrem på Bryggen', desc: 'Historisk kai med is og kos' },
    { emoji: '🎳', title: 'Bowling', desc: 'Klassisk lagmoro' },
  ],
  Trondheim: [
    { emoji: '⛪', title: 'Nidarosdomen', desc: 'Norges nasjonalhelligdom' },
    { emoji: '🚲', title: 'Sykkel langs Nidelva', desc: 'Bysykling i sentrum' },
    { emoji: '🎭', title: 'Trondheim Torg', desc: 'Shopping og kaféliv' },
    { emoji: '🌊', title: 'Munkholmen', desc: 'Bading og piknik på øya' },
    { emoji: '🎳', title: 'Bowling', desc: 'Klassisk lagmoro' },
    { emoji: '🎬', title: 'Kino', desc: 'Se siste nytt på lerretet' },
  ],
  Stavanger: [
    { emoji: '🪨', title: 'Preikestolen', desc: 'Ikonisk fjelltopp med utsikt' },
    { emoji: '🎨', title: 'Norsk Oljemuseum', desc: 'Interaktivt og spennende' },
    { emoji: '🌊', title: 'Badestrand på Sola', desc: 'Sandstrand og bølger' },
    { emoji: '🛍️', title: 'Stavanger sentrum', desc: 'Butikker og kafeer' },
    { emoji: '🎳', title: 'Bowling', desc: 'Klassisk lagmoro' },
  ],
  Tromsø: [
    { emoji: '🌌', title: 'Nordlys-jakt', desc: 'Se nordlyset om vinteren' },
    { emoji: '🐳', title: 'Hvalsafari', desc: 'Se hvaler i fjorden' },
    { emoji: '⛷️', title: 'Skitur', desc: 'Alpint og langrenn' },
    { emoji: '🌅', title: 'Fjellheisen', desc: 'Gondolbane med utsikt' },
    { emoji: '🎳', title: 'Bowling', desc: 'Klassisk lagmoro' },
  ],
  Lillehammer: [
    { emoji: '⛷️', title: 'Hafjell alpinsenter', desc: 'Skitur og afterski' },
    { emoji: '🛷', title: 'Bob-løype', desc: 'Prøv OL-løypen fra 1994' },
    { emoji: '🏒', title: 'Håkons Hall', desc: 'Ishockey og events' },
    { emoji: '🎳', title: 'Bowling', desc: 'Klassisk lagmoro' },
  ],
  Hamar: [
    { emoji: '🏒', title: 'Hamar Olympiahall', desc: 'Skøyter og events' },
    { emoji: '🚢', title: 'Dampskipsbrygga', desc: 'Kafe og sjøliv ved Mjøsa' },
    { emoji: '🎳', title: 'Bowling', desc: 'Klassisk lagmoro' },
    { emoji: '🎬', title: 'Kino', desc: 'Se siste nytt på lerretet' },
    { emoji: '🛍️', title: 'Stortorget', desc: 'Shopping i sentrum' },
  ],
  Drammen: [
    { emoji: '🎭', title: 'Drammens Museum', desc: 'Kunst og kultur' },
    { emoji: '🌉', title: 'Tur langs Drammenselva', desc: 'Fin natur midt i byen' },
    { emoji: '🎳', title: 'Bowling', desc: 'Klassisk lagmoro' },
    { emoji: '🎬', title: 'Kino', desc: 'Se siste nytt på lerretet' },
  ],
  Stockholm: [
    { emoji: '🎡', title: 'Gröna Lund', desc: 'Tivoli på Djurgården' },
    { emoji: '🏰', title: 'Gamla Stan', desc: 'Historisk gamlebyen' },
    { emoji: '🛍️', title: 'Drottninggatan', desc: 'Shoppinggate i sentrum' },
    { emoji: '🚢', title: 'Skärgården', desc: 'Øyhopping i skjærgården' },
  ],
  København: [
    { emoji: '🎠', title: 'Tivoli', desc: 'Verdens eldste fornøyelsespark' },
    { emoji: '🧜', title: 'Den lille havfrue', desc: 'Ikonisk landemerke' },
    { emoji: '🚲', title: 'Sykkel langs kanalene', desc: 'Typisk København-opplevelse' },
    { emoji: '🍦', title: 'Is på Nørrebro', desc: 'Trendy bydel med kos' },
  ],
  Helsinki: [
    { emoji: '🏖️', title: 'Suomenlinna', desc: 'Festningsøy utenfor byen' },
    { emoji: '🛁', title: 'Lørdagsbad i sauna', desc: 'Ekte finsk tradisjon' },
    { emoji: '🎨', title: 'Designmuseet', desc: 'Finsk design og kunst' },
  ],
  Reykjavik: [
    { emoji: '♨️', title: 'Blue Lagoon', desc: 'Geotermisk badeland' },
    { emoji: '🌋', title: 'Geysir', desc: 'Se geysiren sprute' },
    { emoji: '🐋', title: 'Hvalsafari', desc: 'Fra Reykjavik havn' },
  ],
}

export const DEFAULT_SUGGESTIONS: ActivitySuggestion[] = [
  { emoji: '🎳', title: 'Bowling', desc: 'Klassisk lagmoro' },
  { emoji: '🎬', title: 'Kino', desc: 'Se siste nytt på lerretet' },
  { emoji: '☕', title: 'Kafé', desc: 'God kaffe og kaker' },
  { emoji: '🛍️', title: 'Shopping', desc: 'Shoppingtur i sentrum' },
  { emoji: '🧺', title: 'Piknik', desc: 'Mat og drikke ute i naturen' },
  { emoji: '🍕', title: 'Pizza', desc: 'Pizzakveld med gjengen' },
  { emoji: '🥾', title: 'Tur i naturen', desc: 'Frisk luft og godt selskap' },
  { emoji: '🎮', title: 'Gaming', desc: 'Spill sammen hjemme' },
]

export function getSuggestionsForArea(area: string): ActivitySuggestion[] {
  const city = area.split(',')[0].trim()
  return CITY_SUGGESTIONS[city] ?? DEFAULT_SUGGESTIONS
}
