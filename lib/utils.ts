import { format } from 'date-fns'

export function formatDate(date: Date): string {
    return format(new Date(date), 'MMMM do, HH:mm') ?? "Date not available"
}