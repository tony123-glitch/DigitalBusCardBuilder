import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// This route handles /api/vcard/[id]/[anything].vcf
// The URL MUST end in .vcf for iOS Safari to open the native "Add to Contacts" screen.
export async function GET(request: Request, context: any) {
  try {
    const { id } = await context.params

    if (!id) {
      return new NextResponse('Missing ID', { status: 400 })
    }

    const { data: card, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !card) {
      return new NextResponse('Card not found', { status: 404 })
    }

    // Build the vCard. Use \r\n as required by the vCard spec.
    let vcard = `BEGIN:VCARD\r\nVERSION:3.0\r\n`
    vcard += `FN:${card.owner_name}\r\n`
    
    // Split name into parts for N field (Last;First;Middle;Prefix;Suffix)
    const nameParts = (card.owner_name || '').split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    vcard += `N:${lastName};${firstName};;;\r\n`

    if (card.company_name) vcard += `ORG:${card.company_name}\r\n`
    if (card.job_title)    vcard += `TITLE:${card.job_title}\r\n`
    if (card.phone_number) vcard += `TEL;TYPE=CELL,VOICE:${card.phone_number}\r\n`
    if (card.email)        vcard += `EMAIL;TYPE=INTERNET,WORK:${card.email}\r\n`
    if (card.website) {
      const url = card.website.startsWith('http') ? card.website : `https://${card.website}`
      vcard += `URL:${url}\r\n`
    }
    if (card.location) vcard += `ADR;TYPE=WORK:;;${card.location};;;;\r\n`
    if (card.profile_picture_url) {
      vcard += `PHOTO;VALUE=URI:${card.profile_picture_url}\r\n`
    }

    vcard += `END:VCARD`

    return new NextResponse(vcard, {
      headers: {
        // text/x-vcard + URL ending in .vcf = iOS Safari opens native Add to Contacts
        'Content-Type': 'text/x-vcard; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (err) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
