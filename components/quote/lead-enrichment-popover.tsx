"use client"

import { useState, useCallback } from "react"
import {
  Search,
  User,
  MapPin,
  Briefcase,
  DollarSign,
  Loader2,
  GraduationCap,
  History,
  Sparkles,
  Globe,
  Phone,
  Mail,
  BarChart3,
  Award,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import type { EnrichmentResult, EnrichmentResponse } from "@/lib/types"

/* ------------------------------------------------------------------ */
/*  Props & helpers                                                    */
/* ------------------------------------------------------------------ */

interface LeadEnrichmentPopoverProps {
  onEnrichmentResult: (result: EnrichmentResult) => void
  onAutoFill: (data: {
    firstName?: string
    lastName?: string
    age?: number
    gender?: "Male" | "Female"
    state?: string
  }) => number
  onSendToChat?: (text: string) => void
}

function mapSexToGender(sex: string | null): "Male" | "Female" | undefined {
  if (!sex) return undefined
  const lower = sex.toLowerCase()
  if (lower === "male") return "Male"
  if (lower === "female") return "Female"
  return undefined
}

/**
 * Build a structured summary of the enrichment data for the AI chat.
 * Sends the full typed result (minus rawData) as JSON so the AI can reason
 * over every field available.
 */
function buildChatPayload(r: EnrichmentResult): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rawData, ...structured } = r

  // Strip null/empty values to save tokens
  const compact = JSON.parse(
    JSON.stringify(structured, (_key, value) => {
      if (value === null) return undefined
      if (Array.isArray(value) && value.length === 0) return undefined
      if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return undefined
      return value
    }),
  )

  return [
    "Here is the full enrichment data I have on this lead:",
    "```json",
    JSON.stringify(compact, null, 2),
    "```",
    "Based on this profile, what coverage amount and term length would you recommend? Which carriers would be the best fit and why?",
  ].join("\n")
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function LeadEnrichmentPopover({
  onEnrichmentResult,
  onAutoFill,
  onSendToChat,
}: LeadEnrichmentPopoverProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<EnrichmentResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async () => {
    if (!name.trim() && !email.trim() && !phone.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/enrichment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      })

      const data: EnrichmentResponse = await response.json()

      if (!data.success || !data.data) {
        setError(data.error ?? "No matching person found")
        return
      }

      const enrichment = data.data
      setResult(enrichment)
      onEnrichmentResult(enrichment)

      // Auto-apply enrichment fields to intake (respects dirty fields)
      const filledCount = onAutoFill({
        firstName: enrichment.firstName ?? undefined,
        lastName: enrichment.lastName ?? undefined,
        age: enrichment.age ?? undefined,
        gender: mapSexToGender(enrichment.sex),
        state: enrichment.state ?? undefined,
      })

      if (filledCount > 0) {
        toast.success(`Lead enriched — ${filledCount} field${filledCount > 1 ? "s" : ""} updated. Review and run quote.`)
      } else {
        toast.info("Lead enriched — no new fields to fill")
      }

      setPopoverOpen(false)
      setDialogOpen(true)
    } catch {
      setError("Enrichment request failed")
    } finally {
      setIsLoading(false)
    }
  }, [name, email, phone, onEnrichmentResult, onAutoFill])

  const handleReset = useCallback(() => {
    setName("")
    setEmail("")
    setPhone("")
    setResult(null)
    setError(null)
    setDialogOpen(false)
  }, [])

  const handleSendToChat = useCallback(() => {
    if (!result || !onSendToChat) return
    onSendToChat(buildChatPayload(result))
  }, [result, onSendToChat])

  const hasInput = name.trim() || email.trim() || phone.trim()

  return (
    <>
      {/* ── Input Popover ──────────────────────────────────────────── */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={result ? (e) => { e.preventDefault(); setDialogOpen(true) } : undefined}
            className={`flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-bold transition-colors ${
              result
                ? "bg-[#dbeafe] text-[#1773cf] hover:bg-[#bfdbfe]"
                : "text-[#1773cf] hover:bg-[#eff6ff]"
            }`}
          >
            <Search className="h-3 w-3" />
            {result ? "View Lead" : "Enrich"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="end" sideOffset={8}>
          <div className="border-b border-[#e2e8f0] px-4 py-3">
            <h4 className="text-[12px] font-bold text-[#0f172a]">Lead Enrichment</h4>
            <p className="mt-0.5 text-[10px] text-[#94a3b8]">
              Enter email, phone, or name with contact info
            </p>
          </div>

          <div className="space-y-3 px-4 py-3">
            <LabelledInput
              icon={User}
              label="Full Name"
              value={name}
              onChange={setName}
              placeholder="John Smith"
              disabled={isLoading}
            />
            <LabelledInput
              icon={Mail}
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="john@example.com"
              type="email"
              disabled={isLoading}
            />
            <LabelledInput
              icon={Phone}
              label="Phone"
              value={phone}
              onChange={setPhone}
              placeholder="+1 555-123-4567"
              type="tel"
              disabled={isLoading}
            />

            <Button
              onClick={handleSubmit}
              disabled={!hasInput || isLoading}
              className="w-full bg-[#1773cf] text-[11px] font-bold hover:bg-[#1565b8]"
              size="sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  Searching...
                </>
              ) : (
                "Look Up Lead"
              )}
            </Button>
          </div>

          {error && (
            <div className="border-t border-[#e2e8f0] px-4 py-3">
              <p className="text-[11px] text-red-600">{error}</p>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* ── Results Dialog ─────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex max-h-[80vh] w-[500px] max-w-[90vw] flex-col gap-0 p-0">
          <DialogHeader className="shrink-0 border-b border-[#e2e8f0] px-6 py-4">
            <DialogTitle className="text-[14px] font-bold text-[#0f172a]">
              Lead Enrichment Results
            </DialogTitle>
            {result?.fullName && (
              <p className="text-[12px] text-[#64748b]">
                {result.fullName}
                {result.headline ? ` — ${result.headline}` : ""}
              </p>
            )}
          </DialogHeader>

          {result && (
            <>
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="px-6 py-2">
                  <EnrichmentAccordion result={result} />
                </div>
              </div>

              <div className="flex shrink-0 gap-2 border-t border-[#e2e8f0] px-6 py-3">
                {onSendToChat && (
                  <Button
                    onClick={handleSendToChat}
                    size="sm"
                    className="flex-1 bg-[#1773cf] text-[11px] font-bold hover:bg-[#1565b8]"
                  >
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    Send to AI
                  </Button>
                )}
                <Button onClick={handleReset} variant="ghost" size="sm" className="text-[11px]">
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Accordion results display                                          */
/* ------------------------------------------------------------------ */

function EnrichmentAccordion({ result: r }: { result: EnrichmentResult }) {
  const hasIdentity = r.fullName || r.age != null || r.sex || r.nameAliases.length > 0
  const hasLocation = r.locationName || r.city || r.locationNames.length > 0 || r.streetAddresses.length > 0
  const hasCurrentRole = r.jobTitle || r.jobCompanyName
  const hasFinancial = r.inferredSalary || r.jobCompanyInferredRevenue || r.jobCompanyTicker || r.jobCompanyTotalFundingRaised != null
  const hasWorkHistory = r.experience.length > 0
  const hasEducation = r.education.length > 0
  const hasSkills = r.skills.length > 0 || r.certifications.length > 0 || r.languages.length > 0
  const hasSocial = r.linkedinUrl || r.facebookUrl || r.twitterUrl || r.githubUrl || r.profiles.length > 0
  const hasContact = r.workEmail || r.personalEmails.length > 0 || r.emails.length > 0 || r.phoneNumbers.length > 0 || r.phones.length > 0 || r.mobilePhone
  const hasMeta = r.numSources != null || r.firstSeen

  const defaultOpen = [
    hasIdentity ? "identity" : "",
    hasCurrentRole ? "current-role" : "",
    hasFinancial ? "financial" : "",
  ].filter(Boolean)

  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="w-full">
      {/* Identity */}
      {hasIdentity && (
        <AccordionSection value="identity" icon={User} label="Identity">
          {r.fullName && <Row label="Full Name" value={r.fullName} />}
          {r.firstName && <Row label="First" value={r.firstName} />}
          {r.middleName && <Row label="Middle" value={r.middleName} />}
          {r.lastName && <Row label="Last" value={r.lastName} />}
          {r.age != null && (
            <Row
              label="Age"
              value={`${r.ageEstimated ? "~" : ""}${r.age}${r.birthDate ? ` (${r.birthDate})` : r.birthYear ? ` (born ${r.birthYear})` : r.ageEstimated ? " (estimated from education)" : ""}`}
            />
          )}
          {r.sex && <Row label="Gender" value={r.sex} />}
          {r.nameAliases.length > 0 && <Row label="Aliases" value={r.nameAliases.join(", ")} />}
          {r.summary && <Row label="Summary" value={r.summary} />}
        </AccordionSection>
      )}

      {/* Location */}
      {hasLocation && (
        <AccordionSection value="location" icon={MapPin} label="Location">
          {r.city && r.state && (
            <Row label="Current" value={`${r.city}, ${r.state}${r.zip ? ` ${r.zip}` : ""}`} />
          )}
          {r.locationName && (!r.city || !r.state) && <Row label="Location" value={r.locationName} />}
          {r.country && <Row label="Country" value={r.country} />}
          {r.continent && <Row label="Continent" value={r.continent} />}
          {r.locationStreetAddress && <Row label="Street" value={r.locationStreetAddress} />}
          {r.locationGeo && <Row label="Geo" value={r.locationGeo} />}
          {r.regions.length > 0 && <Row label="Known Regions" value={r.regions.join(", ")} />}
          {r.locationNames.length > 1 && <Row label="All Locations" value={r.locationNames.join("; ")} />}
          {r.streetAddresses.length > 0 && r.streetAddresses.map((a, i) => (
            <div key={`addr-${i}`} className="py-0.5 pl-5">
              <p className="text-[11px] text-[#0f172a]">{a.name ?? [a.locality, a.region, a.country].filter(Boolean).join(", ")}</p>
              {a.streetAddress && <p className="text-[10px] text-[#64748b]">{a.streetAddress}</p>}
            </div>
          ))}
        </AccordionSection>
      )}

      {/* Current Role */}
      {hasCurrentRole && (
        <AccordionSection value="current-role" icon={Briefcase} label="Current Role">
          {r.jobTitle && <Row label="Title" value={r.jobTitle} />}
          {r.jobTitleRole && <Row label="Role" value={r.jobTitleRole} />}
          {r.jobTitleSubRole && <Row label="Sub-Role" value={r.jobTitleSubRole} />}
          {r.jobTitleClass && <Row label="Class" value={r.jobTitleClass} />}
          {r.jobTitleLevels.length > 0 && <Row label="Seniority" value={r.jobTitleLevels.join(", ")} />}
          {r.jobCompanyName && <Row label="Company" value={r.jobCompanyName} />}
          {r.jobCompanyIndustry && <Row label="Industry" value={r.jobCompanyIndustry} />}
          {r.industry && r.industry !== r.jobCompanyIndustry && <Row label="Person Industry" value={r.industry} />}
          {r.jobCompanyType && <Row label="Company Type" value={r.jobCompanyType} />}
          {r.jobCompanySize && <Row label="Company Size" value={r.jobCompanySize} />}
          {r.jobCompanyEmployeeCount != null && <Row label="Employees" value={r.jobCompanyEmployeeCount.toLocaleString()} />}
          {r.jobCompanyFounded != null && <Row label="Founded" value={String(r.jobCompanyFounded)} />}
          {r.jobCompanyLocationName && <Row label="HQ" value={r.jobCompanyLocationName} />}
          {r.jobCompanyWebsite && <Row label="Website" value={r.jobCompanyWebsite} />}
          {r.jobCompanyLinkedinUrl && <Row label="Company LinkedIn" value={r.jobCompanyLinkedinUrl} />}
          {r.jobStartDate && <Row label="Start Date" value={r.jobStartDate} />}
          {r.jobLastVerified && <Row label="Last Verified" value={r.jobLastVerified} />}
          {r.jobSummary && <Row label="Summary" value={r.jobSummary} />}
          {r.inferredYearsExperience != null && <Row label="Years Experience" value={String(r.inferredYearsExperience)} />}
        </AccordionSection>
      )}

      {/* Financial Signals */}
      {hasFinancial && (
        <AccordionSection value="financial" icon={DollarSign} label="Financial Signals">
          {r.inferredSalary && <Row label="Est. Salary" value={r.inferredSalary} />}
          {r.jobCompanyInferredRevenue && <Row label="Company Revenue" value={r.jobCompanyInferredRevenue} />}
          {r.jobCompanyTotalFundingRaised != null && (
            <Row label="Total Funding" value={`$${r.jobCompanyTotalFundingRaised.toLocaleString()}`} />
          )}
          {r.jobCompanyTicker && <Row label="Ticker" value={r.jobCompanyTicker} />}
          {r.jobCompany12moGrowthRate != null && (
            <Row label="12mo Growth" value={`${(r.jobCompany12moGrowthRate * 100).toFixed(1)}%`} />
          )}
        </AccordionSection>
      )}

      {/* Work History */}
      {hasWorkHistory && (
        <AccordionSection value="work-history" icon={History} label="Work History">
          {r.experience.map((exp, i) => (
            <div key={`exp-${i}`} className="border-b border-[#f1f5f9] py-1.5 pl-5 last:border-0">
              <p className="text-[12px] font-medium text-[#0f172a]">
                {exp.title ?? "Unknown Role"}
                {exp.isPrimary && (
                  <span className="ml-1.5 rounded bg-[#dbeafe] px-1 py-0.5 text-[8px] font-bold text-[#1773cf]">
                    CURRENT
                  </span>
                )}
              </p>
              <p className="text-[11px] text-[#475569]">
                {[
                  exp.company,
                  exp.companyIndustry,
                  formatDateRange(exp.startDate, exp.endDate),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {exp.titleRole && (
                <p className="text-[10px] text-[#94a3b8]">
                  {[exp.titleRole, exp.titleSubRole].filter(Boolean).join(" / ")}
                  {exp.titleLevels.length > 0 ? ` (${exp.titleLevels.join(", ")})` : ""}
                </p>
              )}
              {exp.summary && <p className="mt-0.5 text-[10px] text-[#64748b]">{exp.summary}</p>}
            </div>
          ))}
        </AccordionSection>
      )}

      {/* Education */}
      {hasEducation && (
        <AccordionSection value="education" icon={GraduationCap} label="Education">
          {r.education.map((edu, i) => (
            <div key={`edu-${i}`} className="border-b border-[#f1f5f9] py-1.5 pl-5 last:border-0">
              <p className="text-[12px] font-medium text-[#0f172a]">
                {edu.name ?? "Unknown School"}
                {edu.type && <span className="ml-1 text-[10px] text-[#94a3b8]">({edu.type})</span>}
              </p>
              {(edu.degrees.length > 0 || edu.majors.length > 0) && (
                <p className="text-[11px] text-[#475569]">
                  {[edu.degrees.join(", "), edu.majors.length > 0 ? `in ${edu.majors.join(", ")}` : null]
                    .filter(Boolean)
                    .join(" ")}
                </p>
              )}
              {edu.minors.length > 0 && (
                <p className="text-[10px] text-[#94a3b8]">Minor: {edu.minors.join(", ")}</p>
              )}
              {edu.gpa != null && <p className="text-[10px] text-[#94a3b8]">GPA: {edu.gpa}</p>}
              {(edu.startDate || edu.endDate) && (
                <p className="text-[10px] text-[#94a3b8]">{formatDateRange(edu.startDate, edu.endDate)}</p>
              )}
              {edu.location && <p className="text-[10px] text-[#94a3b8]">{edu.location}</p>}
            </div>
          ))}
        </AccordionSection>
      )}

      {/* Skills & Certifications */}
      {hasSkills && (
        <AccordionSection value="skills" icon={Award} label="Skills & Certifications">
          {r.skills.length > 0 && (
            <div className="py-1 pl-5">
              <p className="text-[10px] font-medium text-[#94a3b8]">Skills:</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {r.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-[10px] text-[#475569]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {r.interests.length > 0 && (
            <div className="py-1 pl-5">
              <p className="text-[10px] font-medium text-[#94a3b8]">Interests:</p>
              <p className="text-[11px] text-[#475569]">{r.interests.join(", ")}</p>
            </div>
          )}
          {r.certifications.map((cert, i) => (
            <div key={`cert-${i}`} className="py-0.5 pl-5">
              <p className="text-[11px] font-medium text-[#0f172a]">{cert.name}</p>
              {cert.organization && <p className="text-[10px] text-[#64748b]">{cert.organization}</p>}
            </div>
          ))}
          {r.languages.length > 0 && (
            <div className="py-1 pl-5">
              <p className="text-[10px] font-medium text-[#94a3b8]">Languages:</p>
              <p className="text-[11px] text-[#475569]">
                {r.languages.map((l) => l.name).filter(Boolean).join(", ")}
              </p>
            </div>
          )}
        </AccordionSection>
      )}

      {/* Social Profiles */}
      {hasSocial && (
        <AccordionSection value="social" icon={Globe} label="Social Profiles">
          {r.linkedinUrl && <Row label="LinkedIn" value={r.linkedinUrl} />}
          {r.linkedinUsername && <Row label="LinkedIn User" value={r.linkedinUsername} />}
          {r.linkedinConnections != null && <Row label="Connections" value={r.linkedinConnections.toLocaleString()} />}
          {r.facebookUrl && <Row label="Facebook" value={r.facebookUrl} />}
          {r.facebookFriends != null && <Row label="Friends" value={r.facebookFriends.toLocaleString()} />}
          {r.twitterUrl && <Row label="Twitter/X" value={r.twitterUrl} />}
          {r.githubUrl && <Row label="GitHub" value={r.githubUrl} />}
          {r.profiles
            .filter((p) => !["linkedin", "facebook", "twitter", "github"].includes(p.network?.toLowerCase() ?? ""))
            .map((p, i) => (
              <Row key={`profile-${i}`} label={p.network ?? "Profile"} value={p.url ?? p.username ?? ""} />
            ))}
        </AccordionSection>
      )}

      {/* Contact Info */}
      {hasContact && (
        <AccordionSection value="contact" icon={Phone} label="Contact Info">
          {r.workEmail && <Row label="Work Email" value={r.workEmail} />}
          {r.recommendedPersonalEmail && <Row label="Personal Email" value={r.recommendedPersonalEmail} />}
          {r.personalEmails
            .filter((e) => e !== r.recommendedPersonalEmail)
            .map((e, i) => (
              <Row key={`pe-${i}`} label="Email" value={e} />
            ))}
          {r.emails
            .filter((e) => e.address && e.address !== r.workEmail && e.address !== r.recommendedPersonalEmail)
            .slice(0, 5)
            .map((e, i) => (
              <Row key={`em-${i}`} label={e.type ?? "Email"} value={e.address ?? ""} />
            ))}
          {r.mobilePhone && <Row label="Mobile" value={r.mobilePhone} />}
          {r.phoneNumbers
            .filter((p) => p !== r.mobilePhone)
            .map((p, i) => (
              <Row key={`ph-${i}`} label="Phone" value={p} />
            ))}
          {r.phones.length > 0 && r.phoneNumbers.length === 0 && r.phones.map((p, i) => (
            <Row key={`phone-${i}`} label="Phone" value={p.number ?? ""} />
          ))}
          {r.possibleEmails.length > 0 && (
            <div className="py-1 pl-5">
              <p className="text-[10px] font-medium text-[#94a3b8]">Possible emails:</p>
              {r.possibleEmails.slice(0, 3).map((e, i) => (
                <p key={`pe-${i}`} className="text-[10px] text-[#64748b]">{e.address}</p>
              ))}
            </div>
          )}
          {r.possiblePhones.length > 0 && (
            <div className="py-1 pl-5">
              <p className="text-[10px] font-medium text-[#94a3b8]">Possible phones:</p>
              {r.possiblePhones.slice(0, 3).map((p, i) => (
                <p key={`pp-${i}`} className="text-[10px] text-[#64748b]">{p.number}</p>
              ))}
            </div>
          )}
        </AccordionSection>
      )}

      {/* Data Quality */}
      {hasMeta && (
        <AccordionSection value="metadata" icon={BarChart3} label="Data Quality">
          {r.numSources != null && <Row label="Sources" value={String(r.numSources)} />}
          {r.numRecords != null && <Row label="Records" value={String(r.numRecords)} />}
          {r.firstSeen && <Row label="First Seen" value={r.firstSeen} />}
        </AccordionSection>
      )}
    </Accordion>
  )
}

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

function AccordionSection({
  value,
  icon: Icon,
  label,
  children,
}: {
  value: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <AccordionItem value={value} className="border-b border-[#f1f5f9]">
      <AccordionTrigger className="py-2.5 hover:no-underline">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-[#1773cf]" />
          <span className="text-[11px] font-bold text-[#0f172a]">{label}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-2">{children}</AccordionContent>
    </AccordionItem>
  )
}

function LabelledInput({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  disabled?: boolean
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-medium text-[#475569]">{label}</label>
      <div className="relative">
        <Icon className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#94a3b8]" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          className="h-8 pl-8 text-[12px]"
          disabled={disabled}
        />
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 py-0.5 pl-5">
      <span className="shrink-0 text-[11px] text-[#94a3b8]">{label}:</span>
      <span className="break-all text-[12px] font-medium text-[#0f172a]">{value}</span>
    </div>
  )
}

function formatDateRange(start: string | null, end: string | null): string | null {
  if (!start && !end) return null
  const s = start ? start.slice(0, 7) : "?"
  const e = end ? end.slice(0, 7) : "Present"
  return `${s} – ${e}`
}
