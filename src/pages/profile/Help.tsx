// ─── Hjelp ────────────────────────────────────────────────────────────────────
import Header from '../../components/layout/Header'

export default function Help() {
  return (
    <div className="min-h-dvh pb-10">
      <Header title="Hjelp" />

      <div className="px-4 py-6 space-y-4 max-w-prose">

        <Section title="Hvordan blir jeg med på en aktivitet?">
          <p className="text-sm text-gray-600 leading-relaxed">
            Finn en aktivitet du vil bli med på, trykk på den og velg <strong>Bli med</strong>. Hvis aktiviteten koster penger, må du betale før plassen din blir bekreftet.
          </p>
        </Section>

        <Section title="Hvordan oppretter jeg en aktivitet?">
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            Trykk på <strong>Opprett aktivitet</strong>. Velg om aktiviteten skal være <strong>åpen</strong> eller <strong>lukket</strong>.
          </p>
          <ul className="space-y-1.5">
            <Li><strong>Åpen aktivitet:</strong> Andre lokale brukere på samme alder kan bli med.</Li>
            <Li><strong>Lukket aktivitet:</strong> Bare de du inviterer kan bli med.</Li>
          </ul>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            Du kan også velge maks antall deltakere, dato, tidspunkt, budsjett og om andre kan foreslå aktiviteter.
          </p>
        </Section>

        <Section title="Hvordan fungerer stemmingen?">
          <p className="text-sm text-gray-600 leading-relaxed">
            Deltakerne kan stemme på aktivitetene som er foreslått. Når stemmingen er ferdig, bruker Lokka <strong>Spin the Wheel</strong> til å velge aktivitet basert på stemmene.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            Aktiviteter med flere stemmer får større sjanse til å bli valgt.
          </p>
        </Section>

        <Section title="Hvordan fungerer betaling?">
          <p className="text-sm text-gray-600 leading-relaxed">
            Alle deltakere betaler på forhånd. Når du har betalt, blir plassen din bekreftet og du får tilgang til aktivitetschatten.
          </p>
        </Section>

        <Section title="Avbestilling og refusjon">
          <p className="text-sm text-gray-600 mb-2">Hvis du ikke kan komme, gjelder disse reglene:</p>
          <ul className="space-y-1.5">
            <Li>Avbestiller du <strong>3 dager eller mer før aktiviteten</strong>, får du tilbake <strong>hele beløpet</strong>.</Li>
            <Li>Avbestiller du <strong>dagen før aktiviteten</strong>, får du tilbake <strong>50 % av beløpet</strong>.</Li>
            <Li>De resterende <strong>50 % går til aktivitetens vennekasse</strong>.</Li>
          </ul>
        </Section>

        <Section title="Hva er vennekassen?">
          <p className="text-sm text-gray-600 leading-relaxed">
            Vennekassen er en felles pott for deltakerne på aktiviteten. Pengene kan brukes til å gjøre aktiviteten billigere eller til en ny aktivitet senere.
          </p>
        </Section>

        <Section title="Reiserute">
          <p className="text-sm text-gray-600 leading-relaxed">
            Hvis aktiviteten er langt unna, kan Lokka foreslå reiserute. Du kan se transporttype, reisetid, avgangstid, ankomsttid og pris per person.
          </p>
        </Section>

        <Section title="Trygg bruk">
          <ul className="space-y-1.5">
            <Li>Møt på offentlige steder.</Li>
            <Li>Ikke del passord, adresse eller privat informasjon.</Li>
            <Li>Vær hyggelig mot andre.</Li>
            <Li>Rapporter brukere eller aktiviteter som bryter reglene.</Li>
            <Li>Snakk med en voksen hvis noe føles utrygt.</Li>
          </ul>
        </Section>

        <Section title="Trenger du mer hjelp?">
          <p className="text-sm text-gray-600 mb-2">Kontakt oss på:</p>
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

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-gray-600">
      <span className="text-pink-400 mt-0.5 flex-shrink-0">•</span>
      <span>{children}</span>
    </li>
  )
}
