import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect root to admin dashboard since this is an internal builder
  redirect('/admin')
}
