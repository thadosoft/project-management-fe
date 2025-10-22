import { Mail, Phone } from "lucide-react"

interface ProfileCardProps {
  name: string
  title?: string
  email: string
  phone: string
  avatar: string
}

export function ProfileCard({ name, title, email, phone, avatar }: ProfileCardProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 
                   dark:from-slate-800 dark:to-slate-900 border border-slate-200/50 dark:border-slate-700/50 
                   shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
      >
        {/* Background Gradient Accent */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent 
                     pointer-events-none"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div
            className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-800 
                       shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <img
              src={avatar || "/placeholder.svg?height=96&width=96&query=profile-avatar"}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">{name}</h3>
            {title && <p className="text-sm text-muted-foreground font-medium">{title}</p>}
          </div>

          {/* Divider */}
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />

          {/* Contact Info */}
          <div className="w-full space-y-3 pt-2">
            {/* Email */}
            <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-700/50 transition-colors">
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <a
                href={`mailto:${email}`}
                className="text-sm text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
              >
                {email}
              </a>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-700/50 transition-colors">
              <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <a
                href={`tel:${phone}`}
                className="text-sm text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
