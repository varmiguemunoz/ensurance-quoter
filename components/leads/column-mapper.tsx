"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LEAD_FIELDS, type LeadField } from "@/lib/utils/csv-parser"

interface ColumnMapperProps {
  headers: string[]
  mapping: Record<string, LeadField>
  onMappingChange: (mapping: Record<string, LeadField>) => void
}

export function ColumnMapper({
  headers,
  mapping,
  onMappingChange,
}: ColumnMapperProps) {
  function handleChange(csvCol: string, leadField: LeadField) {
    onMappingChange({ ...mapping, [csvCol]: leadField })
  }

  const mappedCount = Object.values(mapping).filter((f) => f !== "skip").length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Map CSV columns to lead fields
        </p>
        <Badge variant="secondary">
          {mappedCount} of {headers.length} mapped
        </Badge>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {headers.map((header) => (
          <div
            key={header}
            className="flex items-center gap-3 rounded-md border p-2"
          >
            <span className="w-[140px] truncate text-sm font-medium">
              {header}
            </span>
            <span className="text-muted-foreground text-xs">&rarr;</span>
            <Select
              value={mapping[header] ?? "skip"}
              onValueChange={(v) => handleChange(header, v as LeadField)}
            >
              <SelectTrigger className="h-8 flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEAD_FIELDS.map((field) => (
                  <SelectItem key={field.value} value={field.value}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  )
}
