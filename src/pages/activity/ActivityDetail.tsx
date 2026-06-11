// ─── Aktivitetsdetaljer ───────────────────────────────────────────────────────
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Users, ChevronRight, Lock, Globe, Navigation } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { USERS } from '../../data/mockData'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Header from '../../components/layout/Header'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'

export default function ActivityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, activities, payments, vennekasse } = useAppStore()

  const activity = activities.find((a) => a.id === id)
  if (!activity || !currentUser) return null

  const isParticipant = activity.participants.includes(currentUser.id)
  const activityPayments = payments[activity.id] || []
  const myPayment = activityPayments.find((p) => p.userId === currentUser.id)
  const hasPaid = myPayment?.paid === true
  const totalPrice = activity.pricePerPerson + activity.travelCost

  const formatDate = (d: string) => {
    try { return format(new Date(d), 'EEEE d. MMMM', { locale: nb }) } catch { return d }
  }

  const paidCount = activityPayments.filter((p) => p.paid).length
  const totalParticipants = activity.participants.length
  const collectedAmount = activityPayments.filter((p) => p.paid).reduce((sum, p) => sum + p.amount, 0)
  const goalAmount = totalPrice * totalParticipants
  const organizer = USERS.find((u) => u.id === activity.organizerId)
  const vennekasseSaldo = vennekasse[activity.id] ?? 0

  return (
    <div className="min-h-dvh pb-32">
      <Header title={activity.title} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-400 to-purple-500 px-6 py-8 text-white">
        <div className="text-center">
          <span className="text-6xl">{activity.emoji}</span>
          <h2 className="text-2xl font-black mt-2">{activity.title}</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            {activity.type === 'closed' ? (
              <span className="flex items-center gap-1 text-pink-100 text-sm"><Lock size={12} /> Lukket arrangement</span>
            ) : (
              <span className="flex items-center gap-1 text-pink-100 text-sm"><Globe size={12} /> Åpent arrangement</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Info-kort */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <InfoRow icon={<MapPin size={16} className="text-pink-400" />} label="Sted" value={activity.location} />
          <InfoRow icon={<Clock size={16} className="text-purple-400" />} label="Tidspunkt" value={`${formatDate(activity.date)} kl. ${activity.time}`} />
          <InfoRow icon={<Users size={16} className="text-blue-400" />} label="Deltakere" value={`${activity.participants.length} av ${activity.maxParticipants} plasser`} />
        </div>

        {/* Prisdetaljer */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">💰 Pris</h3>
          <div className="space-y-2">
            <PriceRow label="Aktivitet" amount={activity.pricePerPerson} />
            <PriceRow label="Reise" amount={activity.travelCost} />
            <div className="border-t pt-2 mt-2">
              <PriceRow label="Totalt per person" amount={totalPrice} bold />
            </div>
          </div>
        </div>

        {/* Deltakere */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">👯 Deltakere ({activity.participants.length}/{activity.maxParticipants})</h3>
          <div className="space-y-2">
            {activity.participants.map((uid, i) => {
              const user = USERS.find((u) => u.id === uid)
              const payment = activityPayments.find((p) => p.userId === uid)
              if (!user) return null
              return (
                <button key={uid} onClick={() => navigate(`/user/${uid}`)} className="w-full flex items-center gap-3 text-left">
                  <Avatar initial={user.avatar} size="sm" index={i} />
                  <span className="flex-1 text-sm font-medium text-gray-800">
                    {user.name} {uid === activity.organizerId && <span className="text-xs text-pink-400">(arrangør)</span>}
                  </span>
                  {payment?.paid ? (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Betalt ✓</span>
                  ) : (
                    <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full">Venter</span>
                  )}
                </button>
              )
            })}
          </div>
          {totalParticipants > 0 && (
            <p className="text-xs text-gray-400 mt-3 text-center">{paidCount}/{totalParticipants} har betalt</p>
          )}
        </div>

        {/* Pengekasse / betalingsprogress */}
        {goalAmount > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">💰</span>
                <h3 className="font-semibold text-gray-900 text-sm">Pengekasse</h3>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {collectedAmount} / {goalAmount} kr
              </span>
            </div>
            {/* Progress-bar */}
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((collectedAmount / goalAmount) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{paidCount} av {totalParticipants} har betalt</span>
              <span>{Math.round((collectedAmount / goalAmount) * 100)}%</span>
            </div>
            {/* Vipps-mottaker */}
            {organizer?.vippsNumber && (
              <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2">
                <span className="text-[#FF5B24] font-black text-xs">vipps</span>
                <span className="text-xs text-gray-600">Betales til {organizer.name}: +47 {organizer.vippsNumber}</span>
              </div>
            )}
            {isParticipant && hasPaid && collectedAmount >= goalAmount && (
              <div className="text-center text-sm font-semibold text-green-600">
                ✅ Alle har betalt! Aktiviteten er klar.
              </div>
            )}
          </div>
        )}

        {/* Vennekasse */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🫙</span>
              <h3 className="font-semibold text-gray-900 text-sm">Vennekasse</h3>
            </div>
            <span className="text-lg font-black text-pink-500">{vennekasseSaldo} kr</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Penger fra avbestillinger samles her. Brukes til å gjøre denne eller neste aktivitet billigere for alle. 🎉
          </p>
          {vennekasseSaldo > 0 ? (
            <div className="bg-pink-50 rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="text-pink-400 text-sm">✨</span>
              <span className="text-xs text-pink-700 font-medium">
                {vennekasseSaldo} kr spart — {Math.round(vennekasseSaldo / Math.max(activity.participants.length, 1))} kr per person!
              </span>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl px-3 py-2">
              <span className="text-xs text-gray-400">Ingen penger ennå — fyller seg opp ved avbestillinger</span>
            </div>
          )}
        </div>

        {/* Reiserute-knapp */}
        {(activity.distance ?? 0) > 1 && (
          <button
            onClick={() => navigate(`/travel/${activity.id}`)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <Navigation size={16} className="text-blue-500" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800">Reiserute</p>
                <p className="text-xs text-gray-400">{activity.distance} km unna</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        )}


        {/* Chat-knapp (kun for betalte) */}
        {isParticipant && hasPaid && (
          <button
            onClick={() => navigate(`/chat/${activity.id}`)}
            className="w-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-base">💬</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-purple-700">Gruppechat</p>
                <p className="text-xs text-purple-400">Alle bekrefdte deltakere</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-purple-300" />
          </button>
        )}
      </div>

      {/* Bunnknapp */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto">
        {!isParticipant ? (
          <Button variant="primary" fullWidth size="lg" onClick={() => navigate(`/payment/${activity.id}`)}>
            Bli med 🙋
          </Button>
        ) : !hasPaid ? (
          <Button variant="vipps" fullWidth size="lg" onClick={() => navigate(`/payment/${activity.id}`)}>
            <span className="font-black">vipps</span> · Betal {totalPrice} kr
          </Button>
        ) : (
          <div className="text-center py-2">
            <p className="text-green-600 font-semibold">✓ Du er med og betalt!</p>
            <p className="text-xs text-gray-400 mt-1">Aktiviteten aktiveres når alle har betalt</p>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function PriceRow({ label, amount, bold = false }: { label: string; amount: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between items-center ${bold ? 'font-bold text-gray-900' : 'text-sm text-gray-600'}`}>
      <span>{label}</span>
      <span className={bold ? 'text-pink-500' : ''}>{amount} kr</span>
    </div>
  )
}
