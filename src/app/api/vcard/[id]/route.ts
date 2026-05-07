import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

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

    let vCardData = `BEGIN:VCARD\r\nVERSION:3.0\r\n`
    vCardData += `FN:${card.owner_name}\r\n`
    vCardData += `N:${card.owner_name};;;;\r\n`
    
    if (card.company_name) vCardData += `ORG:${card.company_name}\r\n`
    if (card.job_title) vCardData += `TITLE:${card.job_title}\r\n`
    if (card.phone_number) vCardData += `TEL;TYPE=CELL:${card.phone_number}\r\n`
    if (card.email) vCardData += `EMAIL;TYPE=WORK:${card.email}\r\n`
    if (card.website) vCardData += `URL:${card.website}\r\n`
    
    if (card.profile_picture_url) {
      vCardData += `PHOTO;VALUE=URI:${card.profile_picture_url}\r\n`
    }

    vCardData += `END:VCARD`

    const fileName = `${card.owner_name?.replace(/\s+/g, '_')}_Contact.vcf`

    return new NextResponse(vCardData, {
      headers: {
        // text/x-vcard + no Content-Disposition forces iOS Safari to open
        // the native "Add to Contacts" screen instead of downloading a file.
        'Content-Type': 'text/x-vcard; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (err) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
