// ─── Personvernregler ─────────────────────────────────────────────────────────
import Header from '../../components/layout/Header'

export default function Privacy() {
  return (
    <div className="min-h-dvh pb-10">
      <Header title="Personvern" />

      <div className="px-4 py-6 space-y-6 max-w-prose">

        <div>
          <h1 className="text-xl font-black text-gray-900">Personvernregler for Lokka</h1>
          <p className="text-xs text-gray-400 mt-1">Sist oppdatert: 11. juni 2026</p>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          Vi ønsker at Lokka skal være en trygg og enkel app å bruke. Derfor samler vi bare inn informasjon som er nødvendig for at appen skal fungere.
        </p>

        <Section title="Hva vi samler inn">
          <p className="text-sm text-gray-600 mb-2">Vi kan lagre:</p>
          <ul className="space-y-1">
            {[
              'Navn eller brukernavn',
              'Alder',
              'Område/lokasjon',
              'Aktiviteter du oppretter eller deltar på',
              'Meldinger i aktivitetschatter',
              'Betalingsinformasjon som trengs for betalinger',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-pink-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Hvordan vi bruker informasjonen">
          <p className="text-sm text-gray-600 mb-2">Vi bruker informasjonen for å:</p>
          <ul className="space-y-1">
            {[
              'Vise aktiviteter i ditt område',
              'Sørge for at brukere møter andre på samme alder',
              'Håndtere betalinger',
              'Gjøre appen tryggere og enklere å bruke',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-pink-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Hvem kan se informasjonen din?">
          <p className="text-sm text-gray-600 mb-2">Andre brukere kan se:</p>
          <ul className="space-y-1 mb-3">
            {['Brukernavn', 'Alder', 'Aktiviteter du deltar på'].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-pink-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">Vi selger aldri informasjonen din til andre.</p>
        </Section>

        <Section title="Lokasjon">
          <p className="text-sm text-gray-600 leading-relaxed">
            Vi bruker lokasjon for å vise aktiviteter i nærheten og foreslå reiseruter. Du kan når som helst slå av lokasjonstilgang på telefonen din.
          </p>
        </Section>

        <Section title="Sikkerhet">
          <p className="text-sm text-gray-600 leading-relaxed">
            Vi jobber for å beskytte informasjonen din. Ingen løsning er 100 % sikker, men vi gjør vårt beste for å holde dataene trygge.
          </p>
        </Section>

        <Section title="Dine rettigheter">
          <p className="text-sm text-gray-600 mb-2">Du kan:</p>
          <ul className="space-y-1 mb-3">
            {[
              'Se informasjonen vi har om deg',
              'Be om å få rettet feil informasjon',
              'Slette kontoen din',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-pink-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600">
            Når kontoen slettes, fjernes personopplysningene dine så langt det er mulig.
          </p>
        </Section>

        <Section title="Kontakt oss">
          <p className="text-sm text-gray-600 mb-2">
            Hvis du har spørsmål om personvern, kan du kontakte oss på:
          </p>
          <a
            href="mailto:team.lokka@gmail.com"
            className="text-sm font-medium text-pink-500 underline"
          >
            team.lokka@gmail.com
          </a>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
      <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      {children}
    </div>
  )
}
