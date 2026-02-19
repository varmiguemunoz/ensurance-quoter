"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useLeadStore } from "@/lib/store/lead-store"
import type { Lead } from "@/lib/types/lead"
import { toast } from "sonner"

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY","DC",
]

const DEV_AGENT_ID = "00000000-0000-0000-0000-000000000001"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  state: string
}

const EMPTY_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  state: "",
}

export function AddLeadDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const addLead = useLeadStore((s) => s.addLead)

  function handleChange(field: keyof FormData, value: string) {
    setForm({ ...form, [field]: value })
  }

  function handleSubmit() {
    if (!form.firstName.trim() && !form.lastName.trim() && !form.email.trim()) {
      toast.error("Please enter at least a name or email")
      return
    }

    const now = new Date().toISOString()
    const lead: Lead = {
      id: crypto.randomUUID(),
      agentId: DEV_AGENT_ID,
      firstName: form.firstName.trim() || null,
      lastName: form.lastName.trim() || null,
      email: form.email.trim().toLowerCase() || null,
      phone: form.phone.trim() || null,
      state: form.state || null,
      age: null,
      gender: null,
      tobaccoStatus: null,
      medicalConditions: [],
      duiHistory: false,
      yearsSinceLastDui: null,
      coverageAmount: null,
      termLength: null,
      source: "manual",
      rawCsvData: null,
      enrichment: null,
      quoteHistory: [],
      createdAt: now,
      updatedAt: now,
    }

    addLead(lead)
    toast.success("Lead added")
    setForm(EMPTY_FORM)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Lead</DialogTitle>
          <DialogDescription>
            Manually add a lead to your list.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select
              value={form.state}
              onValueChange={(v) => handleChange("state", v)}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((st) => (
                  <SelectItem key={st} value={st}>
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
