import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('cards')
      .select(`
        *,
        card_social_links(platform, url),
        card_custom_buttons(label, url)
      `)
      .limit(1);

    return NextResponse.json({ data, error });
  } catch (err: any) {
    return NextResponse.json({ exception: err.message });
  }
}
